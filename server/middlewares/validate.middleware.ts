import boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  const {
    output: {
      statusCode,
      payload: { error, message },
    },
    data,
  } = boom.badData(
    "The data you provided did not pass validation",
    errors.array()
  );
  res.status(statusCode).json({
    error,
    message,
    data: { errors: data },
  });
};
