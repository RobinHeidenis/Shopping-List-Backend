import { Logger } from "../logging/logger";
import { handleUnauthorizedException } from "../exceptions/unauthorized.exception";
import { handleNoTokenException } from "../exceptions/noToken.exception";

const jwt = require("jsonwebtoken");

export const authenticateJWTMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.accessTokenSecret, (err, user) => {
      if (err) {
        Logger.error(err);
        handleUnauthorizedException(res);
        return;
      }
      req.user = user;
      next();
    });
  } else {
    handleNoTokenException(res);
  }
};
