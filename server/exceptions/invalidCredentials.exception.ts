import { Response } from "express";

export const handleInvalidCredentialsException = (res: Response): void => {
  res.status(403).json({
    error: true,
    key: "BAD_CREDENTIALS",
    message: "The entered credentials were invalid",
  });
};
