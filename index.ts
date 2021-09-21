import { category, insertQueryResult, searchItem } from './interfaces';
import { item, fullItem, itemSequence } from './interfaces/item.interface';

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

const sse = new SSE();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.accessTokenSecret, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).send({
          error: true,
          message: 'Unauthorized',
        });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(400).send({
      error: true,
      message: 'Bad Request',
    });
  }
};

app.get('/events', sse.init);

app.post('/api/login', (req, res) => {
  _fetch('http://localhost:3002/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: req.body.username,
      password: req.body.password,
    }),
  }).then((r) => r.json().then((r) => res.json(r)));
});

app.get('/api/getCategories', (req, res) => {
  query('SELECT * FROM shopping_list_categories').then((results) => {
    const items = { categories: results };
    res.json(items);
  }).catch((reason) => console.log(reason));
});

app.post('/api/addCategory', (req, res) => {
  const category: category = req.body.item;
  query('INSERT INTO shopping_list_categories (name, color) VALUES (?, ?)', [category.name, category.color])
    .then((result: insertQueryResult) => query('SELECT * FROM shopping_list WHERE id = ?', [result.insertId]).then((result) => {
      res.json({
        success: true,
        item: result,
      });
      sse.send(result, 'addCategory');
    }));
});

app.post('/api/deleteCategory', (req, res) => {
  if (req.body.id.isNaN) {
    res.error();
    return;
  }
  query('DELETE FROM shopping_list_categories WHERE id = ?', [req.body.id]).then(() => {
    res.json({ success: true });
    sse.send({
      id: req.body.id,
    }, 'deleteCategory');
  }).catch((reason) => console.log(reason));
});

app.get('/api/getItemList', authenticateJWT, (req, res) => {
  query('SELECT l.id, l.name, l.quantity, l.url, l.status, l.sequence, l.category, c.name as category_name, c.id as category_id, c.color as category_color FROM shopping_list as l JOIN shopping_list_categories as c ON l.category = c.id').then((results) => {
    // TODO: get the category ids from the items and add the category info there
    const items = { items: results };
    res.json(items);
  }).catch((reason) => console.log(reason));
});

app.post('/api/updateItemStatus', authenticateJWT, (req, res) => {
  if (req.body.status < 0 || req.body.status > 1 || req.body.id.isNaN) {
    res.error();
    return;
  }
  query('UPDATE shopping_list SET status = ? WHERE id = ?', [req.body.status, req.body.id]).then(() => {
    res.json({ success: true });
    sse.send({
      id: req.body.id,
      status: req.body.status,
    }, 'updateItemStatus');
  }).catch((reason) => console.log(reason));
});

app.post('/api/deleteItem', authenticateJWT, (req, res) => {
  if (req.body.id.isNaN) {
    res.error();
    return;
  }
  query('DELETE FROM shopping_list WHERE id = ?', [req.body.id]).then(() => {
    res.json({ success: true });
    sse.send({
      id: req.body.id,
    }, 'deleteItem');
  }).catch((reason) => console.log(reason));
});

app.post('/api/addItem', authenticateJWT, (req, res) => {
  const { item } = req.body;
  query('SELECT count(*) FROM shopping_list').then((result) => query('INSERT INTO shopping_list (name, quantity, url, sequence) VALUES (?, ?, ?, ?)', [item.name, item.quantity, item.url, result[0][Object.keys(result[0])[0]]])
    .then((result: insertQueryResult) => query('SELECT * FROM shopping_list WHERE id = ?', [result.insertId]).then((result) => {
      res.json({
        success: true,
        item: result,
      });
      sse.send(result, 'addItem');
    })));
});

app.post('/api/updateItem', authenticateJWT, (req, res) => {
  const { item } = req.body;
  query('UPDATE shopping_list SET name = ?, quantity = ?, url = ? WHERE id = ?', [item.name, item.quantity, item.url, item.id]).then(() => {
    res.json({ success: true });
    sse.send({
      id: item.id,
      quantity: item.quantity,
      url: item.url,
      name: item.name,
    }, 'updateItem');
  });
});

app.post('/api/updateSequence', authenticateJWT, (req, res) => {
  const { items } = req.body;
  items.forEach((item) => {
    query('UPDATE shopping_list SET sequence = ? WHERE id = ?', [item.sequence, item.id]).catch(() => {
      res.json({ success: false });
    });
  });
  res.json({ success: true });
  sse.send(items, 'updateItemSequence');
});

app.get('/api/deleteAllItems', authenticateJWT, (req, res) => {
  query('DELETE FROM shopping_list').then(() => {
    res.json({ success: true });
    sse.send('', 'deleteAllItems');
  });
});

app.post('/api/search', authenticateJWT, (req, res) => {
  _fetch(`https://ah.nl/zoeken?query=${req.body.query}&PageSpeed=noscript`).then((result) => result.text().then((result) => {
    const patternScript = /window\.__INITIAL_STATE__= (.*?)\n {2}window.initialViewport='DESKTOP'\n/gs;
    const patternUndefined = /undefined/g;

    const match = patternScript.exec(result);
    const filteredMatch = match[1].replace(patternUndefined, null);

    const initialStyle = JSON.parse(filteredMatch);

    const itemsArray: object[] = [];

    initialStyle.search.results.filter((item) => item.type === 'default').forEach((topItem) => {
      const item = topItem.products[0];
      const obj: searchItem = {} as searchItem;

      obj.name = item.title;
      obj.link = `https://ah.nl${item.link}`;
      obj.img = item.images && item.images[0] ? item.images[0].url : 'https://www.ah.nl/zoeken/assets/341efdfa.svg';
      obj.amount = item.price.unitSize;
      obj.price = item.price.now;
      obj.id = item.id;
      itemsArray.push(obj);
    });

    res.json({ result: itemsArray });
  }));
});

app.get('/api/getStandardItems', authenticateJWT, (req, res) => {
  query('SELECT * from shopping_list_standard').then((results) => {
    const items = { items: results };
    res.json(items);
  }).catch((reason) => console.log(reason));
});

app.post('/api/addStandardItem', authenticateJWT, (req, res) => {
  const { item } = req.body;
  query('INSERT INTO shopping_list_standard (name, quantity, url) VALUES (?, ?, ?)', [item.name, item.quantity, item.url])
    .then((result: insertQueryResult) => query('SELECT * FROM shopping_list_standard WHERE id = ?', [result.insertId]).then((result) => res.json({
      success: true,
      item: result,
    })));
});

app.post('/api/deleteStandardItem', authenticateJWT, (req, res) => {
  if (req.body.id.isNaN) {
    res.error();
    return;
  }
  query('DELETE FROM shopping_list_standard WHERE id = ?', [req.body.id]).then(res.json({ success: true })).catch((reason) => console.log(reason));
});

app.get('*', (req, res) => {
  res.status('404').send({
    error: true,
    message: 'not found',
  });
});
app.post('*', (req, res) => {
  res.status('404').send({
    error: true,
    message: 'not found',
  });
});

app.listen(port, () => {
  console.log(`Shopping list backend running on http://localhost:${port}`);
});
