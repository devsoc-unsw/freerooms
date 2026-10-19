const { writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { stringify } = require("yaml");
const { buildOpenAPIDocument } = require("express-zod-openapi-autogen");
const { router } = require("src/index.ts");

const openapiDocument = buildOpenAPIDocument({
  routers: [router],
  schemaPaths: [],
  config: {
    info: {
      title: "Freerooms API",
      version: "1.0.0",
      description: "API for finding available rooms and managing room ratings.",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  errors: {},
  openApiVersion: "3.0.3",
});

writeFileSync("./openapi.yaml", stringify(openapiDocument));
