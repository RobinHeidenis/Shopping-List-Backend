export function createRoutes(controllerName: string) {
  const express = require('express');
  const urlRoutes = express.Router();

  const controller = require(controllerName);

  urlRoutes.post('/', controller.createOneRequest);
  urlRoutes.get('/:id', controller.readOneRequest);
  urlRoutes.patch('/:id', controller.updateOneRequest);
  urlRoutes.delete('/:id', controller.deleteOneRequest);

  return urlRoutes;
}
