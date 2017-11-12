angular.module('meuApp')
    .controller('mainController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.data = new Date();
        $scope.vagas = [];

        var socket = io.connect('http://127.0.0.1:8000');

        $scope.verificaAdmin = function (email, senha) {
            $http.post('/login?username=' + email + '&password=' + senha).then(function (response) {
                window.location.href = response.data;
            }, function (response) {
                return alert(response.data);
            });
        }

        $scope.getVagas = function () {
            $http.get('/api/vagas').then(function (response) {
                $scope.vagas = response.data;
            });
        }

        $scope.addVaga = function(){
            $http.post('/api/vagas?nome=' + $scope.vaga.nome + '&salario=' + $scope.vaga.salario +
                       '&quantVagasMax=' + $scope.vaga.quantVagasMax + '&diasTrab=' + $scope.vaga.diasTrab +
                       '&hrTrab=' + $scope.vaga.hrTrab + '&local=' +$scope.vaga.local + '&end=' + $scope.vaga.end +
                       '&conheExtra=' + $scope.vaga.conheExtra + '&datInsc=' + $scope.vaga.datInsc).then(function(response) {
                window.location.href = "#!/admin";
            }, function (response) {
                    return alert("erro");
            });
        }

    }]);