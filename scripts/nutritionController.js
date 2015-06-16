angular.module('nutritionApp').controller('nutritionController', ['$mdDialog', '$nutrition', '$scope', function ($mdDialog, $nutrition, $scope) {
  'use strict';

  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  
  $scope.addItem = function (event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: 'addItemController',
      controllerAs: 'ctrl',
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'templates/add-item-dialog.html',
    }).then(getDesserts);
  }
  
  $scope.delete = function (event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: 'deleteController',
      controllerAs: 'ctrl',
      focusOnOpen: false,
      targetEvent: event,
      locals: { desserts: $scope.selected },
      templateUrl: 'templates/delete-dialog.html',
    }).then(getDesserts);
  }
  
  function showProgress() {
    $scope.loading = true;
  }
  
  function hideProgress() {
    $scope.loading = false;
  }
  
  function success(desserts) {
    $scope.desserts = desserts;
    
    hideProgress();
  }
  
  function error() {
    hideProgress();
  }
  
  function getDesserts() {
    $nutrition.desserts.get($scope.query, success, error);
    
    showProgress();
  }

  $scope.$watchCollection('query', function (newValue, oldValue) {
    if(newValue === oldValue) {
      return;
    }
    
    getDesserts();
  });

}]);