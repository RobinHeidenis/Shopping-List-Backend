import { item, fullItem } from '../interfaces/item.interface';

const { query } = require('../utils/db');

export const Item = function (item) {
  this.name = item.name;
  this.quantity = item.quantity;
  this.url = item.url;
};

Item.create = (newItem: item, result) => {
  query('SELECT count(*) FROM robindb.shopping_list')
    .then((res) => query('INSERT INTO robindb.shopping_list (name, quantity, url, sequence) VALUES (?, ?, ?, ?)', [newItem.name, newItem.quantity, newItem.url, res[0][Object.keys(res[0])[0]]]))
    .then((res) => query('SELECT * FROM robindb.shopping_list WHERE id = ?', [res.insertId])
      .then((res) => {
        console.log('Created item: ', { ...res });
        result(null, res);
      })).catch((err) => {
      console.log('error: ', err);
      result(err, null);
    });
};

Item.getAll = (result) => {
  query('SELECT * from robindb.shopping_list').then((res) => {
    console.log('items: ', res);
    result(null, res);
  }).catch((reason) => {
    console.log('error: ', reason);
    result(reason, null);
  });
};

Item.updateById = (id: number, item: fullItem, result) => {
  query('UPDATE robindb.shopping_list SET name = ?, quantity = ?, url = ?, status = ? WHERE id = ?', [item.name, item.quantity, item.url, item.status, item.id])
    .then((res) => {
      if (res.affectedRows === 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('updated customer: ', { id, ...item });
      result(null, { id, ...item });
    })
    .catch((err) => {
      console.log('error: ', err);
      result(err, null);
    });
};

Item.removeById = (id: number, result) => {

};

Item.removeAll = (result) => {

};

module.exports = Item;
