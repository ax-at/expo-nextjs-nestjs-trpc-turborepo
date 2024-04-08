import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { AppContextFactory, AppModule, AppRouterFactory } from "@acme/api";

import { TRPC_ENDPOINT, TRPC_PLAYGROUND_ENDPOINT } from "./constants";
import { getFastifyTRPCPlaygroundPlugin } from "./trpc-playground";

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: {
      level: "info",
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.enableCors();

  const appRouter = app.get(AppRouterFactory).create();
  const createContext = app.get(AppContextFactory).create();

  app.register(fastifyTRPCPlugin, {
    prefix: TRPC_ENDPOINT,
    trpcOptions: { router: appRouter, createContext },
  });

  if (process.env.NODE_ENV === "development") {
    const fastifyTRPCPlaygroundPlugin =
      await getFastifyTRPCPlaygroundPlugin(appRouter);
    await app.register(fastifyTRPCPlaygroundPlugin, {
      prefix: TRPC_PLAYGROUND_ENDPOINT,
    });
  }

  await app.listen(4000, "0.0.0.0");
}

bootstrap();
