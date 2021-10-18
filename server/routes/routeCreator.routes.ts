import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";

const express = require("express");

export function createStandardRoutes(controllerName: string) {
  const router = express.Router();

  // eslint-disable-next-line global-require,import/no-dynamic-require
  const controller = require(controllerName);

  router.use(authenticateJWTMiddleware);

  router.post("/", controller.createOneRequest);
  router.get("/all", controller.readAllRequest);
  router.get("/:id", controller.readOneRequest);
  router.patch("/:id", controller.updateOneRequest);
  router.delete("/all", controller.deleteAllRequest);
  router.delete("/:id", controller.deleteOneRequest);

  return router;
}
