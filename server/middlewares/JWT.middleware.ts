import { NextFunction, Request, Response } from "express";

import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import { handleNoTokenException } from "../exceptions/noToken.exception";
import { handleUnauthorizedException } from "../exceptions/unauthorized.exception";
import { Logger } from "../logging/logger";

export const authenticateJWTMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.accessTokenSecret as Secret,
      (err: VerifyErrors | null) => {
        if (err) {
          Logger.error(err);
          handleUnauthorizedException(res);
          return;
        }
        next();
      }
    );
  } else {
    handleNoTokenException(res);
  }
};
