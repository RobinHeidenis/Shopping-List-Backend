import { DBInit } from './db';
import { createRoutes } from './routes/routeCreator.routes';

require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const PORT = 3001;
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const categoryRouter = createRoutes('../controllers/category.controller');
const itemRouter = createRoutes('../controllers/item.controller');
const standardItemRouter = createRoutes('../controllers/standardItem.controller');

const deprecatedRoutesRouter = require('./routes/deprecated.routes');

// TODO: incorporate the old api in here, so no breaking changes are forced yet
app.use('/api/v2/item', itemRouter);
app.use('/api/v2/category', categoryRouter);
app.use('/api/v2/standardItem', standardItemRouter);
app.use('', deprecatedRoutesRouter);

// TODO: beautify logging

const server = app.listen(PORT, async () => {
  console.log(`Shopping list backend listening at http://localhost:${PORT}`);
  await DBInit();
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
