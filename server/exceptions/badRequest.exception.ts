import { Response } from "express";

export const handleBadRequestException = (res: Response): void => {
  res.status(400).json({
    error: true,
    key: "BAD_REQUEST",
    message: "The request couldn't be handled, because it was malformed",
  });
};
