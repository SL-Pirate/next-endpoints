import { __type } from "../../../endpoints/home-endpoint";

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
                  
                  return res.json()
              
    }

    static async createTrouble(args: __type, headers?: Record<string, string>): Promise<{ message: string; }> {

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
                  
                  return res.json()
              
    }
}
