import { body, ValidationChain } from "express-validator";

export const createCategoryValidationRules = (): Array<ValidationChain> => [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Name has to be alphanumeric"),
  body("color")
    .exists()
    .withMessage("Color is required")
    .bail()
    .isHexColor()
    .withMessage("Name has to be a hex color"),
];

export const updateCategoryValidationRules = (): Array<ValidationChain> => [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Name has to be alphanumeric"),
  body("color")
    .exists()
    .withMessage("Color is required")
    .bail()
    .isHexColor()
    .withMessage("Name has to be a hex color"),
];
