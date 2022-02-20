import { Request, Response } from "express";
import { handleDatabaseException } from "../exceptions/database.exception";
import { handleRecordNotFoundException } from "../exceptions/recordNotFound.exception";
import { Category } from "../models/category.model";
import { StandardItem } from "../models/standardItem.model";
import { sendSSEMessage } from "./events.controller";

const createOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { name, quantity, url, categoryId } = req.body;

  const foundCategory = await Category.findByPk(categoryId).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (!foundCategory) {
    handleRecordNotFoundException(res);
  }

  StandardItem.create({
    name,
    quantity,
    url,
    categoryId,
  })
    .then(async ({ id }) => {
      const standardItem = await StandardItem.findByPk(id, {
        include: { model: Category },
      });
      sendSSEMessage(standardItem, "standardItem.create", req.session.id);
      res.status(201).json(standardItem);
    })
    .catch((e) => handleDatabaseException(e, res));
};

const readOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const foundStandardItem = await StandardItem.findByPk(id, {
    include: { model: Category },
  }).catch((e) => handleDatabaseException(e, res));

  if (foundStandardItem) {
    res.status(200).json(foundStandardItem);
  } else {
    handleRecordNotFoundException(res);
  }
};

const readAllRequest = async (req: Request, res: Response): Promise<void> => {
  StandardItem.findAll()
    .then((standardItems) => res.status(200).send(standardItems))
    .catch((e) => handleDatabaseException(e, res));
};

const updateOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, quantity, url } = req.body;

  const foundStandardItem = await StandardItem.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundStandardItem) {
    foundStandardItem
      .update({
        name,
        quantity,
        url,
      })
      .then((standardItem) => {
        sendSSEMessage(standardItem, "standardItem.update", req.session.id);
        res.status(200).json(standardItem);
      })
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

const deleteOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const foundStandardItem = await StandardItem.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundStandardItem) {
    foundStandardItem
      .destroy()
      .then(() => {
        sendSSEMessage(
          foundStandardItem.id,
          "standardItem.delete",
          req.session.id
        );
        res.sendStatus(204);
      })
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

const deleteAllRequest = async (req: Request, res: Response): Promise<void> => {
  await StandardItem.destroy({ truncate: true })
    .then(() => {
      sendSSEMessage("", "standardItem.deleteAll", req.session.id);
      res.sendStatus(204);
    })
    .catch((e) => handleDatabaseException(e, res));
};

export {
  createOneRequest,
  readOneRequest,
  readAllRequest,
  updateOneRequest,
  deleteOneRequest,
  deleteAllRequest,
};
