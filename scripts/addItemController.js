angular.module('nutritionApp').controller('addItemController', ['$mdDialog', '$nutrition', '$scope', function ($mdDialog, $nutrition, $scope) {
  'use strict';

  this.cancel = $mdDialog.cancel;
  
  function success(dessert) {
    $mdDialog.hide(dessert);
  }
  
  this.addItem = function () {
    $scope.item.form.$setSubmitted();
    
    if($scope.item.form.$valid) {
      $nutrition.desserts.save({dessert: $scope.dessert}, success);
    }
  };
  
}]);