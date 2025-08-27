import { Project } from "ts-morph";
import path from "node:path";

export const project = new Project({
  tsConfigFilePath: path.resolve(process.cwd(), "tsconfig.json"),
});
