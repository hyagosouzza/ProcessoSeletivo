angular.module('visu').controller('mainController', ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams) {
        data = new Date();
        console.log(data);
        console.log($location.path());

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
        };

        $scope.getVaga = function () {
            var id = $routeParams.id;
            $http.get('/api/vagas/'+id).then(function (response) {
                $scope.vaga = response.data;
            });
        };
    }]);

angular.module('cada').controller('mainController', ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams) {
        data = new Date();
        console.log(data);
        console.log($location.path());

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

        $scope.addVaga = function(){
            $http.post('/api/vagas?nome=' + $scope.vaga.nome + '&salario=' + $scope.vaga.salario +
                '&quantVagasMax=' + $scope.vaga.quantVagasMax + '&diasTrab=' + $scope.vaga.diasTrab +
                '&hrTrab=' + $scope.vaga.hrTrab + '&local=' +$scope.vaga.local + '&end=' + $scope.vaga.end +
                '&conheExtra=' + $scope.vaga.conheExtra + '&datInsc=' + $scope.vaga.datInsc).then(function(response) {
                alert("Vaga cadastrada com sucesso!");
                window.location.href = "http://localhost:8000/admin";
            }, function (response) {
                return alert("Ocorreu algum erro!");
            });
        };

        $scope.sair = function () {
            console.log('Saindo');
            $http.post('/logout').then(function (response) {
                window.location.href = 'http://localhost:8000';
            }, function (response) {
                return alert('Ocorreu um erro');
            });
        };
}]);


