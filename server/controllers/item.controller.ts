import { Item } from '../models/item.model';
import { handleDatabaseException } from '../exceptions/database.exception';
import { handleBadRequestException } from '../exceptions/badRequest.exception';
import { handleRecordNotFoundException } from '../exceptions/recordNotFound.exception';
import { HandledItemInterface } from '../interfaces/item/handledItem.interface';
import { UpdateSequencesItemInterface } from '../interfaces/item/updateSequencesItem.interface';

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

exports.readAllRequest = async (req, res) => {
  Item.findAll()
    .then((items) => res.status(200).send(items))
    .catch((e) => handleDatabaseException(e, res));
};

exports.updateOneRequest = async (req, res) => {
  const { id } = req.params;
  const {
    name, quantity, url, status,
  } = req.body;

  if (!id || !parseInt(id) || (!name && !quantity && !url && !status)) {
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

exports.updateSequencesRequest = async (req, res) => {
  const items: [UpdateSequencesItemInterface] = req.body;
  const handledItems: Array<HandledItemInterface> = [];

  if (!Array.isArray(items)) {
    handleBadRequestException(res);
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    if (Object.prototype.hasOwnProperty.call(item, 'id')
      && Object.prototype.hasOwnProperty.call(item, 'sequence')
    ) {
      // eslint-disable-next-line no-await-in-loop
      await Item.findByPk(item.id)
        .then(async (foundItem) => {
          if (foundItem) {
            await foundItem.update({ sequence: item.sequence });
            handledItems.push({ id: foundItem.id, sequence: foundItem.sequence });
          } else {
            handledItems.push({ id: item.id, sequence: item.sequence, error: { key: 'NOT_FOUND', message: 'Item not found' } });
          }
        })
        .catch((e) => { handleDatabaseException(e, res); });
    } else {
      handleBadRequestException(res);
      return;
    }
  }

  res.status(200).send(handledItems);
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

exports.deleteAllRequest = async (req, res) => {
  await Item.destroy({ truncate: true })
    .then(() => res.sendStatus(204))
    .catch((e) => handleDatabaseException(e, res));
};
