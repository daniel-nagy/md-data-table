angular.module('md.data.table').directive('mdTableRepeat', function () {
  'use strict';
  
  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      if(scope.$last) {
        ctrl.ready();
      }
    }
  };
});