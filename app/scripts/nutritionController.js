angular.module('nutritionApp').controller('nutritionController', ['$http', '$scope', function ($http, $scope) {
  'use strict';
  
  $scope.selected = [];
  
  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  
  $http.get('desserts.js').then(function (desserts) {
    $scope.desserts = desserts.data;
  });
  
  $scope.skip = function (dessert, index) {
    return index >= ($scope.query.limit * ($scope.query.page - 1));
  };
}]);