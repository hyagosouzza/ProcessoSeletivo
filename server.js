var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

server.use(express.static(__dirname + '/frontend'));

var porta = process.env.PORT || 8000;
server.listen(porta, function(){
    console.log("Funcionando na porta " + porta);
})