const PROD = process.env.NODE_ENV === "production";

export const DATABASE_URL = PROD ? "unknown" : "http://localhost:8080/v1/graphql";

export const PORT = 3000;