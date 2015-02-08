'use strict';

/**
 * @ngdoc function
 * @name similarMusicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the similarMusicApp
 */
var test;
var searchInput = "";

angular.module('similarMusicApp')
  .controller('MainCtrl', function ($scope, $http) {

  	$scope.artistIDLookUp = function() {
  		var searchInput = "";
  		$http.get('https://api.spotify.com/v1/search?q=' + $scope.searchInput + '&type=artist&limit=5').
  		success (function(json) {
			if (json.artists.items[0] == undefined) {
				console.log('invalid artist ID');
			}
			else {
				var id = json.artists.items[0].id;
				$scope.relatedArtistLookUp(id);
				// $scope.albumLookUp(id);
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
				console.log($scope.relatedArtists);
		});
    $scope.replaceSpaces = function(relatedArtists) {
      for (var i = 0; i < relatedArtists.artists.length; i++) {
        $scope.relatedArtists.artists[i].newName = relatedArtists.artists[i].name.split(' ').join('_');
      }
    };
    $scope.wikiLookUp = function() {
      for (var i = 0; i < $scope.relatedArtists.artists.length; i++) {
        $http.defaults.headers.Origin = 'http://www.zertukis.com';
        $http.get('http://en.wikipedia.org/w/api.php?format=jsonp&action=query&prop=extracts&exsentences=100&titles=Kid%20Cudi').
        success (function(json) {
          console.log(json);
          test = json;
        }).
        error (function() {
          console.log('Wiki retrieval error');
        });
      };
    };
  };

  	// $scope.albumLookUp = function(id) {
  	// 	$http.get('https://api.spotify.com/vi/artists/' + id + '/albums').
  	// 	success (function(json) {
  	// 		var albumList = json;
  	// 		console.log(albumList);
  	// 	});
  	// };
  });

