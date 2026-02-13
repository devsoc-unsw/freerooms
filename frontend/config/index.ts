export enum Env {
  DEV = "development",
  PROD = "production",
  STAGING = "staging",
}

export const BACKEND_URL = process.env.BACKEND_URL
  ? process.env.BACKEND_URL
  : "localhost:3000";

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
