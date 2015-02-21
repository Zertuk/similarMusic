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
  .controller('MainCtrl', function ($scope, $http) {

  	$scope.artistIDLookUp = function() {
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
      wikiArray = [];
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

  	// $scope.albumLookUp = function(id) {
  	// 	$http.get('https://api.spotify.com/vi/artists/' + id + '/albums').
  	// 	success (function(json) {
  	// 		var albumList = json;
  	// 		console.log(albumList);
  	// 	});
  	// };
  });

