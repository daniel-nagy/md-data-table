'use strict';

angular.module('md.data.table').directive('mdRow', mdRow);

function mdRow() {

  function compile(tElement) {
    tElement.addClass('md-row');
    return postLink;
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    function selectEnabled() {
      return tableCtrl.selectEnabled;
    }
    
    function isBodyRow() {
      return tableCtrl.getBodyRows().indexOf(element[0]) !== -1;
    }
    
    if(isBodyRow()) {
      scope.$watch(selectEnabled, function (enabled) {
        if(enabled && !attrs.mdSelect) {
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