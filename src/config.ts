import { readFileSync } from "fs";

function readConfig(): {
  "next-api-gen"?: {
    outDir?: string;
    apiPrefix?: string;
  };
} {
  const config = readFileSync("package.json").toString();

  return JSON.parse(config);
}

export const config = readConfig();
