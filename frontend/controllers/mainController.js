angular.module('meuApp')
    .controller('mainController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.data = new Date();
        $scope.admins = [
            { email: "hyago@hotmail.com", senha: "123" },
            { email: "joaop@gmail.com", senha: "123" },
            { email: "pedroh@hotmail.com", senha: "123" },
            { email: "estevao@hotmail.com", senha: "123" }
        ];
        $scope.verificaAdmin = function (email, senha) {
            var index = 0;
            for (index = 0; index < $scope.admins.length; index++) {
                if (email == $scope.admins[index].email && senha == $scope.admins[index].senha) {
                    return window.location.href = "#!/admin";
                }
            }
            return alert("Email ou Senha incorretos!");
        };
    }]);