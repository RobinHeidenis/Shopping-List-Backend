import { config } from "./env.config";

export const corsOptions = {
  origin: config.env !== "production" ? "*" : "https://shared.heidenis.com",
};
