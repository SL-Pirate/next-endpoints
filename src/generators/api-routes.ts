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
  src.addFunction({
    name: "POST",
    isExported: true,
    isAsync: true,
    parameters: [{ name: "req", type: "NextRequest" }],
    returnType: "Promise<NextResponse>",
    statements: `
      const body = await req.json();
      const result = await new ${args.klass.getName()}().${args.prop.getName()}(
        body,
        req as any
      );
      return NextResponse.json(result);
    `,
  });

  await src.save();
}
