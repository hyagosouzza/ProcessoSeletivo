angular.module('meuApp')
    .controller('mainController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
        $scope.data = new Date(); 
        $scope.admins = [
            {email : "hyagosouzza@hotmail.com", senha : "123"}
        ];
    }]);