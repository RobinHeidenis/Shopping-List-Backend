import { body, ValidationChain } from "express-validator";

export const createStandardItemValidationRules = (): Array<ValidationChain> => [
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

export const updateStandardItemValidationRules = (): Array<ValidationChain> => [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isAlphanumeric()
    .withMessage("Quantity has to be alphanumeric"),
  body("url")
    .exists()
    .withMessage("Url is required")
    .bail()
    .isURL()
    .withMessage("Url has to be a valid url"),
];
