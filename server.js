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
var url = 'mongodb://hyagosouzza:hyago0123@ds161873.mlab.com:61873/selecao_de_vagas';

var admins;

// Usamos o método connect para se conectar com o servidor
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Não foi possível se conectar com o servidor MongoDB. Error:', err)
    }
    else {
        //feita a conexão
        console.log('Conexão com o banco de dados estabelecida com sucesso')

        // Obtem a coleção de documentos
        var collection = db.collection('Vagas');

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

        });
        collection = db.collection('Admins');
        collection.find({}).toArray(function (err, resultado) {
            if (err) {
                console.log(err);
            } else if (resultado.length) {
                console.log('Encontrado:', resultado)
                admins = resultado;
            } else {
                console.log('Nenhum documento encontrado!')
            }

        });

        //Fecha a conexão
        db.close();
    }
});

app.post('/login',  function (request, response) {
    var email = request.param('username');
    var senha = request.param('password');

    var isAdmin = false;

    for (admin in admins) {
      if (email == admin.email && senha == admin.senha) {
          return response.send('#!/admin');
      }
    }

    return response.status(401).send('Usuário inexistente ou sem permissão');
});

app.get('/api/vagas', function (request, response) {
    response.json(dados);
});

isAuth = function(req, res, next) {
    res.status(401).send('Usuário sem permissão');
};

app.get('/!#/admin', isAuth, function (req, res) {
    console.log('GET ADMIN');
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
});

var porta = process.env.PORT || 8000;
server.listen(porta, function(){
    console.log("Funcionando na porta " + porta);
});