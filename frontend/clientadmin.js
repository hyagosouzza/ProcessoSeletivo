angular.module('visu', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/admin/visualizar.html',
        controller: 'mainController'
    });
});