#!/usr/bin/env node

import { findAnnotatedClasses } from "./reader.js";
import { generateApiRoute } from "./generators/api-routes.js";
import { generateApiClient } from "./generators/api-client.js"; // read args

// read args
const args = process.argv.slice(2);

if (args[0] === "generate") {
  const annotatedClasses = findAnnotatedClasses();
  annotatedClasses.forEach(({ klass, src }) => {
    if (!klass.getName()) {
      console.warn("Skipping class with no name");
      return;
    }

    // Clone properties (including arrow functions)
    klass.getProperties().forEach((prop) => {
      Promise.all([
        generateApiRoute({
          klass,
          src,
          prop,
        }),

        generateApiClient({
          klass,
          src,
        }),
      ]).then(() => {});
    });
  });
}
