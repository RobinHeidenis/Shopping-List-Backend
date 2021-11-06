import { Request } from "express";
import { body, oneOf, Result, ValidationChain } from "express-validator";
import { Middleware } from "express-validator/src/base";

export const createItemValidationRules = (): Array<ValidationChain> => [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("categoryId")
    .exists()
    .withMessage("CategoryId is required")
    .bail()
    .isInt()
    .withMessage("CategoryId has to be a number"),
  body("quantity")
    .optional()
    .isAlphanumeric()
    .withMessage("Quantity has to be alphanumeric"),
  body("url").optional().isURL().withMessage("Url has to be a valid url"),
];

export const updateStandardItemValidationRules = (): Middleware & {
  run: (req: Request) => Promise<Result>;
} =>
  oneOf(
    [
      body("name")
        .exists()
        .bail()
        .notEmpty()
        .withMessage("Name cannot be empty"),
      body("quantity")
        .exists()
        .bail()
        .isAlphanumeric()
        .withMessage("Quantity has to be alphanumeric"),
      body("url")
        .exists()
        .bail()
        .isURL()
        .withMessage("Url has to be a valid url"),
    ],
    "At least one of the following properties has to exist: 'name', 'quantity', 'url"
  );

export const UpdateItemValidationRules = (): Middleware & {
  run: (req: Request) => Promise<Result>;
} =>
  oneOf(
    [
      body("name")
        .exists()
        .bail()
        .notEmpty()
        .withMessage("Name cannot be empty"),
      body("quantity")
        .exists()
        .bail()
        .isAlphanumeric()
        .withMessage("Quantity has to be alphanumeric"),
      body("url")
        .exists()
        .bail()
        .isURL()
        .withMessage("Url has to be a valid url"),
      body("status")
        .exists()
        .bail()
        .isInt()
        .withMessage("Status has to be a number")
        .bail()
        .isIn([1, 2])
        .withMessage("Status has to be either 1 (open) or 2 (closed)"),
      body("sequence")
        .exists()
        .bail()
        .isInt()
        .withMessage("Sequence has to be a number"),
    ],
    "At least one of the following properties has to exist: 'name', 'quantity', 'url"
  );
