import { ApiMethod, Endpoint } from "next-endpoints/types";

@Endpoint()
export class HomeEndpoint {
  private readonly endpoint: string = "HomeEndpoint";

  getNames: ApiMethod<{}, Array<string>> = async (args, req) => {
    return ["Alice", "Bob", "Charlie"];
  };
}
