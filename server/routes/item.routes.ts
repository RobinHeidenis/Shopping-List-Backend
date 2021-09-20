const express = require("express");
const urlRoutes = express.Router();

const controller = require("../controllers/item.controller");

urlRoutes.post("/", controller.createOneRequest);
urlRoutes.get("/:id", controller.readOneRequest);
urlRoutes.patch("/:id", controller.updateOneRequest);
urlRoutes.delete("/:id", controller.deleteOneRequest);

module.exports = urlRoutes;
