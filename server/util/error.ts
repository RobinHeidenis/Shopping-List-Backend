import { Logger } from "../logging/logger";
import { shutdownGracefully } from "../server";

export const handle = (error: Error): void => {
  Logger.fatal(error.message);
  Logger.info(`${error.stack}`);
  process.exitCode = 1;
  shutdownGracefully("SIGTERM");
};
