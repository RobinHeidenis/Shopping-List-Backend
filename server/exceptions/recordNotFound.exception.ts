import { Response } from "express";

export const handleRecordNotFoundException = (res: Response): void => {
  res.status(404).json({
    error: true,
    key: "RECORD_NOT_FOUND",
    message: "No record with that ID was found",
  });
};
