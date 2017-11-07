angular.module('meuApp')
    .controller('mainController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.data = new Date();
        encrypt = function (string) {
            encrypted = 0;
            for (i = 0; i < string.length; i++) {
                encrypted  += string.charCodeAt(i);
            }
            encrypted *= string.length;
            encrypted = encrypted.toString(16);
            return encrypted;
        }

        $scope.verificaAdmin = function (email, senha) {
            $.ajax ({
                url: "https://api.mlab.com/api/1/databases/selecao_de_vagas/collections/Admins?apiKey=uUgrdYIhiMZ1vRAdaUTJcHRtpBhwefCk",
            }).done(function (data) {
                var index = 0;
                for (index = 0; index < data.length; index++) {
                    if (email == data[index].email && encrypt(senha) == data[index].senha) {
                        return window.location.href = "#!/admin";
                    }
                }
                return alert("Email ou Senha incorretos!");
            });
        };
    }]);