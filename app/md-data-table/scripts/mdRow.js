'use strict';

angular.module('md.data.table').directive('mdRow', mdRow);

function mdRow() {

  function compile(tElement) {
    tElement.addClass('md-row');
    return postLink;
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    function enableRowSelection() {
      return tableCtrl.$$rowSelect;
    }
    
    function isBodyRow() {
      return tableCtrl.getBodyRows().indexOf(element[0]) !== -1;
    }
    
    if(isBodyRow()) {
      scope.$watch(enableRowSelection, function (enable) {
        if(enable && !attrs.mdSelect) {
          console.error('Missing md-select attribute on table row');
        }
      });
    }
  }

  return {
    compile: compile,
    require: '^^mdTable',
    restrict: 'A'
  };
}