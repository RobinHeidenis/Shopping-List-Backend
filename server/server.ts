import { DBInit, DBInitTest } from './db';
import { app } from './index';

const PORT = 3001;

export const server = app.listen(PORT, async () => {
  console.log(`Shopping list backend listening at http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'test') await DBInitTest();
  else await DBInit();
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
