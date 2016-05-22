//imdb rest api judge movies, or get rand movie to watch
//search movies for reviews imdb and rotten tomatoes

var app = angular.module('MoviePicker', ['ngRoute', 'movieControllers', 'angularCharts']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html',
            controller: 'MainController'
        });
        $routeProvider.when('/recommend', {
            templateUrl: 'partials/recommend.html',
            controller: 'MainController'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);