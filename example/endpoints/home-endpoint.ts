import { ApiMethod, Endpoint } from "next-api-gen/types";

@Endpoint()
export class HomeEndpoint {
  private readonly endpoint: string = "HomeEndpoint";

  getNames: ApiMethod<{}, Array<string>> = async (args, req) => {
    return ["Alice", "Bob", "Charlie"];
  };
}
