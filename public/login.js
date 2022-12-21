const mysql = require('mysql');

connection.connect(function(err){
    if (err) throw err;
    console.log('connected!');
});

//ユーザ認証
function auth(param){
    let name = param[0].split('=')[1];
    let password = param[1].split('=')[1];

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ysakura35',
        database: 'login'
    });

    connection.query(
        'SELECT name FROM users WHERE name = " ' +
        name +
        '"AND password = "' +
        password +
        '";'
        , function (err, result, fields) {
            if (err || !result || result.length == 0 || result.affectedRows == 0 || !result[0] || !result[0].name || result[0].name != name) {
                
            }
        }
    )

}

