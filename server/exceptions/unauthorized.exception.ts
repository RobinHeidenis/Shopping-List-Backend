import boom from "@hapi/boom";
import { Response } from "express";

export const handleUnauthorizedException = (res: Response): void => {
  const {
    output: {
      statusCode,
      payload: { error, message },
    },
  } = boom.forbidden(
    "You are not authorized to access this resource, please log in"
  );
  res.status(statusCode).json({
    error,
    message,
  });
};
