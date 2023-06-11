export enum Env {
  DEV = "development",
  PROD = "production",
}


// Backend API URL
const LOCAL = "http://localhost:3000";
const LIVE = "https://freerooms.csesoc.app";

const API_CONFIG: Record<string, string> = Object.freeze({
  [Env.DEV]: LOCAL,
  [Env.PROD]: LIVE,
});

export const API_URL: string = API_CONFIG[process.env.NODE_ENV || Env.DEV] + "/api";


// Google Maps API Keys
const DEV_KEY = "AIzaSyCCcSB-yYX16Scr379XriL8UXkm7dqGnFM";
const PROD_KEY = "AIzaSyAfwBfVaKd7bzJlTGa2MJyijm_wDH68lKM";

const GOOGLE_API_CONFIG: Record<string, string> = Object.freeze({
  [Env.DEV]: DEV_KEY,
  [Env.PROD]: PROD_KEY
});

export const GOOGLE_API_KEY = GOOGLE_API_CONFIG[process.env.NODE_ENV || Env.DEV];
