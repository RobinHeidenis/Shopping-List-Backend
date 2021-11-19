import { Request, Response } from "express";
import { Response as fetchResponse } from "node-fetch";
import { handleInvalidCredentialsException } from "../exceptions/invalidCredentials.exception";
import { Logger } from "../logging/logger";

const fetch = require("node-fetch");

const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  await fetch("http://auth:3002/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response: fetchResponse) =>
      response.json().then((result) => {
        if (result.status === "failure") {
          handleInvalidCredentialsException(res);
          return;
        }
        res.status(200).json({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      })
    )
    .catch((exception: Error) => {
      Logger.error(exception);
      res.sendStatus(500);
    });
};

export { login };
