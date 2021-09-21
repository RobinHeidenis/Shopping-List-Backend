import { Item } from './models/item.model';

const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

const port = 3001;
const compression = require('compression');
const helmet = require('helmet');
const _fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SSE = require('express-sse');
const cookieParser = require('cookie-parser');
const { query } = require('./utils/db');

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get('/api/getItemList', (req, res) => {
  new Item().getAll();
});
