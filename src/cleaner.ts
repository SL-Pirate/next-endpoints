import path from "node:path";
import { config } from "./config.js";
import { rmSync } from "node:fs";

export function cleanDirs() {
  const routesDir = path.resolve(
    process.cwd(),
    "app",
    config["next-endpoints"].apiPrefix,
  );
  const clientsDir = path.resolve(
    process.cwd(),
    config["next-endpoints"]?.outDir,
  );

  const protectedDirs = ["app", "lib", "src"];

  [routesDir, clientsDir].forEach((dir) => {
    if (protectedDirs.includes(dir)) {
      console.warn(`Refusing to delete root directory: ${dir}`);
      return;
    }
    try {
      // Use fs.rmSync with recursive option to delete the directory and its contents
      rmSync(dir, { recursive: true, force: true });
      console.log(`Deleted directory: ${dir}`);
    } catch (error) {
      // ignore
    }
  });
}
