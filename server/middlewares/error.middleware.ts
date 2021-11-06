import boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { config } from "../config/env.config";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction //eslint-disable-line
): void => {
  if (config.env === "test") {
    next();
    return;
  }
  const {
    output: { payload: error, statusCode },
  } = boom.boomify(err);

  res.status(statusCode).json({ error });

  if (statusCode >= 500) {
    throw error;
  }
};
