const express = require("express");

export function createStandardRoutes(controllerName: string) {
  const urlRoutes = express.Router();

  // eslint-disable-next-line global-require,import/no-dynamic-require
  const controller = require(controllerName);

  urlRoutes.post("/", controller.createOneRequest);
  urlRoutes.get("/all", controller.readAllRequest);
  urlRoutes.get("/:id", controller.readOneRequest);
  urlRoutes.patch("/:id", controller.updateOneRequest);
  urlRoutes.delete("/all", controller.deleteAllRequest);
  urlRoutes.delete("/:id", controller.deleteOneRequest);

  return urlRoutes;
}
