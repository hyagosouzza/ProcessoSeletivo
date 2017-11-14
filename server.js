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
        var collection = db.collection('cadastro');
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

app.post('/login', function (request, response) {
    var email = request.param('username');
    var senha = request.param('password');

    var isAdmin = false;

    for (index in admins) {
        console.log('checando ' + admins[index].email + ' ' + admins[index].senha);
        console.log(email + ' ' + encrypt(senha));
        if (email == admins[index].email && encrypt(senha) == admins[index].senha) {
            return response.send('#!/admin');
            isAdmin = true;
        }
    }

    if (!isAdmin) {
        return response.status(401).send('Usuário inexistente ou sem permissão');
    }
});

app.get('/api/vagas', function (request, response) {
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
                    response.json(resultado);
                } else {
                    console.log('Nenhum documento encontrado!')
                }

            });

            //Fecha a conexão
            db.close();
        }
    });
});

app.get('/api/vagas/:_id', function (request, response) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = request.params._id;       
    var o_id = new ObjectId(id);
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
            collection.find({_id: o_id}).toArray(function (err, resultado) {
                if (err) {
                    console.log(err);
                } else if (resultado.length) {
                    console.log('Encontrado:', resultado)
                    response.json(resultado);
                } else {
                    console.log('Nenhum documento encontrado!')
                }

            });

            //Fecha a conexão
            db.close();
        }
    });
});

app.post('/api/vagas', function (request, response) {
    var vagaNome = request.param('nome');
    var vagaSalario = request.param('salario');
    var vagaMax = request.param('quantVagasMax');
    var vagaDiasTrab = request.param('diasTrab');
    var vagaHrTrab = request.param('hrTrab');
    var vagaLocal = request.param('local');
    var vagaEnd = request.param('end');
    var vagaConheExtra = request.param('conheExtra');
    var vagaDatIns = request.param('datInsc');
    var vagaDatUltAlt = new Date();
    MongoClient.connect(url, function (err, db) {

        db.collection('Vagas', function (err, collection) {
            collection.insert({
                nome: vagaNome,
                salario: vagaSalario,
                quantVagasMax: vagaMax,
                diasTrab: vagaDiasTrab,
                hrTrab: vagaHrTrab,
                local: vagaLocal,
                end: vagaEnd,
                conheExtra: vagaConheExtra,
                datInsc: vagaDatIns,
                datUltAlt: vagaDatUltAlt
            })
            return response.sendStatus(200);
        });
    });
});

isAuth = function (req, res, next) {
    res.status(401).send('Usuário sem permissão');
};
app.get('http://localhost:8000/!#/admin', isAuth, function (req, res) {
    console.log('GET ADMIN');
});

app.get('/!#/admin', isAuth, function (req, res) {
    console.log('GET ADMIN');
});

app.get('/admin', isAuth, function (req, res) {
    console.log('GET ADMIN');
});

app.use(express.static(__dirname + '/frontend'));

encrypt = function (string) {
    encrypted = 0;
    for (i = 0; i < string.length; i++) {
        encrypted += string.charCodeAt(i);
    }
    encrypted *= string.length;
    encrypted = encrypted.toString(16);
    return encrypted;
};

io.on('connection', function (client) {
    console.log("Client connected");
});

var porta = process.env.PORT || 8000;
server.listen(porta, function () {
    console.log("Funcionando na porta " + porta);
});