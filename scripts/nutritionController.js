angular.module('nutritionApp').controller('nutritionController', ['$nutrition', '$scope', function ($nutrition, $scope) {
  'use strict';

  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

  $scope.$watchCollection('query', function (newValue, oldValue) {
    if(newValue === oldValue) {
      return;
    }

    $nutrition.desserts.get($scope.query, function (desserts) {
      $scope.desserts = desserts;
    });
  });

}]);