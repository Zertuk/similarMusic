'use strict';

/**
 * @ngdoc overview
 * @name similarMusicApp
 * @description
 * # similarMusicApp
 *
 * Main module of the application.
 */
angular
  .module('similarMusicApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'wu.masonry'

  ])
  //ajax requests to spotify api
  .factory('mainService', function($http) {
    return {
      getArtistId: function(searchInput) {
        return $http.get('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist&limit=5')
        .then(function(result) {
          return result.data;
        });
      },
      getRelatedArtists: function(id) {
        return $http.get('https://api.spotify.com/v1/artists/' + id + '/related-artists')
        .then(function(result) {
          return result.data;
        });
      },
      getArtistTracks: function(artist) {
        return $http.get('https://api.spotify.com/v1/artists/' + artist + '/top-tracks?country=US')
        .then(function(result) {
          return result.data;
        });
      }
    }
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
