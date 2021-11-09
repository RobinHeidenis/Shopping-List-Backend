import boom from "@hapi/boom";
import { Response } from "express";

export const handleNoTokenException = (res: Response): void => {
  const {
    output: {
      statusCode,
      payload: { error, message },
    },
  } = boom.badRequest("No bearer token was sent with the request");
  res.status(statusCode).json({
    error,
    message,
  });
};
