import { type } from "arktype";

const symbolicKey = Symbol()

const ENVS_SETTINGS = type({
  [symbolicKey]: "string",
  POSTGRES_DB: "string",
  POSTGRES_USER: "string",
  POSTGRES_PASSWORD: "string",
  POSTGRES_URL: "string",
}).readonly();

type ENVSI = typeof ENVS_SETTINGS.infer;


export const envs: ENVSI = ENVS_SETTINGS.assert({
  [symbolicKey]: "global-envs",
  POSTGRES_DB: process.env['POSTGRES_DB'], 
  POSTGRES_USER: process.env['POSTGRES_USER'], 
  POSTGRES_PASSWORD: process.env['POSTGRES_PASSWORD'], 
  POSTGRES_URL: process.env['POSTGRES_URL'], 
});