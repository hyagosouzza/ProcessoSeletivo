var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);

//Vamos importar os drivers nativos do mongodb
var mongodb = require('mongodb');

//Precisamos usar a interface "MongoClient" para se conectar com o servidor
var MongoClient = mongodb.MongoClient;

// URL da conexão 
var url = 'mongodb://hyagosouzza:hyago0123@ds243055.mlab.com:43055/processodb';

// Usamos o método connect para se conectar com o servidor
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Não foi possível se conectar com o servidor MongoDB. Error:', err)
    }
    else {
        //feita a conexão
        console.log('Conexão com o banco de dados estabelecida com sucesso')

        // Obtem a coleção de documentos
        var collection = db.collection('Admin')

        //usando o comando find  para achar dados
        collection.find({}).toArray(function (err, resultado) {
            if (err) {
                console.log(err);
            } else if (resultado.length) {
                console.log('Encontrado:', resultado)
                dados = resultado;
            } else {
                console.log('Nenhum documento encontrado!')
            }
            //Fecha a conexão
            db.close();
        });
    }
});

server.get('/api/vagas', function (request, response) {
    response.json(dados);
});

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