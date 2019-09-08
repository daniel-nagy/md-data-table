angular.module('nutritionApp').controller('deleteController', ['desserts', '$mdDialog', '$nutrition', '$scope', '$q', function (desserts, $mdDialog, $nutrition, $scope, $q) {
  'use strict';

  this.cancel = $mdDialog.cancel;

  function deleteDessert(dessert, index) {
    var deferred = $nutrition.desserts.remove({
      id: dessert._id,
      secret: $scope.authorize.secret
    });

    return deferred.$promise.then(function () {
      desserts.splice(index, 1);
    });
  }

  function onComplete() {
    $mdDialog.hide();
  }

  function error() {
    $scope.error = 'Invalid secret.';
  }

  this.submit = function () {
    $q.all(desserts.map(deleteDessert)).then(onComplete).catch(error);
  };

}]);