import boom from "@hapi/boom";
import { Response } from "express";

export const handleInvalidCredentialsException = (res: Response): void => {
  const {
    output: {
      statusCode,
      payload: { error, message },
    },
  } = boom.forbidden("The entered credentials were invalid");
  res.status(statusCode).json({
    error,
    message,
  });
};
