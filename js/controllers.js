var controllers = angular.module('movieControllers', []);

controllers.controller('MainController', function ($scope, $http) {
    $scope.movies = [];
    $scope.trailers = '';
    $scope.movieId = ''; //'tt2294629';
    $scope.embedCode = '';
    $scope.backdrops = '';
    $scope.posterPic = '';
    $scope.noResults = {};
    $scope.topTenMovie = '';
    $scope.rated = '';
    $scope.runningTime = '';

    $scope.movies = $scope.noResults;

    $scope.$watch('movieName', function () {
        if (!$scope.movieName) {
            //$scope.alertMessage = 'Test!!';
            //console.log('test');
        } else {
            searchMovie();
            //getTrailer();
            //$scope.showingTrailer();
            $scope.alertMessage = '';
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
            $scope.embedCode = '<iframe id="traileriframe" width="560" height="315" src="https://www.youtube.com/embed/' + $scope.trailers.key + '" frameborder="0" allowfullscreen></iframe>';
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
            setBg($scope.posterPic);

        }, function errorCallback(response) {

            console.error('poster error');
            $scope.posterPic = 'images/image-unavailable.jpg';

        });


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

    var setBg = function (val) {
        document.getElementById('main').style.backgroundImage = "url('https://image.tmdb.org/t/p/original" + val + "')";
        document.getElementById('main').style.backgroundImage = "background-size: cover";
        document.getElementById('main').style.backgroundImage = "background-repeat: no-repeat";
        document.getElementById('bg').style.backgroundImage = "url('https://image.tmdb.org/t/p/original" + $scope.backdrops.file_path + "')";
        document.getElementById('bg').style.backgroundImage = "background-size: cover";
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
                topTenTitle = $scope.topTenMovie.original_title;
                $scope.movieName = topTenTitle;
            } else {
                console.log('first film not english, retrying');
                $scope.getRandomMovie();
            }

        }, function errorCallback(response) {

            console.error('random retrieval error');

        });

    };


});