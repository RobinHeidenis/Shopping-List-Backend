import { Response } from "express";

export const handleNoTokenException = (res: Response): void => {
  res.status(400).json({
    error: true,
    key: "NO_TOKEN",
    message: "No bearer token has been sent with the request",
  });
};
