angular.module('meuApp', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/main/index.html',
            controller: 'mainController'
        }).otherwise( {
            redirectTo: '/'
        });
    });
