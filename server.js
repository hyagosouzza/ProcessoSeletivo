var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

//Vamos importar os drivers nativos do mongodb
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

//Precisamos usar a interface "MongoClient" para se conectar com o servidor
var MongoClient = mongodb.MongoClient;

// URL da conexão 
var url = 'mongodb://hyagosouzza:hyago0123@ds161873.mlab.com:61873/selecao_de_vagas';

var cadastros;
var dataBase;

app.use(cookieParser());

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
        collection = db.collection('cadastro');
        collection.find({}).toArray(function (err, resultado) {
            if (err) {
                console.log(err);
            } else if (resultado.length) {
                console.log('Encontrado:', resultado)
                cadastros = resultado;
            } else {
                console.log('Nenhum documento encontrado!')
            }

        });
        dataBase = db;
        //Fecha a conexão
        //db.close();
    }
});


app.use(express.static(__dirname + '/frontend'));

app.use('\/admin(\#\!)?(\//w*)?', function (req, res, next) {
    console.log('Verificando Admin');
    console.log('Cookies: ' + req.cookies.logado);
    var isLogged = req.cookies.logado;
    if (isLogged == '1') {
        //res.sendFile(__dirname + '/frontend/templates/admin/admin.html');
        next();
    }
    else {
        //res.status(401).send('Usuário sem permissão');
        res.redirect('http://localhost:8000');
    }
});

app.use('\/user(\#\!)?(\//w*)?', function (req, res, next) {
    console.log('Verificando User');
    console.log('Cookies: ' + req.cookies.logado);
    var isLogged = req.cookies.logado;
    if (isLogged == '2') {
        //res.sendFile(__dirname + '/frontend/templates/main/user.html');
        next();
    }
    else {
        //res.status(401).send('Usuário sem permissão');
        res.redirect('http://localhost:8000');
    }
});

/*app.get('/admin/:more', function (req, res, next) {
    console.log('Path: ' + req.path);

    res.sendFile(__dirname + '/frontend/index2.html');
});*/

app.get('/admin/visualizar-vagas', function (req, res, next) {
    console.log('GET VISU');
    res.sendFile(__dirname + '/frontend/templates/admin/visualizar.html');
});

app.get('/admin/cadastrar-vagas', function (req, res, next) {
    console.log('GET CADA');
    res.sendFile(__dirname + '/frontend/templates/admin/cadastrarVaga.html');
});

app.get('/admin/cadastrar-vagas:_id', function (req, res, next) {
    console.log('GET CADA');
    res.sendFile(__dirname + '/frontend/templates/admin/cadastrarVaga.html');
});

app.post('/login', function (request, response) {
    var email = request.param('username');
    var senha = request.param('password');

    var isAdmin = false;

    for (index in cadastros) {
        console.log('checando ' + cadastros[index].email + ' ' + cadastros[index].senha);
        console.log(email + ' ' + encrypt(senha));
        if (email == cadastros[index].email && encrypt(senha) == cadastros[index].senha) {
            if (cadastros[index].tipo == "A") {
                isAdmin = true;
                response.cookie('logado', '1', {maxAge: 30 * 60 * 1000});
                console.log('Cookie Criado');
                return response.send('/admin');
            } else if (cadastros[index].tipo == "U") {
                isAdmin = true;
                response.cookie('logado', '2', {maxAge: 30 * 60 * 1000});
                console.log('Cookie Criado');
                return response.send('/user');
            }

        }
    }

    if (!isAdmin) {
        return response.status(401).send('Usuário inexistente ou sem permissão');
    }
});
var vagaCollection;
app.get('/api/vagas', function (request, response) {
            // Obtem a coleção de documentos
            var collection = dataBase.collection('Vagas');

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
    vagaCollection = collection;
});



app.get('/api/vagas/:_id', function (request, response) {
    var ObjectId = require('mongodb').ObjectId;
    var id = request.params._id;
    var o_id = new ObjectId(id);

            // Obtem a coleção de documentos
            //var collection = dataBase.collection('Vagas');
            var collection = vagaCollection;

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
    var isEdit = request.param('isEdit');
    var id = request.param('id');

    console.log('isEdit = ' + isEdit);
    console.log('id = ' + id);
        if (isEdit == true || isEdit == "true") {
            var query = {"_id": new ObjectID(id)};
            var newVal = {
                $set: {
                    salario: vagaSalario,
                    quantVagasMax: vagaMax,
                    diasTrab: vagaDiasTrab,
                    hrTrab: vagaHrTrab,
                    local: vagaLocal,
                    end: vagaEnd,
                    conheExtra: vagaConheExtra,
                    datInsc: vagaDatIns,
                    datUltAlt: vagaDatUltAlt
                }
            };
            dataBase.collection('Vagas', function (err, collection) {
                collection.updateOne(query, newVal, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    return response.sendStatus(200);
                })
            });
        } else {
            dataBase.collection('Vagas', function (err, collection) {
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
                });
                return response.sendStatus(200);
            });
        }
});

app.delete('/api/vagas/:_id', function (request, response) {
    var ObjectId = require('mongodb').ObjectId;
    var id = request.params._id;
    var o_id = new ObjectId(id);

            // Obtem a coleção de documentos
            var collection = dataBase.collection('Vagas')

            //usando o comando update para atualizar dados
            collection.deleteOne({_id: o_id}, function (err, numUpdated) {
                if (err) {
                    console.log(err);
                } else if (numUpdated) {
                    console.log('Documento deletado com sucesso.', numUpdated)
                    return response.sendStatus(200);
                } else {
                    console.log('Nenhum documento encontrado!')
                }
            });
});

app.post('/logout', function (req, res, next) {
    console.log('LOGOUT POST');
    res.cookie('logado', '0', {maxAge: 1});
    //res.clearCookie('logado');
    return res.sendStatus(200);
});

//app.get('(/w*)?/logout', function (req, res, next) {
app.get('/logout', function (req, res, next) {
    console.log('LOGOUT GET');
    res.cookie('logado', '0', {maxAge: 1});
    return res.redirect('http://localhost:8000');
});

app.get('/api/vagas', function (request, response, next) {
    console.log(dados);
    response.json(dados);
    next();
});

redirectAdmin = function (req, res, next) {
    res.sendFile(__dirname + '/frontend/templates/admin/admin.html');
    next();
};

app.get('/admin', redirectAdmin, function (req, res, next) {
    console.log('GET ADMIN');
});

redirectUser = function (req, res, next) {
    res.sendFile(__dirname + '/frontend/templates/main/user.html');
    next();
};

app.get('/user', redirectUser, function (req, res, next) {
    console.log('GET USER');
});

encrypt = function (string) {
    encrypted = 0;
    for (i = 0; i < string.length; i++) {
        encrypted += string.charCodeAt(i);
    }
    encrypted *= string.length;
    encrypted = encrypted.toString(16);
    return encrypted;
};

var porta = process.env.PORT || 8000;
server.listen(porta, function () {
    console.log("Funcionando na porta " + porta);
});
