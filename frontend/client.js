angular.module('meuApp', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/main/index.html',
            controller: 'mainController'
        })
        .when('/admin', {
            templateUrl: 'templates/admin/admin.html',
            controller: 'mainController'
        })
        .when('/admin/visualizar-vagas', {
            templateUrl: 'templates/admin/visualizar.html',
            controller: 'mainController'
        })
        .when('/admin/cadastrar-vagas', {
            templateUrl: 'templates/admin/cadastrarVaga.html',
            controller: 'mainController'
        });
    });