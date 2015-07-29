angular.module('md.data.table').directive('mdTableProgress', mdTableProgress);

function mdTableProgress() {
  'use strict';
  
  function postLink(scope, element, attrs, tableCtrl) {
    
    scope.getColumnCount = function () {
      return tableCtrl.columns.length;
    };
    
    tableCtrl.hideProgress = function () {
      scope.showProgress = false;
    };
    
    tableCtrl.showProgress = function () {
      scope.showProgress = true;
    };
  }
  
  return {
    link: postLink,
    require: '^mdDataTable',
    replace: true,
    templateUrl: 'templates.md-data-table-progress.html'
  };
}
