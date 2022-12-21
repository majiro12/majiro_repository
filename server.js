const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const easyrtc = require('open-easyrtc');
const { create } = require('domain');

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, '/public/dist')));
//publicファイルの入手
app.use(express.static(path.join(__dirname, 'public')));

/*app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/3d_place.html');
});*/

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/login.html');
});





const server = http.Server(app);
const io = socketIo(server);

//音声機能　必要ならコメントアウトを外す
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

//クライアントとのコネクションを確立　確立したら'connection'
/*io.on('connection', (socket) => {
    console.log('connection');

    //'sendMessage'で受信可能
    //第一引数には受信したメッセージが入る
    socket.on('sendMessage', (message) => {
        console.log('message has been sent: ', message);

        //'receiveMessage'で受信したメッセージをすべてのクライアントへ送信
        io.emit('receiveMessage', message);
    })
});*/

const mysql = require('mysql');

//ユーザ認証
function user_id(param){
    let name = param[0].split('=')[1];
    let password = param[1].split('=')[1];

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ysakura35',
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
            if (err || !result || result.length == 0 || result.affectedRows == 0 || !result[0] || !result[0].name || result[0].name != name) {
                flg = false;
                return;
            } else {
                flg = true;
                return;
            }
        });
    });
};


let flg = false;
app.post('/auth', (req, res) => {
    let data = '';
    req.on('data', function(chunk){
        data += chunk;
    }).on('end', function(){
        console.log(data);
        user_id(data.split('&'));
        setTimeout(function(){
            if (flg) {
                res.sendFile(__dirname + '/public/3d_place.html');
                console.log('認証成功');
            } else {
                res.sendFile(__dirname + '/public/login.html');
                console.log('認証失敗');
            }
        }, 1000);
    })
});


