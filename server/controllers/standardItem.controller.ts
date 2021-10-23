import { Request, Response } from "express";
import { handleBadRequestException } from "../exceptions/badRequest.exception";
import { handleDatabaseException } from "../exceptions/database.exception";
import { handleRecordNotFoundException } from "../exceptions/recordNotFound.exception";
import { StandardItem } from "../models/standardItem.model";
import { sendSSEMessage } from "./events.controller";

const createOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { name, quantity, url, categoryId } = req.body;
  // TODO: check if category exists, also do this with item.controller.ts

  if (!name || !categoryId || !parseInt(categoryId)) {
    handleBadRequestException(res);
    return;
  }

  const catId = parseInt(categoryId);

  StandardItem.create({
    name,
    quantity,
    url,
    categoryId: catId,
  })
    .then((standardItem) => {
      sendSSEMessage(standardItem, "standardItem.create", req.session.id);
      res.status(201).json(standardItem);
    })
    .catch((e) => handleDatabaseException(e, res));
};

const readOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

  const foundStandardItem = await StandardItem.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

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

  if (!id || !parseInt(id) || (!name && !quantity && !url)) {
    handleBadRequestException(res);
    return;
  }

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

  if (!id || !parseInt(id)) {
    handleBadRequestException(res);
    return;
  }

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

