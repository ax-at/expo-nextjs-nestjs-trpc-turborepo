/**
 * << README >>
 * Github Issue: https://github.com/sachinraja/trpc-playground/issues/55
 *
 * This file is a workaround for fixing issues with the schema generation for the trpc-playground package
 * with the V11 tRPC release. This file fixes an issue where the typescript types for the router are not resolved correctly
 *
 * This is due to the fact that the trpc package made some breaking changes to the router type
 * Issues this file fixes:
 *  - _def.query and _def.mutation are now replaced by a _def.type field which can be 'query' | 'mutation' | 'subscription'
 *
 * Example Usage with nextjs handler:
 * ```ts
 * import type { NextApiHandler } from 'next'
 * import { zodResolveTypes } from './trpc-playground-fix' // 👈 Import zodResolveTypes from this file
 * import { nextHandler } from 'trpc-playground/handlers/next'
 *
 * import { appRouter } from 'api'
 *
 * const setupHandler = nextHandler({
 *   router: appRouter,
 *   // tRPC api path, pages/api/trpc/[trpc].ts in this case
 *   trpcApiEndpoint: '/api/trpc',
 *   playgroundEndpoint: '/api/trpc-playground',
 *   resolveTypes: zodResolveTypes, // 👈 Pass in the updated zodResolveTypes function with the fixes
 *   request: {
 *     superjson: true,
 *   },
 * })
 *
 * const handler: NextApiHandler = async (req, res) => {
 *   const playgroundHandler = await setupHandler
 *   await playgroundHandler(req, res)
 * }
 *
 * export default handler
 * ```
 */

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ResolvedRouterSchema } from "@trpc-playground/types";
import type { AnyProcedure, AnyRouter } from "@trpc/server";
import type {
  AnyZodObject,
  ZodAny,
  ZodArrayDef,
  ZodEnumDef,
  ZodIntersectionDef,
  ZodLiteralDef,
  ZodMapDef,
  ZodNativeEnumDef,
  ZodNullableDef,
  ZodObjectDef,
  ZodOptionalDef,
  ZodPromiseDef,
  ZodRecordDef,
  ZodSetDef,
  ZodTupleDef,
  ZodUnionDef,
} from "zod";
import { set } from "lodash";
import { z, ZodFirstPartyTypeKind } from "zod";
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";

export type Procedures = Record<string, AnyProcedure>;

export type ProcedureTypes = Record<
  "queries" | "mutations",
  Record<string, string>
>;

const buildTrpcTsType = (router: AnyRouter, procedureTypes: ProcedureTypes) => {
  const procedures = router._def.procedures as Procedures;
  const procedureObject = {} as Record<string, string>;

  Object.entries(procedures)
    // This is the main breaking change, _def.query and _def.mutation are now replaced by a _def.type field
    // This is done a couple times in this file
    .filter(([, { _def }]) => _def.type === "query" || _def.type === "mutation")
    .forEach(([name, procedure]) => {
      let procedureTypeDef = "";

      const inputType =
        procedureTypes.mutations[name] || procedureTypes.queries[name] || "";
      if (procedure._def?.type === "query")
        procedureTypeDef += `query: (${inputType}) => void,`;
      else if (procedure._def?.type === "mutation")
        procedureTypeDef += `mutate: (${inputType}) => void,`;

      set(procedureObject, name, `{${procedureTypeDef}}`);
    });

  const buildNestedTrpcObject = (obj: Record<string, string>): string => {
    return Object.entries(obj)
      .map(([name, value]) => {
        if (typeof value === "string") return `'${name}': ${value}`;
        return `'${name}': {${buildNestedTrpcObject(value)}}`;
      })
      .join(",");
  };

  return `type Trpc = {${buildNestedTrpcObject(
    procedureObject,
  )}}\ndeclare var trpc: Trpc;`;
};

export const zodResolveTypes = async (
  router: AnyRouter,
): Promise<ResolvedRouterSchema> => {
  const { schemas, types } = getProcedureSchemas(router._def.procedures);

  return {
    tsTypes: buildTrpcTsType(router, types),
    ...schemas,
  };
};

export const getInputFromInputParsers = (inputs: ZodAny[]) => {
  if (inputs.length === 0) return null;
  if (inputs.length === 1) return inputs[0];

  const mergedObj = inputs.reduce((mergedObj, inputParser) => {
    return mergedObj.merge(inputParser as unknown as AnyZodObject);
  }, z.object({}));

  return mergedObj;
};

export const getProcedureSchemas = (procedures: Procedures) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const procedureSchemas: any = { queries: {}, mutations: {} };
  const procedureTypes: ProcedureTypes = { queries: {}, mutations: {} };

  Object.entries(procedures)
    .filter(([, { _def }]) => _def.type === "query" || _def.type === "mutation")
    .forEach(([procedureName, procedure]) => {
      // For some reason, inputs is not defined on procedure._def type but its there if you log the whole procedure
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const inputParser = getInputFromInputParsers(procedure._def.inputs);
      if (typeof inputParser === "function") {
        return z.any();
      }

      const defaultInputValue = inputParser
        ? getDefaultForDef(inputParser._def)
        : "";

      let procedureType = "";
      let docsType = "";

      if (inputParser) {
        const { node } = zodToTs(inputParser);
        procedureType = `input: ${printNode(node)}`;

        docsType = printNode(
          createTypeAlias(node, "input", inputParser.description),
        );
      }

      const procedureDefaults = {
        inputLength: defaultInputValue.length,
        value: `await trpc.${procedureName}.${
          procedure._def.type === "query" ? "query" : "mutate"
        }(${defaultInputValue})`,
      };

      const procedureObject =
        procedure._def.type === "query"
          ? procedureSchemas.queries
          : procedureSchemas.mutations;
      const typeProcedureObject =
        procedure._def.type === "query"
          ? procedureTypes.queries
          : procedureTypes.mutations;
      procedureObject[procedureName] = {
        default: procedureDefaults,
        type: docsType,
      };
      typeProcedureObject[procedureName] = procedureType;
    });

  return { schemas: procedureSchemas, types: procedureTypes };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDefaultForDef = (def: any): string => {
  if (!def) return "";

  switch (def.typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return defaultString();
    case ZodFirstPartyTypeKind.ZodDate:
      return defaultDate();
    case ZodFirstPartyTypeKind.ZodNumber:
      return defaultNumber();
    case ZodFirstPartyTypeKind.ZodBigInt:
      return defaultBigInt();
    case ZodFirstPartyTypeKind.ZodBoolean:
      return defaultBoolean();
    case ZodFirstPartyTypeKind.ZodUndefined:
      return defaultUndefined();
    case ZodFirstPartyTypeKind.ZodNull:
      return defaultNull();
    case ZodFirstPartyTypeKind.ZodObject:
      return defaultObject(def);
    case ZodFirstPartyTypeKind.ZodArray:
      return defaultArray(def);
    case ZodFirstPartyTypeKind.ZodTuple:
      return defaultTuple(def);
    case ZodFirstPartyTypeKind.ZodRecord:
      return defaultRecord(def);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return defaultLiteral(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return defaultNullable(def);
    case ZodFirstPartyTypeKind.ZodOptional:
      return defaultOptional(def);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return defaultIntersection(def);
    case ZodFirstPartyTypeKind.ZodEnum:
      return defaultEnum(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return defaultNativeEnum(def);
    case ZodFirstPartyTypeKind.ZodMap:
      return defaultMap(def);
    case ZodFirstPartyTypeKind.ZodSet:
      return defaultSet(def);
    case ZodFirstPartyTypeKind.ZodPromise:
      return defaultPromise(def);
    case ZodFirstPartyTypeKind.ZodNaN:
      return "NaN";
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
    case ZodFirstPartyTypeKind.ZodUnion:
      return defaultUnion(def);
    default:
      return "";
  }
};

const defaultString = () => {
  return `""`;
};

const defaultDate = () => {
  return `new Date()`;
};

const defaultNumber = () => {
  return `0`;
};

const defaultBigInt = () => {
  return `BigInt(0)`;
};

const defaultBoolean = () => {
  return `false`;
};

const defaultUndefined = () => {
  return `undefined`;
};

const defaultNull = () => {
  return `null`;
};

const defaultObject = (def: ZodObjectDef) => {
  let ret = `{ `;

  const entries = Object.entries(def.shape());
  entries.forEach(([name, propDef], idx) => {
    ret += `${name}: ${getDefaultForDef(propDef._def)}`;
    if (idx !== entries.length - 1) ret += `, `;
    else ret += ` `;
  });
  ret += `}`;

  return ret;
};

const defaultArray = (def: ZodArrayDef) => {
  return `[${getDefaultForDef(def.type._def)}]`;
};

const defaultTuple = (def: ZodTupleDef) => {
  let ret = `[`;
  for (let i = 0; i < def.items.length; i++) {
    const item = def.items[i];
    ret += `${getDefaultForDef(item?._def)}`;
    if (i !== def.items.length - 1) ret += ``;
  }

  return ret;
};

const defaultRecord = (_def: ZodRecordDef) => {
  return `{ ${getDefaultForDef(_def.keyType._def)}: ${getDefaultForDef(
    _def.valueType._def,
  )} }`;
};

const defaultLiteral = (def: ZodLiteralDef) => {
  return typeof def.value === "string" ? `"${def.value}"` : `${def.value}`;
};

const defaultNullable = (def: ZodNullableDef) => {
  return getDefaultForDef(def.innerType._def);
};

const defaultOptional = (def: ZodOptionalDef) => {
  return getDefaultForDef(def.innerType._def) ?? `undefined`;
};

const defaultEnum = (def: ZodEnumDef) => {
  return `"${def.values[0]}"`;
};

const defaultUnion = (def: ZodUnionDef) => {
  const options =
    def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.length === 0) return "";
  return getDefaultForDef(options[0]._def);
};

// Does not work correctly
const defaultIntersection = (def: ZodIntersectionDef) => {
  return getDefaultForDef(def.right._def);
};

// don't know if this is the best solution
const defaultNativeEnum = (def: ZodNativeEnumDef) => {
  const val = Object.values(def.values)[Object.values(def.values).length - 1];
  if (val) {
    return typeof val === "string" ? `"${val}"` : `${val}`;
  }

  return "";
};

const defaultMap = (_def: ZodMapDef) => {
  return `new Map([[${getDefaultForDef(_def.keyType._def)}, ${getDefaultForDef(
    _def.valueType._def,
  )}]])`;
};

const defaultSet = (_def: ZodSetDef) => {
  return `new Set([${getDefaultForDef(_def.valueType._def)}])`;
};

const defaultPromise = (def: ZodPromiseDef) => {
  return `Promise.resolve(${getDefaultForDef(def.type._def)})`;
};
