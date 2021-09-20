export function handleDatabaseException (e, res) {
    console.error(e);
    res.status(500).json({ error: true, key: "DATABASE_EXCEPTION", message: "An error has occured, please try again later" });
}
