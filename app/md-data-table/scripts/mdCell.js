'use strict';

angular.module('md.data.table').directive('mdCell', mdCell);

function mdCell() {
  
  function compile(tElement) {
    tElement.find('md-select').attr('md-container-class', 'md-table-select');
    
    return postLink;
  }
  
  function Controller() {
    
  }
  
  function postLink(scope, element, attrs, ctrls) {
    var select = element.find('md-select');
    var cellCtrl = ctrls.shift();
    var tableCtrl = ctrls.shift();
    
    if(attrs.ngClick) {
      element.addClass('clickable');
    }
    
    if(select.length) {
      select.addClass('md-table-select').on('click', function (event) {
        event.stopPropagation();
      });
      
      element.addClass('clickable').on('click', function (event) {
        event.stopPropagation();
        select[0].click();
      });
    }
    
    cellCtrl.getTable = tableCtrl.getElement;
    
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
    controller: Controller,
    compile: compile,
    require: ['mdCell', '^^mdTable'],
    restrict: 'E'
  };
}