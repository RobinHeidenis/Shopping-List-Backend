import { Item } from '../models/item.model';
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

  if (!name || !categoryId || !parseInt(categoryId)) {
    handleBadRequestException(res);
    return;
  }

  const catId = parseInt(categoryId);

  const numItems: number = await Item.max('sequence');

  Item.create({
    name, quantity, url, sequence: numItems + 1, categoryId: catId,
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

  const foundItem = await Item.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundItem) {
    res.status(200).json(foundItem);
  } else {
    handleRecordNotFoundException(res);
  }
};

exports.updateOneRequest = async (req, res) => {
  const { id } = req.params;
  const {
    name, quantity, url, status,
  } = req.body;

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

  const foundItem = await Item.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundItem) {
    foundItem.update({
      name, quantity, url, status,
    })
      .then((item) => res.status(200).json(item))
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

  const foundItem = await Item.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundItem) {
    foundItem.destroy()
      .then(() => res.sendStatus(204))
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

// todo add separate endpoint for updating sequences
