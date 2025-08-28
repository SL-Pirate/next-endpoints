export class HomeEndpointClient {
    static async getNames(args: {}, headers?: Record<string, string>): Promise<string[]> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/HomeEndpoint/getNames`, {
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
                  
                  return res.json();
              
    }

    static async createTrouble(args: { path: string; data: string; test: import("/home/slpirate/Commons/programming/ts/next-api-gen/example/lib/models/test-model").TestModel; }, headers?: Record<string, string>): Promise<{ message: string; }> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/HomeEndpoint/createTrouble`, {
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
                  
                  return res.json();
              
    }
}
