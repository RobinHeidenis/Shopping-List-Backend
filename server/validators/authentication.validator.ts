import { body, ValidationChain } from "express-validator";

export const authenticationValidationRules = (): Array<ValidationChain> => [
  body("username")
    .exists()
    .withMessage("Property 'username' is required")
    .bail()
    .notEmpty()
    .withMessage("Property 'username' cannot be empty"),
  body("password")
    .exists()
    .withMessage("Property 'password' is required")
    .bail()
    .notEmpty()
    .withMessage("Property 'password' cannot be empty"),
];
