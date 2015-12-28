'use strict';

angular.module('md.data.table').directive('mdRow', mdRow);

function mdRow() {

  function compile(tElement) {
    tElement.addClass('md-row');
    return postLink;
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    if(element.children().hasClass('md-cell')) {
      scope.$watch(tableCtrl.selectionEnabled, function (enabled) {
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