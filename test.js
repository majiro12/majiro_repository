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

spawn-in-circle="radius:3"