import { readFileSync } from "fs";

function readConfig(): {
  "next-endpoints"?: {
    outDir?: string;
    apiPrefix?: string;
    endpointDir?: string;
  };
} {
  const config = readFileSync("package.json").toString();

  return JSON.parse(config);
}

export const config = readConfig();
