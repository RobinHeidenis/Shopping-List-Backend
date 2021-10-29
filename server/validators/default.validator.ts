import { param, ValidationChain } from "express-validator";

export const idOnlyValidationRules = (): Array<ValidationChain> => [
  param("id").exists().isInt().withMessage("Id has to be a number"),
];
