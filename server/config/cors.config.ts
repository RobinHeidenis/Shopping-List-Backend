import { config } from "./env.config";

export const corsOptions = {
  origin:
    config.env !== "production"
      ? "http://localhost:3000"
      : "https://shared.heidenis.com",
  credentials: true,
};
