import {
  ClassDeclaration,
  PropertyDeclaration,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import path from "node:path";
import { project } from "../../const.js";
import { config } from "../../config.js";
import { resolveApiPath } from "../util.js";

export async function generateApiRoute(args: {
  klass: ClassDeclaration;
  prop: PropertyDeclaration;
  src: SourceFile;
}) {
  if (!args.klass.getName()) {
    console.warn("Skipping class with no name");
    return;
  }
  if (args.prop.getInitializer()?.getKind() !== SyntaxKind.ArrowFunction) {
    return;
  }

  const resolvedPath = resolveApiPath(
    args.klass.getName()!,
    args.prop.getName(),
  );

  const outputPath = path.resolve(
    process.cwd(),
    "app",
    config["next-endpoints"].apiPrefix,
    resolvedPath.className,
    resolvedPath.funcName,
    "route.ts",
  );

  const src = project.createSourceFile(outputPath, "", { overwrite: true });

  console.log("Generating API Route:", outputPath);
  src.addImportDeclaration({
    namedImports: ["NextRequest", "NextResponse"],
    moduleSpecifier: "next/server",
  });
  src.addImportDeclaration({
    namedImports: ["controller"],
    moduleSpecifier: "../controller",
  });

  const arrowFunc = args.prop
    .getInitializer()
    ?.asKind(SyntaxKind.ArrowFunction);

  if (!arrowFunc) {
    throw new Error(
      `Property ${args.prop.getName()} in class ${args.klass.getName()} is not an arrow function`,
    );
  }

  const inputType = arrowFunc?.getParameters()[0]?.getType();
  const outputType = arrowFunc?.getReturnType().getTypeArguments()[0];

  function getApiResponseStatement() {
    if (outputType?.isString()) {
      return `
        const xHeaders: Record<string, string> = {};
        for (const [key, value] of req.headers.entries()) {
          if (key.startsWith("x-") || key.startsWith("X-")) {
            xHeaders[key] = value;
          }
        }
        
        return new NextResponse(result, { headers: xHeaders })
      `;
    } else if (outputType?.getText().includes("ReadableStream")) {
      return `
        function toString(chunk: string | number | boolean | object | Array<any> ): string {
          if (typeof chunk === "string") {
            return chunk;
          } else if (typeof chunk === "number" || typeof chunk === "boolean") {
            return chunk.toString();
          } else {
            return JSON.stringify(chunk);
          }
        }
      
        const resHeaders: Record<string, string> = {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          };

        for (const [key, value] of req.headers.entries()) {
          if (key.startsWith("x-") || key.startsWith("X-")) {
            resHeaders[key] = value;
          }
        }

        return new NextResponse(
          result.pipeThrough(
            new TransformStream({
              transform: (chunk, controller) => controller.enqueue("data: " + toString(chunk) + "\\n\\n")
            })
          ), 
          { headers: resHeaders }
        )
      `;
    } else if (outputType?.getText().includes("Buffer")) {
      return `
        const xHeaders: Record<string, string> = {
            "Content-Type": "application/octet-stream",
            "Content-Length": result.length.toString(),
          };

        for (const [key, value] of req.headers.entries()) {
          if (key.startsWith("x-") || key.startsWith("X-")) {
            xHeaders[key] = value;
          }
        }

        return new NextResponse(result as any, { headers: xHeaders })
      `;
    } else if (
      outputType?.isNumber() ||
      outputType?.isBoolean() ||
      outputType?.isObject() ||
      outputType?.isArray() ||
      outputType?.isUnion()
    ) {
      return `
        const xHeaders: Record<string, string> = {};
        for (const [key, value] of req.headers.entries()) {
          if (key.startsWith("x-") || key.startsWith("X-")) {
              xHeaders[key] = value;
          }
        }
      
        return NextResponse.json(result, { headers: xHeaders })
      `;
    } else if (outputType?.isVoid()) {
      return `
        const xHeaders: Record<string, string> = {};
        for (const [key, value] of req.headers.entries()) {
          if (key.startsWith("x-") || key.startsWith("X-")) {
            xHeaders[key] = value;
          }
        }
        
        return new NextResponse(null, { status: 204, headers: xHeaders });
      `;
    } else {
      // return "return new NextResponse(result.toString())";
      `
        const xHeaders: Record<string, string> = {};
        for (const [key, value] of req.headers.entries()) {
          if (key.startsWith("x-") || key.startsWith("X-")) {
            xHeaders[key] = value;
          }
        }
        
        return new NextResponse(result.toString(), {headers: xHeaders})
      `;
    }
  }

  let body: string;
  if (!inputType || inputType.isString() || inputType.isVoid()) {
    body = "await req.text()";
  } else if (inputType.getText().includes("Buffer")) {
    body = "Buffer.from(await req.arrayBuffer())";
  } else {
    body = "await req.json()";
  }

  function getArgsForEndpoint() {
    if (!inputType) {
      return "(undefined, req as any)";
    } else if (inputType.isVoid()) {
      return "(void, req as any)";
    } else {
      return "(body, req as any)";
    }
  }

  src.addFunction({
    name: "POST",
    isExported: true,
    isAsync: true,
    parameters: [{ name: "req", type: "NextRequest" }],
    returnType: "Promise<NextResponse>",
    statements: `
    try {
      const body = ${body};
      const result = await controller.${args.prop.getName()}${getArgsForEndpoint()};
      
      ${getApiResponseStatement()};
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
    `,
  });

  await src.save();
}
