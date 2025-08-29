import { ApiMethod, Endpoint } from "../../src/types";
import { IReturnType, ITestType } from "@/endpoints/types";

@Endpoint()
export class TestEndpoint {
  fetchTests: ApiMethod<ITestType, { status: "Pass" | "Fail" }> = async (
    args,
  ) => {
    return { status: "Pass" };
  };

  testNo2: ApiMethod<[string, number, string], IReturnType> = async (args) => {
    return {
      result: `Received: ${args}`,
      error: null,
      loading: false,
      data: null,
    };
  };
}
