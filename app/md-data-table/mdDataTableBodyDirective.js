angular.module('md.data.table', []).directive('mdTableBody', function () {
  'use strict';

  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      scope.isSelected = function (item) {
        return ctrl.selectedItems.indexOf(item) !== -1;
      };
      
      scope.toggleRow = function (item) {
        if(scope.isSelected(item)) {
          ctrl.selectedItems.splice(ctrl.selectedItems.indexOf(item), 1);
        } else {
          ctrl.selectedItems.push(item);
        }
      };
    }
  };
});