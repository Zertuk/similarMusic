'use strict';

/**
 * @ngdoc function
 * @name similarMusicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the similarMusicApp
 */

var searchInput = "";

angular.module('similarMusicApp')
  .controller('MainCtrl', function ($scope, $http) {

  	$scope.artistIDLookUp = function() {
  		var searchInput = "";
  		$http.get('https://api.spotify.com/v1/search?q=' + $scope.searchInput + '&type=artist&limit=5').
  		success (function(json) {
			if (json.artists.items[0].id) {
					var id = json.artists.items[0].id;
					$scope.relatedArtistLookUp(id);
				}
  		});
  	};

  	$scope.relatedArtistLookUp = function(id) {
  		$http.get('https://api.spotify.com/v1/artists/' + id + '/related-artists').
  		success (function(json) {
				var relatedArtists = json;
				$scope.relatedArtists = relatedArtists;
				console.log(relatedArtists);
		});
  	};
  });

