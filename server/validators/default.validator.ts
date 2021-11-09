import { param, ValidationChain } from "express-validator";

export const idOnlyValidationRules = (): Array<ValidationChain> => [
  param("id")
    .exists()
    .withMessage("Property 'id' is required")
    .bail()
    .isInt()
    .withMessage("Property 'id' has to be a number"),
];
