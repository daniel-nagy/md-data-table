angular.module('md.data.table')

.controller('mdDataTableController', ['$attrs', '$parse', '$scope', function ($attrs, $parse, $scope) {
  'use strict';

  this.selectedItems = [];
  
  /*
   * Ensures two things.
   *
   * 1. If the scope variable does not exist, at the time of table
   *    creation, it will be created in the proper scope.
   *
   * 2. If the variable is not an array, it will be converted to an
   *    array.
   */
  if($attrs.mdRowSelect) {
    $parse($attrs.mdRowSelect).assign($scope.$parent.$parent, this.selectedItems);
  }
}]);