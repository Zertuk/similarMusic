'use strict';

/**
 * @ngdoc function
 * @name similarMusicApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the similarMusicApp
 */
angular.module('similarMusicApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
