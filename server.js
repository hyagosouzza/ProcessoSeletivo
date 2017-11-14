var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

//Vamos importar os drivers nativos do mongodb
var mongodb = require('mongodb');

//Precisamos usar a interface "MongoClient" para se conectar com o servidor
var MongoClient = mongodb.MongoClient;

// URL da conexão 
var url = 'mongodb://hyagosouzza:hyago0123@ds161873.mlab.com:61873/selecao_de_vagas';

var cadastros;

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

        //Fecha a conexão
        db.close();
    }
});


app.use(express.static(__dirname + '/frontend'));

app.use('\/admin(\#\!)?(\//w*)?', function(req, res, next) {
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

/*app.get('/admin/:more', function (req, res, next) {
    console.log('Path: ' + req.path);

    res.sendFile(__dirname + '/frontend/index2.html');
});*/

app.get('/admin/visualizar-vagas', function (req, res, next) {
   console.log('GET VISU');
   res.sendFile(__dirname + '/frontend/templates/admin/visualizar.html');
});

app.post('/login',  function (request, response) {
    var email = request.param('username');
    var senha = request.param('password');

    var isAdmin = false;

    for (index in cadastros) {
      console.log('checando ' + cadastros[index].email + ' ' + cadastros[index].senha) ;
      console.log(email + ' ' + encrypt(senha));
      if (email == cadastros[index].email && encrypt(senha) == cadastros[index].senha) {
          isAdmin = true;
          response.cookie('logado', '1', { maxAge : 30 * 60  * 1000});
          console.log('Cookie Criado');
          return response.send('/admin');
      }
    }

    if (!isAdmin) {
        return response.status(401).send('Usuário inexistente ou sem permissão');
    }
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

redirectAdmin = function(req, res, next) {
    res.sendFile(__dirname + '/frontend/templates/admin/admin.html');
    next();
};

app.get('/admin', redirectAdmin, function (req, res, next) {
    console.log('GET ADMIN');
});

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
});

var porta = process.env.PORT || 8000;
server.listen(porta, function(){
    console.log("Funcionando na porta " + porta);
});