import { createHttpTerminator } from "http-terminator";
import { config } from "./config/env.config";
import { DBInit } from "./db";
import { app } from "./index";
import { Logger } from "./logging/logger";
import { handle } from "./util/error";

require("express-async-errors");

process.on("unhandledRejection", (error: Error) => {
  throw error;
});

process.on("uncaughtException", (error: Error) => {
  handle(error);
});

export const server = app.listen(config.port, async () => {
  Logger.info(
    `Shopping list backend listening at http://localhost:${config.port} in ${config.env} mode`
  );
  // TODO: implement auth server ping
  await DBInit();
});

const httpTerminator = createHttpTerminator({ server });

const shutdownSignals = ["SIGTERM", "SIGINT"];

export const shutdownGracefully = async (signal: string): Promise<void> => {
  Logger.info(`${signal} received, closing gracefully ...`);
  await httpTerminator.terminate();
  process.exit();
};

shutdownSignals.forEach((signal) =>
  process.on(signal, async () => {
    await shutdownGracefully(signal);
  })
);
