const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.Server(app);

const io = socketIo(server);

const port = 3000;


//publicファイルの入手
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/3d_place.html');
})

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