import { Category } from '../models/category.model';
import { handleDatabaseException } from '../exceptions/database.exception';
import { handleBadRequestException } from '../exceptions/badRequest.exception';
import { handleRecordNotFoundException } from '../exceptions/recordNotFound.exception';

exports.createOneRequest = async (req, res) => {
  const { name, color } = req.body;

  if (!name || !color) {
    handleBadRequestException(res);
    return;
  }

  Category.create({ name, color })
    .then((category) => res.status(201).json(category))
    .catch((e) => handleDatabaseException(e, res));
};

exports.readOneRequest = async (req, res) => {
  const { id } = req.params;

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

  const foundCategory = await Category.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundCategory) {
    res.status(200).json(foundCategory);
  } else {
    handleRecordNotFoundException(res);
  }
};

exports.updateOneRequest = async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

  const foundCategory = await Category.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundCategory) {
    const category = await foundCategory.update({
      name, color,
    });

    res.status(200).json(category);
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

  const foundCategory = await Category.findByPk(id)
    .catch((e) => handleDatabaseException(e, res));

  if (foundCategory) {
    foundCategory.destroy()
      .then(() => res.sendStatus(204))
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};
