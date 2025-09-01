import { readFileSync } from "fs";

interface IConfiguration {
  "next-endpoints": {
    outDir: string;
    apiPrefix: string;
    endpointDir?: string;
    basePath: string;
  };
}

function readConfig(): IConfiguration {
  const config = readFileSync("package.json").toString();

  const parsed = JSON.parse(config) as Partial<IConfiguration>;

  parsed["next-endpoints"] ??= {
    outDir: "lib/api-client/generated",
    apiPrefix: "api/generated",
    basePath: "/",
  };

  parsed["next-endpoints"].outDir ??= "lib/api-client/generated";
  parsed["next-endpoints"].apiPrefix ??= "api/generated";
  parsed["next-endpoints"].basePath ??= "/";

  // Normalize basePath
  // Ensure it starts with a single "/" and does not end with a "/"
  if (!parsed["next-endpoints"].basePath.startsWith("/")) {
    parsed["next-endpoints"].basePath = `/${parsed["next-endpoints"].basePath}`;
  }
  if (parsed["next-endpoints"].basePath.endsWith("/")) {
    parsed["next-endpoints"].basePath = parsed["next-endpoints"].basePath.slice(
      0,
      -1,
    );
  }

  return parsed as IConfiguration;
}

export const config = readConfig();
