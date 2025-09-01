import {
  ClassDeclaration,
  PropertyDeclaration,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import path from "node:path";
import { project } from "../../const.js";
import { config } from "../../config.js";

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

  const outputPath = path.resolve(
    process.cwd(),
    "app",
    config["next-endpoints"].apiPrefix,
    args.klass.getName()!,
    args.prop.getName(),
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
  src.addImportDeclaration({
    namedImports: [args.klass.getName()!],
    moduleSpecifier: path.relative(
      path.dirname(outputPath),
      args.src.getFilePath().replace(/\.ts$/, ""),
    ),
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
      return "return new NextResponse(result)";
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
      
        return new NextResponse(result.pipeThrough(
              new TransformStream({
                transform: (chunk, controller) => controller.enqueue("data: " + toString(chunk) + "\\n\\n")
              })
            ), {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        })
      `;
    } else if (outputType?.getText().includes("Buffer")) {
      return `
        return new NextResponse(result as any, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": result.length.toString(),
          },
        })
      `;
    } else if (
      outputType?.isNumber() ||
      outputType?.isBoolean() ||
      outputType?.isObject() ||
      outputType?.isArray()
    ) {
      return "return NextResponse.json(result)";
    } else if (outputType?.isVoid()) {
      return "return new NextResponse(null, { status: 204 })";
    }
  }

  let body: string;
  if (!inputType || inputType.isString() || inputType.isVoid()) {
    body = "await req.text()";
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
