import { Request, Response } from "express";
import { handleDatabaseException } from "../exceptions/database.exception";
import { handleRecordNotFoundException } from "../exceptions/recordNotFound.exception";
import { Category } from "../models/category.model";
import { sendSSEMessage } from "./events.controller";

const createOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { name, color } = req.body;

  Category.create({
    name,
    color,
  })
    .then((category) => {
      sendSSEMessage(category, "category.create", req.session.id);
      res.status(201).json(category);
    })
    .catch((e) => handleDatabaseException(e, res));
};

const readOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const foundCategory = await Category.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundCategory) {
    res.status(200).json(foundCategory);
  } else {
    handleRecordNotFoundException(res);
  }
};

const readAllRequest = async (req: Request, res: Response): Promise<void> => {
  Category.findAll()
    .then((categories) => res.status(200).send(categories))
    .catch((e) => handleDatabaseException(e, res));
};

const updateOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, color } = req.body;

  // Todo: handle partial updates

  const foundCategory = await Category.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundCategory) {
    foundCategory
      .update({
        name,
        color,
      })
      .then((category) => {
        sendSSEMessage(category, "category.update", req.session.id);
        res.status(200).json(category);
      })
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

const deleteOneRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const foundCategory = await Category.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundCategory) {
    foundCategory
      .destroy()
      .then(() => {
        sendSSEMessage(foundCategory.id, "category.delete", req.session.id);
        res.sendStatus(204);
      })
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

const deleteAllRequest = async (req: Request, res: Response): Promise<void> => {
  await Category.destroy({ where: {} })
    .then(() => {
      sendSSEMessage("", "category.deleteAll", req.session.id);
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
