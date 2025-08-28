import { config } from "../config.js";
import path from "node:path";
import { project } from "../const.js";
import { type ClassDeclaration, type SourceFile, SyntaxKind } from "ts-morph";

export async function generateApiClient(args: {
  klass: ClassDeclaration;
  src: SourceFile;
}) {
  if (!args.klass.getName()) {
    console.warn("Skipping class with no name");
    return;
  }

  const outDir =
    config["next-endpoints"]?.outDir ||
    path.resolve(process.cwd(), "lib/api-client/generated");
  const outputPath = path.resolve(outDir, `${args.klass.getName()}.ts`);

  const src = project.createSourceFile(outputPath, "", { overwrite: true });

  console.log("Generating API Client:", outputPath);

  src.addClass({
    name: args.klass.getName()! + "Client",
    isExported: true,
    methods: args.klass
      .getProperties()
      .filter(
        (prop) => prop.getInitializer()?.getKind() === SyntaxKind.ArrowFunction,
      )
      .map((prop) => {
        const arrowFunc = prop
          .getInitializer()
          ?.asKind(SyntaxKind.ArrowFunction);

        return {
          name: prop.getName(),
          isAsync: true,
          parameters: [
            {
              name: "args",
              type: arrowFunc?.getParameters()[0]!.getType().getText()!,
            },
            {
              name: "headers",
              type: "Record<string, string>",
              hasQuestionToken: true,
            },
          ],
          returnType: arrowFunc?.getReturnType()?.getText() || "Promise<any>",
          isStatic: true,
          statements: `
          const newHeaders = headers ? { ...headers } : {};

          const res = await fetch(\`/api/generated/${args.klass.getName()}/${prop.getName()}\`, {
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
          
          return res.json();
      `,
        };
      }),
  });

  await src.save();
}
