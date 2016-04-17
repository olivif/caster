// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        })
            .otherwise({ redirectTo: '/home' });
    }]);
