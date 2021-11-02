import dotenv from "dotenv";
import type { Schema } from "joi";
import { handle } from "../util/error";

export const loadConfig = (schema: Schema): any => {
  dotenv.config({ path: `${__dirname}/../../.env` });

  const { value, error } = schema.validate(process.env);
  if (error) {
    handle(new Error(`invalid environment: ${error.message}`));
  }
  return value;
};
