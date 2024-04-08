export const BASE_ERROR_CODES = {
  OPERATION_NOT_PERFORMED: Symbol("OPERATION_NOT_PERFORMED"),
} as const;

export type ErrorOptions<T> = {
  code: T;
  message?: string;
  cause?: unknown;
};

export class BaseError<T> extends Error {
  public readonly cause?: Error;
  public readonly code;

  constructor(opts: ErrorOptions<T> & { name: string }) {
    const cause = getCauseFromUnknown(opts.cause);
    const message = opts.message ?? cause?.message ?? String(opts.code);

    super(message, { cause });

    this.code = opts.code;
    this.name = opts.name;

    if (!this.cause) {
      // < ES2022 / < Node 16.9.0 compatability
      this.cause = cause;
    }
  }
}

class UnknownError extends Error {
  [key: string]: unknown;
}

export function getCauseFromUnknown(cause: unknown): Error | undefined {
  if (cause instanceof Error) {
    return cause;
  }

  const type = typeof cause;
  if (type === "undefined" || type === "function" || cause === null) {
    return undefined;
  }

  // Primitive types just get wrapped in an error
  if (type !== "object") {
    return new Error(String(cause));
  }

  // If it's an object, we'll create a synthetic error
  if (isObject(cause)) {
    const err = new UnknownError();
    for (const key in cause) {
      err[key] = cause[key];
    }
    return err;
  }

  return undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && !Array.isArray(value) && typeof value === "object";
}
