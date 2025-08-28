import { ClassDeclaration, SourceFile } from "ts-morph";
import { project } from "./const.js";
import { config } from "./config.js";

export function findAnnotatedClasses() {
  const results: Array<{ klass: ClassDeclaration; src: SourceFile }> = [];

  let  srcFiles: Array<SourceFile>;

  if (config["next-endpoints"]?.endpointDir) {
    srcFiles = project.getSourceFiles(
      `${config["next-endpoints"]?.endpointDir}/**/*.ts`,
    );
  } else {
    srcFiles = project.getSourceFiles();
  }

  srcFiles.forEach((sf) => {
    sf.getClasses().forEach((cls) => {
      cls.getDecorators().forEach((dec) => {
        if (dec.getName() === "Endpoint") {
          results.push({
            klass: cls,
            src: sf,
          });
        }
      });
    });
  });

  return results;
}
