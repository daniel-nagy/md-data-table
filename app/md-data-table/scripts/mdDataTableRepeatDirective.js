angular.module('md.data.table').directive('mdTableRepeat', function () {
  'use strict';
  
  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      // notifies the parent directive everytime ngRepeat changes
      if(scope.$last) {
        ctrl.ready();
      }
    }
  };
});