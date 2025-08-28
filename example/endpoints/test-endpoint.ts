import { ApiMethod, Endpoint } from "../../src/types";

@Endpoint()
export class TestEndpoint {
  fetchTests: ApiMethod<{ title: string }, { status: "Pass" | "Fail" }> =
    async (args) => {
      return { status: "Pass" };
    };

  testNo2: ApiMethod<[string, number, string], { result: string }> = async (args) => {
    return { result: `Received: ${args}` };
  };
}
