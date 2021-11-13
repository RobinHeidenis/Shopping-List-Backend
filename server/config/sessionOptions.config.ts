import { SessionOptions } from "express-session";
import { config } from "./env.config";
import { sessionStore } from "./sessionStore.config";

export const sessionOptions: SessionOptions = {
  secret: config.tokens.access || "",
  store: sessionStore,
  resave: false,
  cookie: {
    secure: false,
  },
  saveUninitialized: true,
  name: "sessionId",
};

if (config.env === "production") {
  if (sessionOptions && sessionOptions.cookie) {
    sessionOptions.cookie.secure = true;
  }
}
