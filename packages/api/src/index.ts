import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppModule } from "app.module";

import { createCallerFactory, createInnerContext } from "@acme/trpc";

import type { AppRouter } from "./app.router";
import { AppContextFactory } from "./app.context";
import { AppRouterFactory } from "./app.router";

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

export {
  createCallerFactory,
  createInnerContext,
  AppContextFactory,
  AppRouterFactory,
  AppModule,
};
export type { AppRouter, RouterInputs, RouterOutputs };
