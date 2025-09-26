import {SourceFile, Type} from "ts-morph";

export function resolveApiPath(className: string, funcName: string) {
    let classNamePart: string;
    let funcNamePart: string;

    // lowercasing
    classNamePart = className.toLowerCase();
    funcNamePart = funcName.toLowerCase();

    // stripping endpoint suffix if exists
    classNamePart = classNamePart.replaceAll("endpoint", "")

    return {
        className: classNamePart,
        funcName: funcNamePart,
        fullPath: `${classNamePart}/${funcNamePart}`,
    };
}

export function resolveAndAddType({sourceFile, targetFile, type}: {
    sourceFile: SourceFile,
    targetFile: SourceFile,
    type: Type | undefined
}): string {
    if (!type) {
        return "any";
    }

    // Handle inline object types directly
    if (type.isObject() || type.getText().startsWith('{')) {
        return type.getText();
    }

    const symbol = type.getSymbol();

    if (symbol) {
        const symbolName = symbol.getName();

        // Skip internal/anonymous type names (like __type)
        if (symbolName.startsWith('__')) {
            return type.getText();
        }

        const declarations = symbol.getDeclarations();
        if (declarations.length > 0) {
            const decl = declarations[0];

            if (!decl) {
                return type.getText();
            }

            const declSourceFile = decl.getSourceFile();

            // Only import if it's actually an exported symbol
            if (declSourceFile.getFilePath() !== targetFile.getFilePath() && sourceFile.getExportSymbols().includes(symbol)) {
                targetFile.addImportDeclaration({
                    namedImports: [symbolName],
                    moduleSpecifier:
                        targetFile.getRelativePathAsModuleSpecifierTo(declSourceFile),
                });
                return symbolName;
            } else if (declSourceFile.getFilePath() === targetFile.getFilePath()) {
                // If type is declared in the same source, copy the declaration
                if (!targetFile.getFullText().includes(symbolName)) {
                    targetFile.addStatements(decl.getText());
                }
                return symbolName;
            }
        }
    }

    // Fallback: use the original type text
    return type.getText();
}
