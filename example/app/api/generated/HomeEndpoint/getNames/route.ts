import { NextRequest, NextResponse } from "next/server";
import { HomeEndpoint } from "../../../../../endpoints/home-endpoint";

export async function POST(req: NextRequest): Promise<NextResponse> {

          const body = await req.json();
          const result = await new HomeEndpoint().getNames(
            body,
            req as any
          );
          return NextResponse.json(result);
        
}
