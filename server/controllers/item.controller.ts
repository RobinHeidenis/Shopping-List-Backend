import { Item } from '../../temp/item.model';
import { handleDatabaseException } from '../exceptions/database.exception';
import { handleBadRequestException } from '../exceptions/badRequest.exception';
import { handleRecordNotFoundException } from '../exceptions/recordNotFound.exception';

exports.createOneRequest = async (req, res) => {
  const {
    name,
    quantity,
    url,
    category,
  } = req.body;

  Item.create({
    name, quantity, url, sequence: await Item.max('sequence') as number + 1, category,
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
    const item = await foundItem.update({
      name, quantity, url, status,
    });

    res.status(200).json(item);
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
