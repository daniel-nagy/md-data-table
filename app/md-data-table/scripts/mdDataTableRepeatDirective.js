angular.module('md.data.table').directive('mdTableRepeat', ['$mdTableRepeat', function ($mdTableRepeat) {
  'use strict';
  
  function postLink(scope, element, attrs, ctrl) {
    
    if(scope.$last && !ctrl.listener) {
      ctrl.ready($mdTableRepeat.parse(attrs.ngRepeat).items);
    }
    
    ctrl.columns.forEach(function (column, index) {
      if(column.isNumeric) {
        ctrl.addNumericCell(element.children().eq(index), index);
      }
    });
  }
  
  return {
    link: postLink,
    require: '^mdDataTable'
  };
}]);