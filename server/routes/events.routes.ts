export {};

const express = require("express");

const urlRoutes = express.Router();

const controller = require("../controllers/events.controller");

urlRoutes.get("/", controller.events);

module.exports = urlRoutes;
