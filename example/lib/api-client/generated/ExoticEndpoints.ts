export class ExoticEndpointsClient {
    static async ghostMethod(headers?: Record<string, string>): Promise<void> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/ExoticEndpoints/ghostMethod`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "text/plain",
                      ...newHeaders,
                    },
                    body: "",
                  });
                  
                  if (!res.ok) {
                    throw new Error(JSON.stringify(await res.json()));
                  }
                  
                  
              
    }

    static async getEventStream(headers?: Record<string, string>): Promise<ReadableStream<{ count: number; }>> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/ExoticEndpoints/getEventStream`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "text/plain",
                      ...newHeaders,
                    },
                    body: "",
                  });
                  
                  if (!res.ok) {
                    throw new Error(JSON.stringify(await res.json()));
                  }
                  
                  
                    return new ReadableStream({
                      async start(controller) {
                        const reader = res.body!.getReader();
                        const decoder = new TextDecoder();
            
                        
                        function parseFunction(chunk: string): { count: number; } {
                          if (false) {
                            return chunk as any;
                          } else if (false) {
                            return Number(chunk) as any;
                          } else if (false) {
                            return (chunk === "true") as any;
                          } else {
                            return JSON.parse(chunk) as any;
                          }
                        }
                      
                        
                        while (true) {
                          const { done, value } = await reader.read();
                          if (done) break;
                          
                          try {
                            const decoded = decoder.decode(value);
                            
                            const parsed = parseFunction(decoded.replace("data: ", "").trim());
                           
                            controller.enqueue(parsed); 
                          } catch (err) {
                            controller.error(err);
                            break;
                          }
                        }
                        
                        controller.close();
                      }
                    });
                    
              
    }

    static async getFile(headers?: Record<string, string>): Promise<Buffer<ArrayBuffer>> {

                  const newHeaders = headers ? { ...headers } : {};

                  const res = await fetch(`/api/generated/ExoticEndpoints/getFile`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "text/plain",
                      ...newHeaders,
                    },
                    body: "",
                  });
                  
                  if (!res.ok) {
                    throw new Error(JSON.stringify(await res.json()));
                  }
                  
                  return res.arrayBuffer().then(buf => Buffer.from(buf))
              
    }
}
