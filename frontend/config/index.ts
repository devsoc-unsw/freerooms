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

// Fall back to restricted public key if none is provided (only works on *.devsoc.app)
export const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoiZGV2c29jIiwiYSI6ImNtdG1sd3FjZjA5c2QyeXB1MXRjZDloNTYifQ.odb02EqDnplMwcmFVJ_e8g";

export const MAPBOX_STYLE_LIGHT =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_LIGHT ??
  "mapbox://styles/mapbox/light-v11";

export const MAPBOX_STYLE_DARK =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_DARK ??
  "mapbox://styles/mapbox/dark-v11";
