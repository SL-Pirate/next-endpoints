import { NextRequest, NextResponse } from "next/server";
import { HomeEndpoint } from "../../../../../endpoints/home-endpoint";

export async function POST(req: NextRequest): Promise<NextResponse> {

        try {
          const body = await req.json();
          const result = await new HomeEndpoint().getNames(body, req as any);
          
          return NextResponse.json(result);
        } catch (err) {
        const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : (() => {
              try {
                return JSON.stringify(err);
              } catch {
                return "Unknown error";
              }
            })();
            
          return NextResponse.json({ message }, { status: 500 });
        }
        
}
