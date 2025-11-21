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
  [Env.STAGING]: "https://freeroomsstaging.devsoc.app",
});

export const API_URL: string = API_CONFIG[env] + "/api";

// Google Maps API Keys
const DEV_KEY = "AIzaSyA8CNPhNUvBjLwxGPQ0mBZU5MJSVopEb2o";
const PROD_KEY = "AIzaSyAfwBfVaKd7bzJlTGa2MJyijm_wDH68lKM";

const GOOGLE_API_CONFIG: Record<string, string> = Object.freeze({
  [Env.DEV]: DEV_KEY,
  [Env.PROD]: PROD_KEY,
  [Env.STAGING]: PROD_KEY,
});

export const GOOGLE_API_KEY = GOOGLE_API_CONFIG[env];

// Public Mapbox access token
export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYmVuZ29kdyIsImEiOiJjbWJocHFzZG0wY3A0MmtwdnB1dTNlYmZrIn0.Mk0qDr5kM3N_d8UyIm7aAQ";
