import { handleBadRequestException } from "../exceptions/badRequest.exception";
import { handleInvalidCredentialsException } from "../exceptions/invalidCredentials.exception";
import { Logger } from "../logging/logger";

export {};

const fetch = require("node-fetch");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    handleBadRequestException(res);
    return;
  }

  await fetch("http://localhost:3002/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response) =>
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
    .catch((exception) => {
      Logger.error(exception);
      res.sendStatus(500);
    });
};
