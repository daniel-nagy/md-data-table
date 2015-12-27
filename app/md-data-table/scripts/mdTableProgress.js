'use strict';

angular.module('md.data.table').directive('mdTableProgress', mdTableProgress);

function mdTableProgress() {

  function postLink(scope, element, attrs, tableCtrl) {
    scope.columnCount = tableCtrl.columnCount;
    
    scope.deferred = function () {
      return !!tableCtrl.queue.length;
    };
  }

  return {
    link: postLink,
    require: '^^mdTable',
    restrict: 'C',
    scope: {},
    templateUrl: 'md-table-progress.html'
  };
}