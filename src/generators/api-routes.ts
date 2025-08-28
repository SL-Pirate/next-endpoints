import {
  ClassDeclaration,
  PropertyDeclaration,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import path from "node:path";
import { project } from "../const.js";

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
    "app/api/generated",
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

  if (!inputType) {
    throw new Error(
      `Could not determine input type for method ${args.prop.getName()} in class ${args.klass.getName()}`,
    );
  }

  let body: string;
  if (inputType.isString()) {
    body = "await req.text()";
  } else {
    body = "await req.json()";
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
      const result = await new ${args.klass.getName()}().${args.prop.getName()}(
        body,
        req as any
      );
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
    `,
  });

  await src.save();
}
