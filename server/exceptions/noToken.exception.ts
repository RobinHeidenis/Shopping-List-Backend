export function handleNoTokenException(res) {
  res.status(400).json({
    error: true,
    key: "NO_TOKEN",
    message: "No bearer token has been sent with the request",
  });
}
