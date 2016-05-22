var controllers = angular.module('movieControllers', []);

controllers.controller('MainController', function($scope, $http) {
    $scope.movies = [];
    $scope.trailers = '';
    $scope.movieId= ''; //'tt2294629';
    $scope.embedCode = '';
    $scope.backdrops = '';
    $scope.posterPic = '';
    $scope.noResults = {};
    $scope.topTenMovie = '';

    $scope.movies = $scope.noResults;
    
    $scope.$watch('movieName', function() {
        if(!$scope.movieName){
            //$scope.alertMessage = 'Test!!';
            //console.log('test');
        }
        
        else {
            searchMovie();
            //getTrailer();
            //$scope.showingTrailer();
            $scope.alertMessage = '';
            var trailDiv = document.getElementById('trail')
            trailDiv.innerHTML = '';
        }
            
    });
    
    
    $scope.movieName = '';    
    
    var searchMovie = function() {
        $http({
            url: 'http://www.omdbapi.com/?', 
            method: "GET",
            params: {t: $scope.movieName, plot: 'full', tomatoes: 'true'}
        }).then(function successCallback(response) {
                      
                $scope.movies = response.data;
                $scope.poster = response.data.Poster;
                delete response.data.Poster;
                $scope.movieId= response.data.imdbID;
                getTrailer();
                
            
        }, function errorCallback(response) {
            
                //$scope.movies = $scope.noResults;

        });
        
        
        //$scope.movieId = $scope.movies.imdbID;
        
    };
    
    //https://api.themoviedb.org/3/movie/550?
    //http://api.themoviedb.org/3/movie/tt2294629/videos?api_key=e480151695b9b1e60ac9adbf32ae1828
    
    
    var getTrailer = function() {

            $http({
                url: 'http://api.themoviedb.org/3/movie/'+$scope.movieId+'/videos?api_key=e480151695b9b1e60ac9adbf32ae1828', 
                method: "GET"
            }).then(function successCallback(response) {

                    //console.log('success');
                    $scope.trailers = response.data.results[0];
                    $scope.embedCode = '<iframe id="traileriframe" width="560" height="315" src="https://www.youtube.com/embed/'+$scope.trailers.key+'" frameborder="0" allowfullscreen></iframe>';
                    $scope.showingTrailer();

            }, function errorCallback(response) {

                    console.log('trailer error');
                    //$scope.trailers = $scope.noResults;

            });
            
            getBackdrops();
    };
    
    var getBackdrops = function() {
    //http://api.themoviedb.org/3/movie/id/images
        $http({
            url: 'http://api.themoviedb.org/3/movie/'+$scope.movieId+'/images?api_key=e480151695b9b1e60ac9adbf32ae1828', 
            method: "GET"
        }).then(function successCallback(response) {

                $scope.backdrops = response.data.backdrops[0];
                $scope.backdrop_fp = $scope.backdrops.file_path;
 
        }, function errorCallback(response) {

                console.log('trailer error');
                //$scope.trailers = $scope.noResults;

        });
        
            getPoster();
    };
    
    var getPoster = function() {

            $http({
                url: 'http://api.themoviedb.org/3/movie/'+$scope.movieId+'/images?api_key=e480151695b9b1e60ac9adbf32ae1828', 
                method: "GET"
            }).then(function successCallback(response) {

                    $scope.posterPic = response.data.posters[0].file_path;
                    setBg($scope.posterPic);

            }, function errorCallback(response) {

                    console.log('poster error');

            });
            
            
    };
    
        
    $scope.showingTrailer = function() {
            
            var trailDiv = document.getElementById('trail');
            
            trailDiv.innerHTML = $scope.embedCode;
        
            if(trailDiv.innerHTML = $scope.embedCode) {
                return true;
            }
            else {
                return false;
            }
    };   
        
    var setBg = function(val) {
        document.getElementById('main').style.backgroundImage = "url('https://image.tmdb.org/t/p/original"+val+"')";
        document.getElementById('main').style.backgroundImage = "background-size: cover";
        document.getElementById('main').style.backgroundImage = "background-repeat: no-repeat";
        document.getElementById('bg').style.backgroundImage = "url('https://image.tmdb.org/t/p/original"+$scope.backdrops.file_path+"')";
        document.getElementById('bg').style.backgroundImage = "background-size: cover";
    };
    
    $scope.getRandomMovie = function() {
        //http://api.themoviedb.org/3/movie/top_rated?api_key=e480151695b9b1e60ac9adbf32ae1828
        var randomPage = Math.floor(Math.random()*120);
        var randomSelection = Math.floor(Math.random()*11);
        
            $http({
                url: 'http://api.themoviedb.org/3/movie/top_rated?page='+ randomPage +'&language=en&api_key=e480151695b9b1e60ac9adbf32ae1828', 
                method: "GET"
            }).then(function successCallback(response) {
                    
                $scope.topTenMovie = response.data.results[randomSelection];//.original_title;
                
                
                var topTenTitle;// = $scope.topTenMovie;
                
                if($scope.topTenMovie.original_language=='en') {
                    topTenTitle = $scope.topTenMovie.original_title;
                    $scope.movieName = topTenTitle;
                }
                
                else {
                    console.log('first film not english, retrying');
                    randomPage = Math.floor(Math.random()*120);
                    randomSelection = Math.floor(Math.random()*11);   
                    topTenTitle = $scope.topTenMovie.original_title;
                    $scope.movieName = topTenTitle;                    
                }

                    //$scope.movieName = topTen;

            }, function errorCallback(response) {

                    console.log('random retrieval error');

            });        
        
    };

    
});


