import { Response } from "express";
import { Logger } from "../logging/logger";

export const handleDatabaseException = (e: Error, res: Response): void => {
  Logger.error(e);
  res.status(500).json({
    error: true,
    key: "DATABASE_EXCEPTION",
    message: "An error has occured, please try again later",
  });
};
