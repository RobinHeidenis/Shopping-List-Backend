import { StandardItem } from '../models/standardItem.model';
import { handleDatabaseException } from '../exceptions/database.exception';
import { handleBadRequestException } from '../exceptions/badRequest.exception';
import { handleRecordNotFoundException } from '../exceptions/recordNotFound.exception';

exports.createOneRequest = async (req, res) => {
  const {
    name,
    quantity,
    url,
    categoryId,
  } = req.body;
  // TODO: check if category exists, also do this with item.controller.ts

  if (!name || !categoryId || !parseInt(categoryId)) {
    handleBadRequestException(res);
    return;
  }

  const catId = parseInt(categoryId);

  StandardItem.create({
    name, quantity, url, categoryId: catId,
  })
    .then((item) => res.status(201).json(item))
    .catch((e) => handleDatabaseException(e, res));
};

exports.readOneRequest = async (req, res) => {
  const { id } = req.params;

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

  const foundStandardItem = await StandardItem.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundStandardItem) {
    res.status(200).json(foundStandardItem);
  } else {
    handleRecordNotFoundException(res);
  }
};

exports.updateOneRequest = async (req, res) => {
  const { id } = req.params;
  const {
    name, quantity, url,
  } = req.body;

  if (!id || !parseInt(id) || (!name && !quantity && !url)) {
    handleBadRequestException(res);
    return;
  }

  const foundStandardItem = await StandardItem.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundStandardItem) {
    foundStandardItem.update({
      name, quantity, url,
    })
      .then((standardItem) => res.status(200).json(standardItem))
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

exports.deleteOneRequest = async (req, res) => {
  const { id } = req.params;

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

  const foundStandardItem = await StandardItem.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundStandardItem) {
    foundStandardItem.destroy()
      .then(() => res.sendStatus(204))
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

exports.getAllRequest = async (req, res) => {
  StandardItem.findAll()
    .then((standardItems) => res.status(200).send(standardItems))
    .catch((e) => handleDatabaseException(e, res));
};
