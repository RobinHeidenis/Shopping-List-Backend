import { DBInit } from "./db";
import { app } from "./index";
import { Logger } from "./logging/logger";

const PORT = 3001;

export const server = app.listen(PORT, async () => {
  Logger.info(`Shopping list backend listening at http://localhost:${PORT}`);
  // TODO: implement auth server ping
  await DBInit();
});

process.on("SIGTERM", () => {
  server.close(() => {
    Logger.warn("Process terminated");
  });
});
