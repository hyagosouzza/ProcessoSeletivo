angular.module('meuApp')
    .controller('mainController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        data = new Date();
        console.log(data);

        $scope.dia = data.getDate();
        $scope.ano = data.getUTCFullYear();

        switch(data.getUTCMonth()) {
            case 0:
                $scope.mes = 'Janeiro';
                break;
            case 1:
                $scope.mes = 'Fevereiro';
                break;
            case 2:
                $scope.mes = 'Março';
                break;
            case 3:
                $scope.mes = 'Abril';
                break;
            case 4:
                $scope.mes = 'Maio';
                break;
            case 5:
                $scope.mes = 'Junho';
                break;
            case 6:
                $scope.mes = 'Julho';
                break;
            case 7:
                $scope.mes = 'Agosto';
                break;
            case 8:
                $scope.mes = 'Setembro';
                break;
            case 9:
                $scope.mes = 'Outubro';
                break;
            case 10:
                $scope.mes = 'Novembro';
                break;
            case 11:
                $scope.mes = 'Dezembro';
                break;
        }

        var socket = io.connect('http://127.0.0.1:8000');

        $scope.verificaAdmin = function (email, senha) {
            $http.post('/login?username=' + email + '&password=' + senha).then(function (response) {
                window.location.href = response.data;
            }, function (response) {
                return alert(response.data);
            });
        };

        $scope.getVagas = function () {
            $http.get('/api/vagas').then(function (response) {
                $scope.vagas = response.data;
            });
        };

        $scope.sair = function () {
            console.log('Saindo');
            $http.post('/logout').then(function (response) {
                window.location.href = 'http://localhost:8000';
            }, function (response) {
                return alert('Ocorreu um erro');
            });
        }
    }]);

