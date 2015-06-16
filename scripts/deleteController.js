angular.module('nutritionApp').controller('deleteController', ['$authorize', 'desserts', '$mdDialog', '$nutrition', '$scope', '$q', function ($authorize, desserts, $mdDialog, $nutrition, $scope, $q) {
  'use strict';
  
  this.cancel = $mdDialog.cancel;
  
  function deleteDessert(dessert, index) {
    var deferred = $nutrition.desserts.remove({id: dessert._id});
    
    deferred.$promise.then(function () {
      desserts.splice(index, 1);
    });
    
    return deferred.$promise;
  }
  
  function onComplete() {
    $mdDialog.hide();
  }
  
  function error() {
    $scope.error = 'Invalid secret.';
  }
  
  function success() {
    $q.all(desserts.forEach(deleteDessert)).then(onComplete);
  }
  
  this.authorizeUser = function () {
    $authorize.get({secret: $scope.authorize.secret}, success, error);
  };
  
}]);