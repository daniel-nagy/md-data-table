angular.module('nutritionApp').controller('nutritionController', ['$nutrition', '$scope', function ($nutrition, $scope) {
  'use strict';

  $scope.logItems = function () {
    console.log($scope.selected);
  };

  $nutrition.desserts.query(function (desserts) {
    $scope.desserts = desserts;
  });

  $scope.filter = function (filter) {
    $nutrition.desserts.query({filter: filter}, function (desserts) {
      $scope.desserts = desserts;
    });
  };

}]);