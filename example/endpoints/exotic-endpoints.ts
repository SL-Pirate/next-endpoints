import { Endpoint } from "next-endpoints/types";
import { ApiMethod } from "../../src/types";

@Endpoint()
export class ExoticEndpoints {
  ghostMethod: ApiMethod<void, void> = async () => {};
  getEventStream: ApiMethod<void, ReadableStream<{ count: number }>> =
    async () => {
      return new ReadableStream({
        async start(controller) {
          for (let i = 0; i < 1000; i++) {
            controller.enqueue({ count: i });

            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          controller.close();
        },
      });
    };
}
