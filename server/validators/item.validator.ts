import { Request } from "express";
import { body, oneOf, Result, ValidationChain } from "express-validator";
import { Middleware } from "express-validator/src/base";

export const createItemValidationRules = (): Array<ValidationChain> => [
  body("name")
    .exists()
    .withMessage("Property 'name' is required")
    .bail()
    .notEmpty()
    .withMessage("Property 'name' cannot be empty"),
  body("categoryId")
    .exists()
    .withMessage("Property 'categoryId' is required")
    .bail()
    .isInt()
    .withMessage("Property 'categoryId' has to be a number"),
  body("quantity")
    .optional()
    .isAlphanumeric()
    .withMessage("Property 'quantity' has to be alphanumeric"),
  body("url")
    .optional()
    .isURL()
    .withMessage("Property 'url' has to be a valid url"),
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
        .withMessage("Property 'name' cannot be empty"),
      body("quantity")
        .exists()
        .bail()
        .isAlphanumeric()
        .withMessage("Property 'quantity' has to be alphanumeric"),
      body("url")
        .exists()
        .bail()
        .isURL()
        .withMessage("Property 'url' has to be a valid url"),
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
        .withMessage("Property 'name' cannot be empty"),
      body("quantity")
        .exists()
        .bail()
        .isAlphanumeric()
        .withMessage("Property 'quantity' has to be alphanumeric"),
      body("url")
        .exists()
        .bail()
        .isURL()
        .withMessage("Property 'url' has to be a valid url"),
      body("status")
        .exists()
        .bail()
        .isInt()
        .withMessage("Property 'status' has to be a number")
        .bail()
        .isIn([1, 2])
        .withMessage(
          "Property 'status' has to be either 1 (open) or 2 (closed)"
        ),
      body("sequence")
        .exists()
        .bail()
        .isInt()
        .withMessage("Property 'sequence' has to be a number"),
    ],
    "At least one of the following properties has to exist: 'name', 'quantity', 'url"
  );

export const SequencesValidationRules = (): Array<ValidationChain> => [
  body().isArray().withMessage("The body of the request should be an array"),
  body("*.id")
    .exists()
    .withMessage("Every array item has to have an 'id' property")
    .bail()
    .isInt()
    .withMessage("The 'id' property has to be a number"),
  body("*.sequence")
    .exists()
    .withMessage("Every array item has to have an 'sequence' property")
    .bail()
    .isInt()
    .withMessage("Property 'sequence' has to be a number"),
];
