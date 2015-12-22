'use strict';

angular.module('md.data.table').directive('mdCell', mdCell);

function mdCell() {
  
  function compile(tElement) {
    tElement.find('md-select').attr('md-container-class', 'md-table-select');
    
    return postLink;
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    var select = element.find('md-select');
    
    if(select.length) {
      
      select.on('click', function (event) {
        event.stopPropagation();
      });
      
      element.addClass('clickable').on('click', function (event) {
        event.stopPropagation();
        select[0].click();
      });
    }
    
    function getColumn() {
      return tableCtrl.columns[getIndex()];
    }
    
    function getIndex() {
      return Array.prototype.indexOf.call(element.parent().children(), element[0]);
    }
    
    scope.$watch(getColumn, function (column) {
      if(!column) {
        return;
      }
      
      if(column.numeric) {
        element.addClass('numeric');
      } else {
        element.removeClass('numeric');
      }
    });
  }
  
  return {
    compile: compile,
    require: '^^mdTable',
    restrict: 'E'
  };
}