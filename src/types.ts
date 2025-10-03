import type { NextRequest } from "next/server.js";

export function Endpoint(): ClassDecorator {
  return (target) => {};
}

export type ApiMethod<
  Inp extends object | Array<any> | string | number | boolean | void | Buffer,
  Ret extends
    | object
    | Array<any>
    | string
    | number
    | void
    | ReadableStream<string | number | boolean | object | Array<any>>
    | Buffer,
> = (args: Inp, req: NextRequest) => Promise<Ret>;
