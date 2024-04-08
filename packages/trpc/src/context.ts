import type { Logger } from "@acme/logging";
import { LoggerFactory } from "@acme/logging";

/**
 * CONTEXT:
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

const logger: Logger = LoggerFactory.getLogger("trpc");

export interface Session {
  user: {
    id: number;
  };
}

interface CreateInnerContextOptions {
  session: Session | null;
  source: string;
}

export const createInnerContext = (opts?: CreateInnerContextOptions) => {
  const source = opts?.source ?? "unknown";
  logger.info("tRPC Request from source: ", source);

  return {
    session: opts?.session,
  };
};

export type Context = ReturnType<typeof createInnerContext>;
