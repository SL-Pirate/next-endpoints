import type { NextRequest } from "next/server.js";

export function Endpoint(): ClassDecorator {
  return (target) => {};
}

export type ApiMethod<T, R> = (args: T, req: NextRequest) => Promise<R>;
