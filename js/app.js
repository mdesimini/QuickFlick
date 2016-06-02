//imdb rest api judge movies, or get rand movie to watch
//search movies for reviews imdb and rotten tomatoes

var app = angular.module('MoviePicker', ['ngRoute', 'movieControllers', 'firebase'])
.constant('FIREBASE_URL', 'https://scorching-inferno-5179.firebaseio.com/');

app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
       if(error=='AUTH_REQUIRED') {
           $rootScope.message = 'Sorry, you must log in to access this page';
           $location.path('/login');
       }
    });
}]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html',
            controller: 'MainController'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'RegisterController'
        });
        $routeProvider.when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegisterController'
        });        
        $routeProvider.when('/actor-search', {
            templateUrl: 'partials/recommend.html',
            controller: 'ActorController'
        });
        $routeProvider.when('/search/:search_query', {
            templateUrl: 'partials/main.html',
            controller: 'MainController'
        });  
        $routeProvider.when('/account', {
            templateUrl: 'partials/account.html',
            controller: 'MainController',
            resolve: {
                currentAuth: function(Authentication) {
                    return Authentication.requireAuth();
                }  //current auth
            } //resolve
        });          
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);