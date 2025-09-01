import { config } from "../config.js";
import path from "node:path";
import { project } from "../const.js";
import {
  type ClassDeclaration,
  type OptionalKind,
  type ParameterDeclarationStructure,
  type SourceFile,
  SyntaxKind,
} from "ts-morph";
import { resolveAndAddType } from "./util.js";

export async function generateApiClient(args: {
  klass: ClassDeclaration;
  src: SourceFile;
}) {
  if (!args.klass.getName()) {
    console.warn("Skipping class with no name");
    return;
  }

  const outDir = path.resolve(process.cwd(), config["next-endpoints"].outDir);
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

        const inputType = arrowFunc?.getParameters()[0]?.getType();

        let contentTypeHeader: string;
        let body: string;

        if (!inputType) {
          contentTypeHeader = "text/plain";
          body = '""';
        } else if (inputType.isString()) {
          contentTypeHeader = "text/plain";
          body = "args";
        } else if (inputType.isVoid()) {
          contentTypeHeader = "text/plain";
          body = '""';
        } else {
          contentTypeHeader = "application/json";
          body = "JSON.stringify(args)";
        }

        function getReturn() {
          const returnType = arrowFunc?.getReturnType().getTypeArguments()[0];
          if (!returnType) {
            return "Promise<any>";
          } else if (returnType.isVoid()) {
            return "";
          } else if (returnType.getText().includes("ReadableStream")) {
            function getParseFunction(): string {
              const dataType = returnType?.getTypeArguments()[0]?.getText();
              return `
                function parseFunction(chunk: string): ${dataType} {
                  if (${dataType === "string"}) {
                    return chunk as any;
                  } else if (${dataType === "number"}) {
                    return Number(chunk) as any;
                  } else if (${dataType === "boolean"}) {
                    return (chunk === "true") as any;
                  } else {
                    return JSON.parse(chunk) as any;
                  }
                }
              `;
            }

            return `
            return new ReadableStream({
              async start(controller) {
                const reader = res.body!.getReader();
                const decoder = new TextDecoder();
    
                ${getParseFunction()}
                
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  
                  try {
                    const decoded = decoder.decode(value);
                    
                    const parsed = parseFunction(decoded.replace("data: ", "").trim());
                   
                    controller.enqueue(parsed); 
                  } catch (err) {
                    controller.error(err);
                    break;
                  }
                }
                
                controller.close();
              }
            });
            `;
          } else if (returnType.isString()) {
            return "return res.text()";
          } else if (returnType.getText().includes("Buffer")) {
            return "return res.arrayBuffer().then(buf => Buffer.from(buf))";
          } else {
            return "return res.json()";
          }
        }

        const params: OptionalKind<ParameterDeclarationStructure>[] = [
          {
            name: "args",
            type: resolveAndAddType(
              src,
              arrowFunc?.getParameters()[0]?.getType(),
            ),
            hasQuestionToken: false,
          },
          {
            name: "headers",
            type: "Record<string, string>",
            hasQuestionToken: true,
          },
        ];

        if (!inputType || inputType.isVoid()) {
          params.shift();
        }

        return {
          name: prop.getName(),
          isAsync: true,
          parameters: params,
          returnType: arrowFunc?.getReturnType()?.getText() || "Promise<any>",
          isStatic: true,
          statements: `
          const newHeaders = headers ? { ...headers } : {};

          const res = await fetch(\`/api/generated/${args.klass.getName()}/${prop.getName()}\`, {
            method: "POST",
            headers: {
              "Content-Type": "${contentTypeHeader}",
              ...newHeaders,
            },
            body: ${body},
          });
          
          if (!res.ok) {
            throw new Error(JSON.stringify(await res.json()));
          }
          
          ${getReturn()}
      `,
        };
      }),
  });

  await src.save();
}
