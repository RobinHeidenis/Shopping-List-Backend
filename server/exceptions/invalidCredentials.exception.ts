export function handleInvalidCredentialsException(res) {
  res.status(403).json({
    error: true,
    key: "BAD_CREDENTIALS",
    message: "The entered credentials were invalid",
  });
}
