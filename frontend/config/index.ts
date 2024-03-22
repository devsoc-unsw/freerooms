export enum Env {
  DEV = "development",
  PROD = "production",
  STAGING = "staging",
}

const env =
  process.env.NEXT_PUBLIC_STAGING === "true"
    ? Env.STAGING
    : process.env.NODE_ENV || Env.DEV;

// Backend API URL
const API_CONFIG: Record<string, string> = Object.freeze({
  [Env.DEV]: "http://localhost:3000",
  [Env.PROD]: "https://freerooms.devsoc.app",
  [Env.STAGING]: "https://freerooms.staging.csesoc.unsw.edu.au/",
});

export const API_URL: string = API_CONFIG[env] + "/api";

// Google Maps API Keys
const DEV_KEY = "AIzaSyCCcSB-yYX16Scr379XriL8UXkm7dqGnFM";
const PROD_KEY = "AIzaSyAfwBfVaKd7bzJlTGa2MJyijm_wDH68lKM";

const GOOGLE_API_CONFIG: Record<string, string> = Object.freeze({
  [Env.DEV]: DEV_KEY,
  [Env.PROD]: PROD_KEY,
  [Env.STAGING]: PROD_KEY,
});

export const GOOGLE_API_KEY = GOOGLE_API_CONFIG[env];
