import { Response } from "express";

export const handleUnauthorizedException = (res: Response): void => {
  res.status(403).json({
    error: true,
    key: "UNAUTHORIZED",
    message: "You are not authorized to access this resource, please log in",
  });
};
