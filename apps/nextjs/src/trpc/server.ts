import { cache } from "react";

import { createCallerFactory, createInnerContext } from "@acme/api";

/**
 * This wraps the `createInnerContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  return createInnerContext();
});

export const api = createCallerFactory(createContext);
