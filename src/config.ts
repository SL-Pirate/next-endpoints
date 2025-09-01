import { readFileSync } from "fs";

interface IConfiguration {
  "next-endpoints": {
    outDir: string;
    apiPrefix: string;
    endpointDir?: string;
  };
}

function readConfig(): IConfiguration {
  const config = readFileSync("package.json").toString();

  const parsed = JSON.parse(config) as Partial<IConfiguration>;

  parsed["next-endpoints"] ??= {
    outDir: "lib/api-client/generated",
    apiPrefix: "api/generated",
  };

  parsed["next-endpoints"].outDir ??= "lib/api-client/generated";
  parsed["next-endpoints"].apiPrefix ??= "api/generated";

  return parsed as IConfiguration;
}

export const config = readConfig();
