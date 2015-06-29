angular.module('md.data.table').directive('mdTableProgress', function () {
  'use strict';
  
  function postLink(scope, element, attrs, ctrl) {
    
    scope.getColumnCount = function () {
      return ctrl.columns.length;
    };
    
    ctrl.hideProgress = function () {
      scope.showProgress = false;
    };
    
    ctrl.showProgress = function () {
      scope.showProgress = true;
    };
  }
  
  return {
    link: postLink,
    require: '^mdDataTable',
    replace: true,
    templateUrl: 'templates.md-data-table-progress.html'
  };
});
