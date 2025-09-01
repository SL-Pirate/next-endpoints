import { ITestType } from "../../../endpoints/types";

export class TestEndpointClient {
    static async fetchTests(args: ITestType, headers?: Record<string, string>): Promise<{ status: "Pass"; }> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/TestEndpoint/fetchTests`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...newHeaders,
                    },
                    body: JSON.stringify(args),
                  });
                  
                  if (!res.ok) {
                    throw new Error(JSON.stringify(await res.json()));
                  }
                  
                  return res.json()
              
    }

    static async testNo2(args: [string, number, string], headers?: Record<string, string>): Promise<{ result: string; error: null; loading: false; data: null; }> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/TestEndpoint/testNo2`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...newHeaders,
                    },
                    body: JSON.stringify(args),
                  });
                  
                  if (!res.ok) {
                    throw new Error(JSON.stringify(await res.json()));
                  }
                  
                  return res.json()
              
    }
}
