const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ysakura35',
    database: 'login'
});

connection.connect(function(err){
    if (err) throw err;
    console.log('connected!');
});

