angular.module('visu', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/admin/visualizar.html',
        controller: 'mainController'
    });
});

angular.module('cada', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/admin/cadastrarVaga.html',
        controller: 'mainController'
    });
});