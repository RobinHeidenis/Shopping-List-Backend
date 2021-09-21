import { sequelize } from './db';
import { createRoutes } from './routes/routeCreator.routes';
import { seedDatabase } from './seeders/seeder';

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { query } = require('../utils/db');
const PORT = 3001;
const compression = require('compression');
const helmet = require('helmet');
const _fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SSE = require('express-sse');
const cookieParser = require('cookie-parser');

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const categoryRouter = createRoutes('../controllers/category.controller');
// const itemRouter = createRoutes('../controllers/item.controller');
// const standardItemRouter = createRoutes('../controllers/standardItem.controller');

// TODO: incorporate the old api in here, so no breaking changes are forced yet
// app.use('/api/v2/item', itemRouter);
app.use('/api/v2/category', categoryRouter);
// app.use('/api/v2/standardItem', standardItemRouter);

app.listen(PORT, () => {
  sequelize.sync({force: true})
    .then(() => console.log('All models were synchronized successfully.'))
    .then(() => {
      console.log('Seeding database');
      seedDatabase()
    })
    .catch((e) => { console.log(e); });
  console.log(`Shopping list backend listening at http://localhost:${PORT}`);
});
