// noinspection SqlResolve
/* eslint-disable */
// @ts-nocheck

import { Category, InsertQueryResult, SearchItem } from "../../interfaces";
import { query } from "../../utils/db";
import { config } from "../config/env.config";
import { Logger } from "../logging/logger";

require("dotenv").config();
const express = require("express");

const urlRoutes = express.Router();
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const SSE = require("express-sse");

const sse = new SSE();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.tokens.access, (err, user) => {
      if (err) {
        Logger.error(err);
        return res.status(403).send({
          error: true,
          message: "Unauthorized",
        });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(400).send({
      error: true,
      message: "Bad Request",
    });
  }
};

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.get("/events", sse.init);

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/login", (req, res) => {
  fetch(config.authServerBaseUrl + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: req.body.username,
      password: req.body.password,
    }),
  }).then((r) => r.json().then((r) => res.json(r)));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.get("/api/getCategories", (req, res) => {
  query("SELECT * FROM shopping_list_categories", [])
    .then((results) => {
      const items = { categories: results };
      res.json(items);
    })
    .catch((reason) => Logger.error(reason));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/addCategory", (req, res) => {
  const category: Category = req.body.item;
  query("INSERT INTO shopping_list_categories (name, color) VALUES (?, ?)", [
    category.name,
    category.color,
  ]).then((result: InsertQueryResult) =>
    query("SELECT * FROM shopping_list WHERE id = ?", [result.insertId]).then(
      (result) => {
        res.json({
          success: true,
          item: result,
        });
        sse.send(result, "addCategory");
      }
    )
  );
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/deleteCategory", (req, res) => {
  if (req.body.id.isNaN) {
    res.error();
    return;
  }
  query("DELETE FROM shopping_list_categories WHERE id = ?", [req.body.id])
    .then(() => {
      res.json({ success: true });
      sse.send(
        {
          id: req.body.id,
        },
        "deleteCategory"
      );
    })
    .catch((reason) => Logger.error(reason));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.get("/api/getItemList", authenticateJWT, (req, res) => {
  query(
    "SELECT l.id, l.name, l.quantity, l.url, l.status, l.sequence, l.category, c.name as category_name, c.id as category_id, c.color as category_color FROM shopping_list as l JOIN shopping_list_categories as c ON l.category = c.id",
    []
  )
    .then((results) => {
      const items = { items: results };
      res.json(items);
    })
    .catch((reason) => Logger.error(reason));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/updateItemStatus", authenticateJWT, (req, res) => {
  if (req.body.status < 0 || req.body.status > 1 || req.body.id.isNaN) {
    res.error();
    return;
  }
  query("UPDATE shopping_list SET status = ? WHERE id = ?", [
    req.body.status,
    req.body.id,
  ])
    .then(() => {
      res.json({ success: true });
      sse.send(
        {
          id: req.body.id,
          status: req.body.status,
        },
        "updateItemStatus"
      );
    })
    .catch((reason) => Logger.error(reason));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/deleteItem", authenticateJWT, (req, res) => {
  if (req.body.id.isNaN) {
    res.error();
    return;
  }
  query("DELETE FROM shopping_list WHERE id = ?", [req.body.id])
    .then(() => {
      res.json({ success: true });
      sse.send(
        {
          id: req.body.id,
        },
        "deleteItem"
      );
    })
    .catch((reason) => Logger.error(reason));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/addItem", authenticateJWT, (req, res) => {
  const { item } = req.body;
  query("SELECT count(*) FROM shopping_list", []).then((result) =>
    query(
      "INSERT INTO shopping_list (name, quantity, url, sequence) VALUES (?, ?, ?, ?)",
      [item.name, item.quantity, item.url, result[0][Object.keys(result[0])[0]]]
    ).then((result: InsertQueryResult) =>
      query("SELECT * FROM shopping_list WHERE id = ?", [result.insertId]).then(
        (result) => {
          res.json({
            success: true,
            item: result,
          });
          sse.send(result, "addItem");
        }
      )
    )
  );
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/updateItem", authenticateJWT, (req, res) => {
  const { item } = req.body;
  query(
    "UPDATE shopping_list SET name = ?, quantity = ?, url = ? WHERE id = ?",
    [item.name, item.quantity, item.url, item.id]
  ).then(() => {
    res.json({ success: true });
    sse.send(
      {
        id: item.id,
        quantity: item.quantity,
        url: item.url,
        name: item.name,
      },
      "updateItem"
    );
  });
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/updateSequence", authenticateJWT, (req, res) => {
  const { items } = req.body;
  items.forEach((item) => {
    query("UPDATE shopping_list SET sequence = ? WHERE id = ?", [
      item.sequence,
      item.id,
    ]).catch(() => {
      res.json({ success: false });
    });
  });
  res.json({ success: true });
  sse.send(items, "updateItemSequence");
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.get("/api/deleteAllItems", authenticateJWT, (req, res) => {
  query("DELETE FROM shopping_list", []).then(() => {
    res.json({ success: true });
    sse.send("", "deleteAllItems");
  });
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/search", authenticateJWT, (req, res) => {
  fetch(`https://ah.nl/zoeken?query=${req.body.query}&PageSpeed=noscript`).then(
    (result) =>
      result.text().then((result) => {
        const patternScript =
          /window\.__INITIAL_STATE__= (.*?)\n {2}window.initialViewport='DESKTOP'\n/gs;
        const patternUndefined = /undefined/g;

        const match = patternScript.exec(result);
        const filteredMatch = match[1].replace(patternUndefined, null);

        const initialStyle = JSON.parse(filteredMatch);

        const itemsArray: object[] = [];

        initialStyle.search.results
          .filter((item) => item.type === "default")
          .forEach((topItem) => {
            const item = topItem.products[0];
            const obj: SearchItem = {} as SearchItem;

            obj.name = item.title;
            obj.link = `https://ah.nl${item.link}`;
            obj.img =
              item.images && item.images[0]
                ? item.images[0].url
                : "https://www.ah.nl/zoeken/assets/341efdfa.svg";
            obj.amount = item.price.unitSize;
            obj.price = item.price.now;
            obj.id = item.id;
            itemsArray.push(obj);
          });

        res.json({ result: itemsArray });
      })
  );
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.get("/api/getStandardItems", authenticateJWT, (req, res) => {
  query("SELECT * from shopping_list_standard", [])
    .then((results) => {
      const items = { items: results };
      res.json(items);
    })
    .catch((reason) => Logger.error(reason));
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/addStandardItem", authenticateJWT, (req, res) => {
  const { item } = req.body;
  query(
    "INSERT INTO shopping_list_standard (name, quantity, url) VALUES (?, ?, ?)",
    [item.name, item.quantity, item.url]
  ).then((result: InsertQueryResult) =>
    query("SELECT * FROM shopping_list_standard WHERE id = ?", [
      result.insertId,
    ]).then((result) =>
      res.json({
        success: true,
        item: result,
      })
    )
  );
});

/**
 * @deprecated since version 2.0.0
 */
urlRoutes.post("/api/deleteStandardItem", authenticateJWT, (req, res) => {
  if (req.body.id.isNaN) {
    res.error();
    return;
  }
  query("DELETE FROM shopping_list_standard WHERE id = ?", [req.body.id])
    .then(res.json({ success: true }))
    .catch((reason) => Logger.error(reason));
});

export { urlRoutes };
