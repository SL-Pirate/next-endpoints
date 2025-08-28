import type { NextRequest } from "next/server.js";

export function Endpoint(): ClassDecorator {
  return (target) => {};
}

export type ApiMethod<Inp extends object | Array<any> | string | number , Ret> = (args: Inp, req: NextRequest) => Promise<Ret>;
