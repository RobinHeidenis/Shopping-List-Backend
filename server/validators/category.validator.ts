import { Request } from "express";
import { body, oneOf, Result, ValidationChain } from "express-validator";
import { Middleware } from "express-validator/src/base";

export const createCategoryValidationRules = (): Array<ValidationChain> => [
  body("name")
    .exists()
    .withMessage("Property 'name' is required")
    .bail()
    .notEmpty()
    .withMessage("Property 'name' cannot be empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Property 'name' has to be alphanumeric"),
  body("color")
    .exists()
    .withMessage("Property 'color' is required")
    .bail()
    .isHexColor()
    .withMessage("Property 'color' has to be in the format of a hex color"),
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
        .withMessage("Property 'name' cannot be empty")
        .bail()
        .isAlphanumeric()
        .withMessage("Property 'name' has to be alphanumeric"),
      body("color")
        .exists()
        .bail()
        .isHexColor()
        .withMessage("Property 'color' has to be in the format of a hex color"),
    ],
    "At least one of the following properties has to exist: 'name', 'color'"
  );
