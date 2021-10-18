const express = require("express");

const urlRoutes = express.Router();

const controller = require("../controllers/search.controller");

urlRoutes.get("/:query", controller.search);

module.exports = urlRoutes;
