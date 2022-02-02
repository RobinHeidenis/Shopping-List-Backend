import boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(boom.notFound("The requested resource does not exist."));
};
