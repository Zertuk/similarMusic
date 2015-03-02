'use strict';

/**
 * @ngdoc function
 * @name similarMusicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the similarMusicApp
 */

angular.module('similarMusicApp')
  .controller('MainCtrl', function ($scope, $http, $sce, $location, mainService) {
    
    //finds artist ID from user input and then sends ID to relatedArtistLookup to find related artists
    $scope.artistIDLookUp = function() {
      mainService.getArtistId($scope.searchInput).then(function(data) {
        if (data.artists.items[0] == undefined) {
          console.log('invalid artist ID');
        }
        else {
          console.log('ok')
          var id = data.artists.items[0].id;
          $scope.relatedArtistLookUp(id);
        }
      })
  	};

  	$scope.relatedArtistLookUp = function(id) {
      mainService.getRelatedArtists(id).then(function(data) {
        $scope.relatedArtists = data;
        $scope.relatedArtistFunctions($scope.relatedArtists);
      });
    };

    //mass function call for relatedArtists
    $scope.relatedArtistFunctions = function(relatedArtists) {
      $scope.replaceSpaces(relatedArtists);
      // $scope.wikiLookUp();
      $scope.trackLookUp();
    };

    //replaces spaces with underscores for the wikipedia link
    $scope.replaceSpaces = function(relatedArtists) {
      for (var i = 0; i < relatedArtists.artists.length; i++) {
        $scope.relatedArtists.artists[i].newName = relatedArtists.artists[i].name.split(' ').join('_');
      }
    };
    //looks up top 3 tracks for each artists
    $scope.trackLookUp = function() {
      for (var i = 0; i < $scope.relatedArtists.artists.length; i++) {
        (function(i) {
          mainService.getArtistTracks($scope.relatedArtists.artists[i].id).then(function(json) {
            $scope.relatedArtists.artists[i].tracks = [json.tracks[0], json.tracks[1], json.tracks[2]];
            console.log($scope.relatedArtists.artists[i].tracks);
            for (var j = 0; j < 3; j++) {
              $scope.relatedArtists.artists[i].tracks[j].song_url = $sce.trustAsResourceUrl($scope.relatedArtists.artists[i].tracks[j].preview_url);
            }
            $scope.relatedArtists.artists[i].currentTrack = $scope.relatedArtists.artists[i].tracks[0].song_url;
            $scope.relatedArtists.artists[i].currentTrackName = $scope.relatedArtists.artists[i].tracks[0].name;
            $scope.relatedArtists.artists[i].index = i;
            $scope.ready = true;
          })
        })(i);
      }
    }
    //switch song on album click
    $scope.switchSong = function(song, name, index) {
      $scope.relatedArtists.artists[index].currentTrack = song;
      $scope.relatedArtists.artists[index].currentTrackName = name;   
    };
    //finds the first ~paragraph or so of a wikipedia page
    $scope.wikiLookUp = function() {
      for (var i = 0; i < $scope.relatedArtists.artists.length; i++) {
        (function(i) {
          $http.jsonp('http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exsentences=10&titles=' + $scope.relatedArtists.artists[i].name + '&callback=JSON_CALLBACK').
          success (function(json) {
              for (var property in json.query.pages) {
                  if (json.query.pages.hasOwnProperty(property)) {
                    $scope.relatedArtists.artists[i].bio = json.query.pages[property].extract;
                    console.log(json.query.pages[property].extract);
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
});

