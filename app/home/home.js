angular.module('myApp.home', ['ngRoute', 'myApp.castApi'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });
    }])

    .controller('HomeController', ['castApi', function(castApi) {
        
        castApi.initializeApi();
        
    }]);