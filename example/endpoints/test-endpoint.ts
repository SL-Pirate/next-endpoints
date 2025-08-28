import { ApiMethod, Endpoint } from "../../src/types";

@Endpoint()
export class TestEndpoint {
  fetchTests: ApiMethod<{ title: string }, { status: "Pass" | "Fail" }> =
    async (args) => {
      return { status: "Pass" };
    };
}
