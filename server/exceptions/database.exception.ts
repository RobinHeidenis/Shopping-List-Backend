import boom from "@hapi/boom";
import { Response } from "express";
import { Logger } from "../logging/logger";

export const handleDatabaseException = (e: Error, res: Response): void => {
  Logger.error(e);
  const {
    output: {
      payload: { error, message },
      statusCode,
    },
  } = boom.internal();
  res.status(statusCode).json({
    error,
    message,
  });
};
