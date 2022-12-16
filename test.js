const express = require('express');
const app = express();
const port = 3000;

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ysakura35',
    database: 'cooking'
});

connection.connect(function(err){
    if (err) throw err;
    console.log('connected');
    const sql = "select * from menus";
    connection.query(sql, function(err, result, fields){
        if (err) throw err;
        console.log(result);
    });
});

app.get('/', (req, res) => res.send('hello world'));

app.listen(port, () => console.log('example app listening on port ' + port));