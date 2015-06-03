angular.module('nutritionApp').controller('nutritionController', ['$http', '$scope', function ($http, $scope) {
  'use strict';
  
  $http.get('desserts.json').success(function (desserts) {
    $scope.desserts = desserts;
  });
}]);