angular.module('meuApp')
    .controller('mainController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.data = new Date();
        $scope.vagas = [];

        var socket = io.connect('http://127.0.0.1:8000');

        socket.on('authenticated', function() {
            return window.location.href = "#!/admin";
        });

        socket.on('notAuthenticated', function() {
            return alert("Email ou Senha incorretos!");
        });

        $scope.verificaAdmin = function (email, senha) {
            $.ajax ({
                url: "https://api.mlab.com/api/1/databases/selecao_de_vagas/collections/Admins?apiKey=uUgrdYIhiMZ1vRAdaUTJcHRtpBhwefCk",
            }).done(function (lista) {
                socket.emit('getAdmins', JSON.stringify({"lista" : lista, "email" : email, "senha" : senha}));
            });
        }

        $scope.getVagas = function () {
            $http.get('/api/vagas').then(function (response) {
                $scope.vagas = response.data;
            });
        }
    }]);