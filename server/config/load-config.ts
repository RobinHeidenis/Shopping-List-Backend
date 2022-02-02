import dotenv from "dotenv";
import type { Schema } from "joi";
import { handle } from "../util/error";
import { EnvConfig } from "./env.config";

export const loadConfig = (schema: Schema): EnvConfig => {
  dotenv.config({ path: `${__dirname}/../../.env` });

  const { value, error } = schema.validate(process.env);
  if (error) {
    handle(new Error(`invalid environment: ${error.message}`));
  }
  return value;
};
