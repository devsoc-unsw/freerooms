import dotenv from "dotenv";

dotenv.config({ path: "src/.env.local" });

export const GRAPHQL_API = "https://graphql.csesoc.app/v1/graphql";

export const PORT = 3000;

// set NODE_ENV to production when deployed
const env = process.env.NODE_ENV || "development";

export const MONGO_URI: string | undefined =
  env === "deployment"
    ? `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVICE_HOSTNAME}:27017`
    : process.env.MONGODB_URI;
