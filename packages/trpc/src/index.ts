import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { Context, Session } from "context";
import { TRPCError } from "@trpc/server";
import { createInnerContext } from "context";

export * from "trpc";
export {
  TRPCError,
  Context,
  Session,
  createInnerContext,
  inferRouterInputs,
  inferRouterOutputs,
};

/**
 * Below types needs to be exported.
 * Due to the issues coming in apps:
 * - "property collision with a built-in method"
 * - "router types not being inferred on apps"
 *
 * see: https://github.com/trpc/trpc/issues/5614
 */
export {
  type TRPC_ERROR_CODE_NUMBER,
  type BuiltRouter,
  type QueryProcedure,
  type MutationProcedure,
  type DecorateCreateRouterOptions,
  type RouterCaller,
  type Router,
} from "@trpc/server/unstable-core-do-not-import";
