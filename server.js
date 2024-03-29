const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const easyrtc = require('open-easyrtc');

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, '/public/dist')));
//publicファイルの入手
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/first.html');
});

const server = http.Server(app);
const io = socketIo(server);


easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, io, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

//3000番のポートでHTTPサーバを起動
server.listen(port, ()=>{
    console.log('The server has started and is listening on port number:' + port);
});

//DBと接続
const mysql = require('mysql');

//ユーザ認証
function auth(param){
    let name = param[0].split('=')[1];
    let password = param[1].split('=')[1];

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1qazxsw2',
        database: 'login'
    });

    connection.connect(function(err){
        if (err) throw err;
        console.log('DB connect');
        const sql = 'SELECT name FROM users WHERE name = "' + 
                    name +
                    '"AND password = "' +
                    password +
                    '";';
        connection.query(sql, function(err, result, fields){
            if (err || !result[0]) {
                flg_login = false;
                return;
            } else {
                flg_login= true;
                sql_result = result[0].name;
            }
        });
    });
};

function create(param){
    let name = param[0].split('=')[1];
    let password = param[1].split('=')[1];

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1qazxsw2',
        database: 'login'
    });

    connection.connect(function(err){
        if (err) throw err;
        console.log('DB connect');
        const sql = 'SELECT name FROM users WHERE name = "' +
                    name +
                    '";';
        connection.query(sql, function(err, result, fields){
            console.log(result[0]);
            if(!result[0]){
                flg_rgt = true;
                const insert = 'INSERT INTO users (name, password) VALUE ("' +
                                name +
                                '","' +
                                password +
                                '");';
                connection.query(insert); 
            } else {
                flg_rgt = false;
            }
        });
    });
}
//引数をmysqlを通して渡す
/*function user_id(){

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1qazxsw2',
        database: 'login'
    });

    const sql2 = 'INSERT INTO id_order values (1,' + sql_result + ');';
    connection.query(sql2, function(err, result, fileds) {
        if (err) throw err;
        console.log('www');
    }); 
    return;
}*/


let flg_login = false;
let flg_rgt = false
let sql_result;

app.post('/login.html', (req, res) => {
    let data = '';
    req.on('data', function(chunk){
        data += chunk;
    }).on('end', function(){
        console.log(data);
        auth(data.split('&'));
        setTimeout(function(){
            if (flg_login) {
                res.sendFile(__dirname + '/public/3d_place.html');
                console.log('認証成功');
                /*user_id();*/
            } else {
                res.sendFile(__dirname + '/public/login.html');
                console.log('認証失敗');
            }
        }, 1000);
    })
});

app.post('/new_user.html', (req,res)=>{
    let data='';
    req.on('data', function(chunk){
        data += chunk;
    }).on('end', function(){
        console.log(data);
        create(data.split('&'));
        setTimeout(function(){
            if(flg_rgt) {
                res.sendFile(__dirname + '/public/3d_place.html');
            } else {
                console.log(flg_rgt)
                res.redirect('new_user.html?msg=すでに使われているユーザ名です');
            }
        }, 1000);
    })
})

