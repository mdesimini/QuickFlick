var controllers = angular.module('movieControllers', []);

controllers.controller('MainController', function ($scope, $http) {
    $scope.movies = [];
    $scope.trailers = '';
    $scope.metascore = '';
    $scope.movieId = ''; //'tt2294629';
    $scope.embedCode = '';
    $scope.backdrops = '';
    $scope.posterPic = '';
    $scope.noResults = {};
    $scope.topTenMovie = '';
    $scope.rated = '';
    $scope.runningTime = '';
    $scope.textRating = '';
    $scope.popularNow = [];
    $scope.similarFilms = [];
    $scope.newReleases = [];
    $scope.upcoming = [];

    $scope.movies = $scope.noResults;


    $scope.$watch('movieName', function () {
        if (!$scope.movieName) {
            //$scope.alertMessage = 'Test!!';
            //console.log('test');
            //$scope.set();
        } else {
            //temp force awakens bug
            if($scope.movieName=='Star Wars: The Force Awakens'){
                $scope.movieName ='Star Wars Episode VII: The Force Awakens';
                searchMovie();
                $scope.hide();
            }
            
            else {
                searchMovie();
                $scope.hide();
            }
            //searchMovie();
            //getTrailer();
            //$scope.showingTrailer();
            //$scope.alertMessage = '';
            var trailDiv = document.getElementById('trail');
            trailDiv.innerHTML = '';
        }

    });


    $scope.movieName = '';

    var searchMovie = function () {
        $http({
            url: 'http://www.omdbapi.com/?',
            method: "GET",
            params: {
                t: $scope.movieName,
                plot: 'full',
                tomatoes: 'true'
            }
        }).then(function successCallback(response) {

            $scope.movies = response.data;
            $scope.poster = response.data.Poster;
            //delete response.data.Poster;
            $scope.movieId = response.data.imdbID;
            $scope.rated = response.data.Rated;
            $scope.runningTime = response.data.Runtime;
            $scope.metascore = response.data.Metascore;
            if($scope.metascore!='N/A') {
                setScoreColor($scope.metascore);
                console.log('meta used');
            }
            else {
                setScoreColor(response.data.imdbRating*10);
                console.log('meta n/a, using IMDB');
            }
            //setScoreColor($scope.metascore);
            
            
            getTrailer();


        }, function errorCallback(response) {

            console.log('movie data failed');

        });


        //$scope.movieId = $scope.movies.imdbID;

    };

    //https://api.themoviedb.org/3/movie/550?
    //http://api.themoviedb.org/3/movie/tt2294629/videos?api_key=e480151695b9b1e60ac9adbf32ae1828


    var getTrailer = function () {

        $http({
            url: 'http://api.themoviedb.org/3/movie/' + $scope.movieId + '/videos?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            //console.log('success');
            $scope.trailers = response.data.results[0];
            if($scope.trailers.key){
                $scope.embedCode = '<iframe id="traileriframe" width="560" height="315" src="https://www.youtube.com/embed/' + $scope.trailers.key + '" frameborder="0" allowfullscreen></iframe>';    
            }
            else {
                console.error('no trailer found');
            }
            $scope.showingTrailer();

        }, function errorCallback(response) {

            console.error('trailer error');
            document.getElementById('main').style.backgroundImage = "none";
            //$scope.trailers = $scope.noResults;

        });

        getBackdrops();
    };

    var getBackdrops = function () {
        //http://api.themoviedb.org/3/movie/id/images
        $http({
            url: 'http://api.themoviedb.org/3/movie/' + $scope.movieId + '/images?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            $scope.backdrops = response.data.backdrops[0];
            $scope.backdrop_fp = $scope.backdrops.file_path;

        }, function errorCallback(response) {

            console.error('backdrop error');
            document.getElementById('bg').style.backgroundImage = "none";
            //$scope.trailers = $scope.noResults;

        });

        getPoster();
    };

    var getPoster = function () {

        $http({
            url: 'http://api.themoviedb.org/3/movie/' + $scope.movieId + '/images?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {
            
            $scope.posterPic = 'https://image.tmdb.org/t/p/original' + response.data.posters[0].file_path;
            setTimeout (setPosterStyling, 500 );
            setBg($scope.posterPic);

        }, function errorCallback(response) {

            console.error('poster error');
            $scope.posterPic = 'images/image-unavailable.jpg';

        });
        
        getSimilarMovie($scope.movieId);
        //setTimeout (setPosterStyling, 1500 );
        setTimeout(function(){ 
            $('#poster').removeClass();
        }, 1500);
        //setPosterStyling();

    };


    $scope.showingTrailer = function () {

        var trailDiv = document.getElementById('trail');

        trailDiv.innerHTML = $scope.embedCode;

        if (trailDiv.innerHTML == $scope.embedCode) {
            return true;
        } else {
            return false;
        }
    };
    
    var setScoreColor = function(val) {
        var meterText = "";
      
        if(val>=0 && val <=19) {
            document.getElementById('metascore').style.color = "#FF0000";
            meterText = "Overwhelming dislike";
            $scope.textRating = meterText;
            setTimeout(function(){
                setRatingMeter(val, "#FF0000");                
            }, 700);
        }
        
        else if(val>=20 && val <=49) {
            document.getElementById('metascore').style.color = "#FF0000";
            meterText = "Generally unfavorable";
            $scope.textRating = meterText;
            setTimeout(function(){
                setRatingMeter(val, "#FF0000");                                
            }, 700);            

        }
        
        else if(val>=50 && val <=74) {
            document.getElementById('metascore').style.color = "#FFCC33";
            meterText = "Mixed or average";
            $scope.textRating = meterText;
            setTimeout(function(){
                setRatingMeter(val, "#FFCC33");                    
            }, 700);            
            
        }
        
        else if(val>=75 && val <=89) {
            document.getElementById('metascore').style.color = "#66CC33";
            meterText = "Generally favorable";
            $scope.textRating = meterText;
            setTimeout(function(){
                setRatingMeter(val, "#66CC33");                   
            }, 700);            
            
        }
        
        else if(val>=90 && val <=100) {
            document.getElementById('metascore').style.color = "#66CC33";
            meterText = "Universal acclaim";
            $scope.textRating = meterText;
            setTimeout(function(){
                setRatingMeter(val, "#66CC33");                                
            }, 700);            
            
        }        
        
        else {
            document.getElementById('metascore').style.color = "black";
            meterText = "N/A";
            $scope.textRating = meterText;            
            setTimeout(function(){
                setRatingMeter(0, "black");
            }, 700);
        }
        
    };

    var setBg = function (val) {
        document.getElementById('main').style.backgroundImage = "url('https://image.tmdb.org/t/p/original" + val + "')";
        document.getElementById('main').style.backgroundImage = "background-size: cover";
        document.getElementById('main').style.backgroundImage = "background-repeat: no-repeat";
        document.getElementById('bg').style.backgroundImage = "url('https://image.tmdb.org/t/p/original" + $scope.backdrops.file_path + "')";
        document.getElementById('bg').style.backgroundImage = "background-size: cover";
    };
    
    var setRatingMeter = function(meterWidth, color) {
        //set back to zero to start
        document.getElementById('ratingMeter').style.width = meterWidth+"%";
        document.getElementById('ratingMeter').style.background = color;
    };

    $scope.getRandomMovie = function () {
        //http://api.themoviedb.org/3/movie/top_rated?api_key=e480151695b9b1e60ac9adbf32ae1828
        var randomPage = Math.floor(Math.random() * 120);
        var randomSelection = Math.floor(Math.random() * 11);

        $http({
            url: 'http://api.themoviedb.org/3/movie/top_rated?page=' + randomPage + '&language=en&api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            $scope.topTenMovie = response.data.results[randomSelection]; //.original_title;


            var topTenTitle; // = $scope.topTenMovie;

            if ($scope.topTenMovie.original_language == "en") {
                console.log('its english');
                topTenTitle = $scope.topTenMovie.title;
                $scope.movieName = topTenTitle;
            } else {
                console.log('first film not english, retrying');
                $scope.getRandomMovie();
            }

        }, function errorCallback(response) {

            console.error('random retrieval error');

        });

    };

    
    $scope.setDefaultStyles = function() {
        
        document.getElementById('main').style.backgroundImage = "none";
        document.getElementById('bg').style.backgroundImage = "none";   
        console.log('styles cleared');
          
    };
    
    var getPopularNow = function() {
      
        //http://api.themoviedb.org/3/movie/popular?api_key=e480151695b9b1e60ac9adbf32ae1828
        $http({
            url: 'http://api.themoviedb.org/3/movie/popular?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            $scope.popularNow = response.data.results;

        }, function errorCallback(response) {

            console.error('popular now retrieval error');

        });
        
    };
    
        getPopularNow();
    
    $scope.searchPop = function(val) {
        console.log('pressed');
        //var elId = document.getElementById('popParagraph').innerHTML;
        $scope.movieName = val;
        console.log(val);
    };
    
    $scope.clearSearch = function() {
        $scope.movieName = '';
        document.getElementById("movieSearchBox").focus();
    };
    
    var getSimilarMovie = function(val) {
        //http://api.themoviedb.org/3/movie/271110/similar?api_key=e480151695b9b1e60ac9adbf32ae1828  
        
        $http({
            url: 'http://api.themoviedb.org/3/movie/'+val+'/similar?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            //$scope.popularNow = response.data.results;
            $scope.similarFilms = response.data.results;
            console.log('got similar');
            console.log($scope.similarFilms);

        }, function errorCallback(response) {

            console.error('similar film retrieval error');

        });        
        
    };
    
    var getNewReleases = function(val) {
        //http://api.themoviedb.org/3/movie/271110/similar?api_key=e480151695b9b1e60ac9adbf32ae1828  
        
        $http({
            url: 'http://api.themoviedb.org/3/movie/now_playing?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            $scope.newReleases = response.data.results;
            console.log('got new release');

        }, function errorCallback(response) {

            console.error('new release retrieval error');

        });        
        
    };    
    
    getNewReleases();
    
    var getUpcoming = function(val) {
        //http://api.themoviedb.org/3/movie/271110/similar?api_key=e480151695b9b1e60ac9adbf32ae1828  
        
        $http({
            url: 'http://api.themoviedb.org/3/movie/upcoming?api_key=e480151695b9b1e60ac9adbf32ae1828',
            method: "GET"
        }).then(function successCallback(response) {

            $scope.upcoming = response.data.results;
            console.log('got upcoming');

        }, function errorCallback(response) {

            console.error('upcoming movie retrieval error');

        });        
        
    };    
    
    getUpcoming();
    
    var setPosterStyling = function() {

        var poster = document.getElementById("poster");
        //poster.classList.remove("animated");
        //poster.classList.remove("flipInX");
        
        poster.classList.add("animated");
        poster.classList.add("flipInX");
        
        

        //poster.classList.add("pulse");
        //poster.classList.add("pulse-active");
        
        //animated pulse pulse-active
        //flipInX animated
    };

    $scope.set = function() {
        //$scope.setDefaultStyles();
        document.getElementById("popularNowHeading").style.display = "block";
        document.getElementById("newReleaseHeading").style.display = "block";
        document.getElementById("upcomingHeading").style.display = "block";
        document.getElementById("popularNow").style.display = "block";
        document.getElementById("newRelease").style.display = "block";
        document.getElementById("upcoming").style.display = "block";
        
    };    
    
    
    $scope.hide = function() {
        //$scope.setDefaultStyles();
        document.getElementById("popularNowHeading").style.display = "none";
        document.getElementById("newReleaseHeading").style.display = "none";
        document.getElementById("upcomingHeading").style.display = "none";
        document.getElementById("popularNow").style.display = "none";
        document.getElementById("newRelease").style.display = "none";
        document.getElementById("upcoming").style.display = "none";
        
    };
    
    $scope.resetAll = function() {
        $scope.set();
        $scope.clearSearch();
        $scope.setDefaultStyles();
    };

    //setTimeout($scope.hide, 1000);
    //setTimeout($scope.set, 2000);
    
});





controllers.controller('ActorController', function ($scope, $http) {
     
    $scope.actorName = '';
    $scope.actors = [];
    $scope.knownFor = [];
    
    $scope.$watch('actorName', function () {
        if (!$scope.actorName) {
            
            console.log('nothing entered');
            
        } else {

            searchActors();

        }

    });
    
    var searchActors = function () {
        
        $http({
            url: 'http://api.themoviedb.org/3/search/person?',
            method: "GET",
            params: {
                query: $scope.actorName,
                include_adult: false,
                api_key: 'e480151695b9b1e60ac9adbf32ae1828'
            }
        }).then(function successCallback(response) {

            $scope.actorData = response.data;
            $scope.actors = response.data.results;
            
            //$scope.knownFor = response.data.results.known_for;
            //getTrailer();


        }, function errorCallback(response) {

            console.log('actor data failed');

        });        
        
    };
    
    $scope.selectSearch = function(val) {
        console.log('pressed-actor');
        //var elId = document.getElementById('popParagraph').innerHTML;
        $scope.actorName = val;
        console.log(val);
    };    
    
    $scope.clearSearch = function() {
        $scope.actorName = '';
        document.getElementById("movieSearchBox").focus();
    };
    
});