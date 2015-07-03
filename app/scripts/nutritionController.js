angular.module('nutritionApp').controller('nutritionController', ['$http', '$q', '$timeout', '$scope', function ($http, $q, $timeout, $scope) {
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
  
  $scope.onpagechange = function(page, limit) {
    
    console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
    console.log('Page: ' + page + ' Limit: ' + limit);
    
    var deferred = $q.defer();
    
    $timeout(function () {
      deferred.resolve();
    }, 2000);
    
    return deferred.promise;
  };
  
  $scope.loadStuff = function () {
    var deferred = $q.defer();
    
    $timeout(function () {
      deferred.reject();
    }, 2000);
    
    $scope.deferred = deferred.promise;
  };
  
  $scope.onorderchange = function(order) {
    
    console.log('Scope Order: ' + $scope.query.order);
    console.log('Order: ' + order);
    
    var deferred = $q.defer();
    
    $timeout(function () {
      deferred.resolve();
    }, 2000);
    
    return deferred.promise;
  };
  
  $scope.skip = function (dessert, index) {
    return index >= ($scope.query.limit * ($scope.query.page - 1));
  };
}]);