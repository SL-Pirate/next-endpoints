#!/usr/bin/env node

import { findAnnotatedClasses } from "./reader.js";
import { generateApiRoute } from "./generators/api-routes/route.js";
import { generateApiClient } from "./generators/api-client.js";
import { generateControllerInstance } from "./generators/api-routes/controller.js";
import { cleanDirs } from "./cleaner.js"; // read args

// read args
const args = process.argv.slice(2);

if (args[0] === "generate") {
  // cleaning phase
  console.log("Cleaning existing generated files...");
  cleanDirs();

  const annotatedClasses = findAnnotatedClasses();
  annotatedClasses.forEach(({ klass, src }) => {
    if (!klass.getName()) {
      console.warn("Skipping class with no name");
      return;
    }

    generateApiClient({
      klass,
      src,
    }).then();

    generateControllerInstance(klass).then();

    // Clone properties (including arrow functions)
    klass.getProperties().forEach((prop) => {
      generateApiRoute({
        klass,
        src,
        prop,
      }).then();
    });
  });
}
