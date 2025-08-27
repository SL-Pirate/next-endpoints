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
                  
                  return res.json();
              
    }
}
