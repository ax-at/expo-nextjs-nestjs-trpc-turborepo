import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "app.module";

import type { AppRouter } from "./app.router";
import type { Session } from "./context";
import { AppContextFactory } from "./app.context";
import { AppRouterFactory } from "./app.router";
import { createInnerContext } from "./context";
import { createCallerFactory } from "./trpc";

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

const createAppRouter = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appRouterFactory = app.get(AppRouterFactory);
  const appRouter = appRouterFactory.create();
  return appRouter;
};

export {
  createAppRouter,
  createCallerFactory,
  createInnerContext,
  AppContextFactory,
  AppRouterFactory,
  AppModule,
};
export type { Session, AppRouter, RouterInputs, RouterOutputs };

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
