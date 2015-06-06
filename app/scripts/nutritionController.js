angular.module('nutritionApp').controller('nutritionController', ['$nutrition', '$scope', function ($nutrition, $scope) {
  'use strict';
  
  $nutrition.desserts.query(function (desserts) {
    $scope.desserts = desserts;
  });
}]);