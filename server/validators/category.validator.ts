import { Request } from "express";
import { body, oneOf, Result, ValidationChain } from "express-validator";
import { Middleware } from "express-validator/src/base";

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

export const updateCategoryValidationRules = (): Middleware & {
  run: (req: Request) => Promise<Result>;
} =>
  oneOf(
    [
      body("name")
        .exists()
        .bail()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .bail()
        .isAlphanumeric()
        .withMessage("Name has to be alphanumeric"),
      body("color")
        .exists()
        .bail()
        .isHexColor()
        .withMessage("Name has to be a hex color"),
    ],
    "At least one of the following properties has to exist: 'name', 'color'"
  );
