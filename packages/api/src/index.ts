import { NestFactory } from "@nestjs/core";
import { AppModule } from "app.module";

import type {
  inferRouterInputs,
  inferRouterOutputs,
  Session,
} from "@acme/trpc";
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
export type { AppRouter, RouterInputs, RouterOutputs, Session };
