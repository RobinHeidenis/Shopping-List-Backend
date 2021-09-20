export function handleBadRequestException (res) {
    res.status(400).json({ error: true, key: "BAD_REQUEST", message: "The request couldn't be handled, because it was malformed" });
}
