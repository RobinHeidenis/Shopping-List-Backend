import { createStandardRoutes } from './routes/routeCreator.routes';

require('dotenv').config();
const express = require('express');

export const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: 'shared.heidenis.com',
};

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

const itemRouter = require('./routes/item.routes').routes;

const categoryRouter = createStandardRoutes('../controllers/category.controller');
const standardItemRouter = createStandardRoutes('../controllers/standardItem.controller');

const deprecatedRoutesRouter = require('./routes/deprecated.routes');

app.use('/api/v2/item', itemRouter);
app.use('/api/v2/category', categoryRouter);
app.use('/api/v2/standardItem', standardItemRouter);
app.use('', deprecatedRoutesRouter);
