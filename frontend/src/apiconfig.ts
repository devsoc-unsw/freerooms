export enum Env {
  DEV = 'development',
  PROD = 'production',
}

const LOCAL = 'http://localhost:3000';
const LIVE = 'https://timetable.csesoc.app';

const API_CONFIG: Record<string, string> = Object.freeze({
  [Env.DEV]: `${LOCAL}`,
  [Env.PROD]: `${LIVE}`,
});

export const API_URL: string = API_CONFIG[process.env.VUE_APP_ENVIRONMENT || Env.DEV];
