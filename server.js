var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/frontend'));

encrypt = function (string) {
    encrypted = 0;
    for (i = 0; i < string.length; i++) {
        encrypted  += string.charCodeAt(i);
    }
    encrypted *= string.length;
    encrypted = encrypted.toString(16);
    return encrypted;
};

io.on('connection', function (client) {
    console.log("Client connected");

    client.on('getAdmins', function (data) {
        console.log("getAdmins");
        obj = JSON.parse(data);

        var index = 0;
        var isAdmin = false;

        for (index = 0; index < obj["lista"].length; index++) {
            if (obj["email"] == obj["lista"][index].email && encrypt(obj["senha"]) == obj["lista"][index].senha) {
                isAdmin = true;
                io.sockets.emit("authenticated");
            }
        }
        if (!isAdmin) {
            io.sockets.emit("notAuthenticated");
        }
    })
})

var porta = process.env.PORT || 8000;
server.listen(porta, function(){
    console.log("Funcionando na porta " + porta);
})