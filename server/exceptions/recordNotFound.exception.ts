import boom from "@hapi/boom";
import { Response } from "express";

export const handleRecordNotFoundException = (res: Response): void => {
  const {
    output: {
      statusCode,
      payload: { error, message },
    },
  } = boom.notFound("No record with that ID was found");
  res.status(statusCode).json({
    error,
    message,
  });
};
