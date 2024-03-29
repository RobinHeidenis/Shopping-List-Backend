import { Request, Response } from "express";
import validator from "validator";
import { handleBadRequestException } from "../exceptions/badRequest.exception";
import { handleDatabaseException } from "../exceptions/database.exception";
import { handleRecordNotFoundException } from "../exceptions/recordNotFound.exception";
import { HandledItemInterface } from "../interfaces/item/handledItem.interface";
import { UpdateSequencesItemInterface } from "../interfaces/item/updateSequencesItem.interface";
import { Item } from "../models/item.model";
import { sendSSEMessage } from "./events.controller";

export const createOneRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, quantity, url, categoryId } = req.body;

  const numItems: number = await Item.max("sequence");

  Item.create({
    name,
    quantity,
    url,
    sequence: numItems + 1,
    categoryId,
  })
    .then((item) => {
      sendSSEMessage(item, "item.create", req.session.id);
      res.status(201).json(item);
    })
    .catch((e) => handleDatabaseException(e, res));
};

export const readOneRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const foundItem = await Item.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundItem) {
    res.status(200).json(foundItem);
  } else {
    handleRecordNotFoundException(res);
  }
};

export const readAllRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  Item.findAll()
    .then((items) => res.status(200).send(items))
    .catch((e) => handleDatabaseException(e, res));
};

export const updateOneRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, quantity, url, status } = req.body;

  // Todo: handle partial updates

  const foundItem = await Item.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundItem) {
    foundItem
      .update({
        name,
        quantity,
        url,
        status,
      })
      .then((item) => {
        sendSSEMessage(item, "item.update", req.session.id);
        res.status(200).json(item);
      })
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

export const updateSequencesRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const items: [UpdateSequencesItemInterface] = req.body;
  const handledItems: Array<HandledItemInterface> = [];

  if (!Array.isArray(items)) {
    handleBadRequestException(res);
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    if (
      validator.isInt(item.id.toString()) &&
      validator.isInt(item.sequence.toString())
    ) {
      // eslint-disable-next-line no-await-in-loop
      await Item.findByPk(item.id)
        .then(async (foundItem) => {
          if (foundItem) {
            await foundItem.update({ sequence: item.sequence });
            handledItems.push({
              id: foundItem.id,
              sequence: foundItem.sequence,
            });
          } else {
            handledItems.push({
              id: item.id,
              sequence: item.sequence,
              error: {
                key: "NOT_FOUND",
                message: "Item not found",
              },
            });
          }
        })
        .catch((e) => {
          handleDatabaseException(e, res);
        });
    } else {
      handleBadRequestException(res);
      return;
    }
  }

  sendSSEMessage(handledItems, "item.updateSequences", req.session.id);
  res.status(200).send(handledItems);
};

export const deleteOneRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const foundItem = await Item.findByPk(id).catch((e) =>
    handleDatabaseException(e, res)
  );

  if (foundItem) {
    foundItem
      .destroy()
      .then(() => {
        sendSSEMessage(foundItem.id, "item.delete", req.session.id);
        res.sendStatus(204);
      })
      .catch((e) => handleDatabaseException(e, res));
  } else {
    handleRecordNotFoundException(res);
  }
};

export const deleteAllRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  await Item.destroy({ truncate: true })
    .then(() => {
      sendSSEMessage("", "item.deleteAll", req.session.id);
      res.sendStatus(204);
    })
    .catch((e) => handleDatabaseException(e, res));
};
