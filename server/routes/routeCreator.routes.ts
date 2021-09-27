const express = require('express');

export function createRoutes(controllerName: string) {
  const urlRoutes = express.Router();

  // eslint-disable-next-line global-require,import/no-dynamic-require
  const controller = require(controllerName);

  urlRoutes.post('/', controller.createOneRequest);
  urlRoutes.get('/all', controller.getAllRequest);
  urlRoutes.get('/:id', controller.readOneRequest);
  urlRoutes.patch('/:id', controller.updateOneRequest);
  urlRoutes.delete('/:id', controller.deleteOneRequest);

  return urlRoutes;
}
