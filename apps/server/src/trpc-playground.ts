import { AnyTRPCRouter } from "@trpc/server";
import { getFastifyPlugin } from "trpc-playground/handlers/fastify";

import { TRPC_ENDPOINT, TRPC_PLAYGROUND_ENDPOINT } from "./constants";
import { zodResolveTypes } from "./trpc-playground-fix";

const getFastifyTRPCPlaygroundPlugin = (router: AnyTRPCRouter) =>
  getFastifyPlugin({
    trpcApiEndpoint: TRPC_ENDPOINT,
    playgroundEndpoint: TRPC_PLAYGROUND_ENDPOINT,
    router: router,
    resolveTypes: zodResolveTypes,
    request: {
      superjson: false,
    },
  });

export { getFastifyTRPCPlaygroundPlugin };
