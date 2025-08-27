import { ClassDeclaration, SourceFile } from "ts-morph";
import { project } from "./const.js";

export function findAnnotatedClasses() {
  const results: Array<{ klass: ClassDeclaration; src: SourceFile }> = [];

  project.getSourceFiles().forEach((sf) => {
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
