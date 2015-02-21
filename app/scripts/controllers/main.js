'use strict';

/**
 * @ngdoc function
 * @name similarMusicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the similarMusicApp
 */
var test;
var wikiArray;

angular.module('similarMusicApp')
  .controller('MainCtrl', function ($scope, $http, $sce) {

  	$scope.artistIDLookUp = function() {
  		$http.get('https://api.spotify.com/v1/search?q=' + $scope.searchInput + '&type=artist&limit=5').
  		success (function(json) {
			if (json.artists.items[0] == undefined) {
				console.log('invalid artist ID');
			}
			else {
				var id = json.artists.items[0].id;
				$scope.relatedArtistLookUp(id);
			}
  		}).
  		error (function() {
  			console.log('invalid artist ID');
  		});
  	};

  	$scope.relatedArtistLookUp = function(id) {
  		$http.get('https://api.spotify.com/v1/artists/' + id + '/related-artists').
  		success (function(json) {
				var relatedArtists = json;
				$scope.relatedArtists = relatedArtists;
        $scope.replaceSpaces($scope.relatedArtists);
        $scope.wikiLookUp();
        $scope.trackLookUp();
				console.log($scope.relatedArtists);
		});
    $scope.replaceSpaces = function(relatedArtists) {
      for (var i = 0; i < relatedArtists.artists.length; i++) {
        $scope.relatedArtists.artists[i].newName = relatedArtists.artists[i].name.split(' ').join('_');
      }
    };
    $scope.trackLookUp = function() {
      for (var i = 0; i < $scope.relatedArtists.artists.length; i++) {
        (function(i) {
          $http.get('https://api.spotify.com/v1/artists/' + $scope.relatedArtists.artists[i].id + '/top-tracks?country=US').
          success (function(json) {
            $scope.relatedArtists.artists[i].tracks = json.tracks[0];
            console.log(json.tracks[0]);
            $scope.relatedArtists.artists[i].tracks.song_url = $sce.trustAsResourceUrl($scope.relatedArtists.artists[i].tracks.preview_url);
          }).
          error (function() {
            console.log('Related track lookup error');
          });
        })(i);
      }
    }
    $scope.wikiLookUp = function() {
      for (var i = 0; i < $scope.relatedArtists.artists.length; i++) {
        (function(i) {
          $http.jsonp('http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exsentences=10&titles=' + $scope.relatedArtists.artists[i].name + '&callback=JSON_CALLBACK').
          success (function(json) {
            test = json.query.pages;
              for (var property in test) {
                  if (test.hasOwnProperty(property)) {
                    $scope.relatedArtists.artists[i].bio = test[property].extract;
                    console.log(test[property].extract);
                    break;
                  }
              }
          }).
          error (function() {
            console.log('Wiki retrieval error');
          });
        })(i);   
      };
    };
  };
});

