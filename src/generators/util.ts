import { SourceFile, Type } from "ts-morph";

export function resolveAndAddType(targetFile: SourceFile, type: Type|undefined): string {
  if (!type) {
    return "any";
  }

  const symbol = type.getSymbol();

  if (symbol) {
    const declarations = symbol.getDeclarations();
    if (declarations.length > 0) {
      const decl = declarations[0];

      if (!decl) {
        return type.getText();
      }

      const declSourceFile = decl.getSourceFile();

      // If type is from a different file, import it
      if (declSourceFile.getFilePath() !== targetFile.getFilePath()) {
        targetFile.addImportDeclaration({
          namedImports: [symbol.getName()],
          moduleSpecifier:
            targetFile.getRelativePathAsModuleSpecifierTo(declSourceFile),
        });
      } else {
        // If type is declared in the same source, copy the declaration
        // Only add if not already present in target
        if (!targetFile.getFullText().includes(symbol.getName())) {
          targetFile.addStatements(decl.getText());
        }
      }
      return symbol.getName();
    }
  }

  // Fallback: inline type definition
  return type.getText();
}
