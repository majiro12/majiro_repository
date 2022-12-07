const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const easyrtc = require('open-easyrtc');

const app = express();
const server = http.Server(app);

const io = socketIo(server);

const port = 3000;

app.use(express.static(path.join(__dirname, '/public/dist')));
//publicファイルの入手
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/3d_place.html');
})

/*音声機能　必要ならコメントアウトを外す
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
});*/

//3000番のポートでHTTPサーバを起動
server.listen(port, ()=>{
    console.log('The server has started and is listening on port number');
});

//クライアントとのコネクションを確立　確立したら'connection'
io.on('connection', (socket) => {
    console.log('connection');

    //'sendMessage'で受信可能
    //第一引数には受信したメッセージが入る
    socket.on('sendMessage', (message) => {
        console.log('message has been sent: ', message);

        //'receiveMessage'で受信したメッセージをすべてのクライアントへ送信
        io.emit('receiveMessage', message);
    })
});

