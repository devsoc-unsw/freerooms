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

export const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export const MAPBOX_STYLE_LIGHT =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_LIGHT ??
  "mapbox://styles/mapbox/light-v11";

export const MAPBOX_STYLE_DARK =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_DARK ??
  "mapbox://styles/mapbox/dark-v11";
