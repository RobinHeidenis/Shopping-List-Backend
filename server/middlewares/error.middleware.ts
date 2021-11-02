import boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { handle } from "../util/error";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    output: { payload: error, statusCode },
  } = boom.boomify(err);

  res.status(statusCode).json({ error });

  if (statusCode >= 500) {
    console.log(statusCode);
    handle(err);
  }
};
