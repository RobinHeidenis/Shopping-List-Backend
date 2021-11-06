import { Logger } from "../logging/logger";

export const handle = (error: Error): void => {
  Logger.fatal(error.message);
  Logger.info(`${error.stack}`);
  process.exitCode = 1;
  process.kill(process.pid, "SIGTERM");
};
