import { type ClassDeclaration, VariableDeclarationKind } from "ts-morph";
import { config } from "../../config.js";
import { project } from "../../const.js";
import path from "node:path";

export async function generateControllerInstance(klass: ClassDeclaration) {
  const outputPath = path.resolve(
    process.cwd(),
    "app",
    config["next-endpoints"].apiPrefix,
    klass.getName()!,
    "controller.ts",
  );
  const file = project.createSourceFile(outputPath, "", { overwrite: true });

  file.addImportDeclaration({
    namedImports: [klass.getName()!],
    moduleSpecifier: path.relative(
      path.dirname(outputPath),
      klass.getSourceFile().getFilePath().replace(/\.ts$/, ""),
    ),
  });

  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: "controller",
        initializer: `new ${klass.getName()}()`,
      },
    ],
  });

  await file.save();
}
