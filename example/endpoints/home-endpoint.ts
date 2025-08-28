import { ApiMethod, Endpoint } from "next-endpoints/types";
import { writeFileSync } from "node:fs";
import { TestModel } from "@/lib/models/test-model";

@Endpoint()
export class HomeEndpoint {
  private readonly endpoint: string = "HomeEndpoint";

  getNames: ApiMethod<{}, Array<string>> = async (args) => {
    return ["Alice", "Bob", "Charlie"];
  };

  createTrouble: ApiMethod<
    { path: string; data: string; test: TestModel },
    { message: string }
  > = async (args, req) => {
    writeFileSync(args.path, args.data);

    return { message: "created!" };
  };
}
