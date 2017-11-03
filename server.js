var express = require('express');
var server = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

server.use(bodyparser());

server.post('/api/login', function(req, res){
    var login = req.body;
    
});

Admin = require('./models/admin.js');
Vaga = require('./models/vaga.js');

// Conect to mongoose
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;

server.use(express.static(__dirname + '/frontend'));

var porta = process.env.PORT || 8000
server.listen(porta, function(){
    console.log("Funcionando na porta " + porta);
})