export function handleRecordNotFoundException(res) {
  res.status(404).json({
    error: true,
    key: "RECORD_NOT_FOUND",
    message: "No record with that ID was found",
  });
}
