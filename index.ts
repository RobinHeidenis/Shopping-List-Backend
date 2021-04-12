const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const {query} = require("./utils/db");
const port = 3001
const compression = require('compression')
const helmet = require('helmet')

app.use(compression())
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/getItemList', (req, res) => {
    query('SELECT * from shopping_list').then((results) => {
        const items = {items: results};
        res.json(items);
    }).catch(reason => console.log(reason))
})

app.post('/api/updateItemStatus', (req, res) => {
    if (req.body.status < 0 || req.body.status > 1 || req.body.id.isNaN) {res.error(); return;}
    query(`UPDATE shopping_list SET status = ? WHERE id = ?`, [req.body.status, req.body.id]).then(res.json({success: true})).catch(reason => console.log(reason))
})

app.post('/api/deleteItem', (req, res) => {
    if (req.body.id.isNaN) {res.error(); return;}
    query(`DELETE FROM shopping_list WHERE id = ?`, [req.body.id]).then(res.json({success: true})).catch(reason => console.log(reason));
})

interface item {
    name: string,
    quantity?: string,
    url?: string,
}

interface fullItem extends item {
    id: number,
    status: number
}

interface itemSequence {
    id: number,
    sequence: number
}

interface insertQueryResult {
    fieldcount: number,
    affectedRows: number,
    insertId: number,
    serverStatus: number,
    warningCount: number,
    message: string,
    protocol41: boolean,
    changedRows: number
}

app.post('/api/addItem', ((req, res) => {
    const item: item = req.body.item;
    query(`SELECT count(*) FROM shopping_list`).then((result) => query(`INSERT INTO shopping_list (name, quantity, url, sequence) VALUES (?, ?, ?, ?)`, [item.name, item.quantity, item.url, result[0][Object.keys(result[0])[0]]])
        .then((result: insertQueryResult) => query(`SELECT * FROM shopping_list WHERE id = ?`, [result.insertId]).then((result) => res.json({success: true, item: result}))))

}))

app.post('/api/updateItem', ((req, res) => {
    const item: fullItem = req.body.item;
    query(`UPDATE shopping_list SET name = ?, quantity = ?, url = ? WHERE id = ?`, [item.name, item.quantity, item.url, item.id]).then(() => res.json({success: true}))
}))

app.post('/api/updateSequence', (((req, res) => {
    const items : itemSequence[] = req.body.items;
    items.forEach((item) => {query(`UPDATE shopping_list SET sequence = ? WHERE id = ?`, [item.sequence, item.id])})
    res.json({success: true})
})))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})