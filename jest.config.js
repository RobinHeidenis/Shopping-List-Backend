/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters: ["default", "jest-sonar"],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "server/logging/logger.ts",
    "server/routes/deprecated.routes.ts",
    "utils/db.ts",
  ],
};
