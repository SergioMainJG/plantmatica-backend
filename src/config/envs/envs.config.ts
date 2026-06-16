import { type } from "arktype";

const ENVS_SETTINGS = type({
  POSTGRES_DB: "string",
  POSTGRES_USER: "string",
  POSTGRES_PASSWORD: "string",
  POSTGRES_URL: "string",
}).readonly();

type ENVSI = typeof ENVS_SETTINGS.infer;

export const envs: ENVSI = ENVS_SETTINGS.assert({
  POSTGRES_DB: process.env['POSTGRES_DB'], 
  POSTGRES_USER: process.env['POSTGRES_USER'], 
  POSTGRES_PASSWORD: process.env['POSTGRES_PASSWORD'], 
  POSTGRES_URL: process.env['POSTGRES_URL'], 
});