var controllers = angular.module('movieControllers', []);

controllers.controller('MainController', function($scope, $http) {
    $scope.movies = [];
    $scope.trailers = '';
    $scope.movieId= ''; //'tt2294629';
    $scope.embedCode = '';
    $scope.backdrops = '';
    $scope.posterPic = '';
    $scope.noResults = {};

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
    
    //http://trailersapi.com/trailers.json?movie=The%20Dark%20Knight%20Rises&limit=5&width=320
    //$scope.movieName
    /*
    var getTrailer = function() {
        $http({
            url: 'http://trailersapi.com/trailers.json?', 
            method: "GET",
            params: {movie: $scope.movieName}
        }).then(function successCallback(response) {
            
                //console.log('success');
                $scope.trailers = response.data[0];
            
        }, function errorCallback(response) {
            
                console.log('trailer error');
                //$scope.trailers = $scope.noResults;

        });
    };*/
    

    
   
    
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
                document.getElementById('#main').style.backgroundImage = "url('https://image.tmdb.org/t/p/original'+$scope.backdrop_fp)";
                console.log('image erros');
                //https://image.tmdb.org/t/p/original/irHmdlkdJphmk4HPfyAQfklKMbY.jpg
                //https://image.tmdb.org/t/p/original{{backdrops.file_path}}
                

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

            }, function errorCallback(response) {

                    console.log('poster error');
                    //$scope.trailers = $scope.noResults;

            });
            
            
        };
    
        
    $scope.showingTrailer = function() {
            
            var trailDiv = document.getElementById('trail')
            
            //var idata = $scope.trailers.code;
        
            trailDiv.innerHTML = $scope.embedCode;
        
            if(trailDiv.innerHTML = $scope.embedCode) {
                return true;
            }
            else {
                return false;
            }
    };   
    
    
    /*
    
    $timeout(function(){
    
    }
    
    */
    
});


