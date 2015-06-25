angular.module('md.data.table').directive('mdTableBody', ['$mdTableRepeat', function ($mdTableRepeat) {
  'use strict';
  
  function postLink(scope, element, attrs, ctrl) {
    scope.mdClasses = ctrl.classes;
    
    // enable row selection
    if(element.parent().attr('md-row-select')) {
      scope.isSelected = function (item) {
        return ctrl.selectedItems.indexOf(item) !== -1;
      };
      
      scope.toggleRow = function (item, event) {
        event.stopPropagation();
        
        if(scope.isSelected(item)) {
          ctrl.selectedItems.splice(ctrl.selectedItems.indexOf(item), 1);
        } else {
          ctrl.selectedItems.push(item);
        }
      };
    }
    
    // execute a callback function on each cell in a column
    ctrl.column = function (index, callback) {
      angular.forEach(element.find('tr'), function(row) {
        callback(angular.element(row.children[index]));
      });
    };
    
    // support numeric columns for tables not using ng-repeat
    if(element.children().length) {
      ctrl.columns.forEach(function(column, index) {
        if(column.isNumeric) {
          ctrl.column(index, function (cell) {
            ctrl.addNumericCell(cell, index);
          })
        }
      });
    }
  }
  
  function compile(iElement, iAttrs) {
    var row = iElement.find('tr');
    
    if(row.attr('ng-repeat')) {
      
      // enable row selection
      if(row.attr('ng-repeat') && iElement.parent().attr('md-row-select')) {
        var item = $mdTableRepeat.parse(row.attr('ng-repeat')).item;
        var checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        checkbox.attr('aria-label', 'Select Row');
        checkbox.attr('ng-click', 'toggleRow(' + item + ', $event)');
        checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': isSelected(' + item + ')}]');
        
        iElement.find('tr').prepend(angular.element('<td></td>').append(checkbox));
        
        if(angular.isDefined(iAttrs.mdAutoSelect)) {
          row.attr('ng-click', 'toggleRow(' + item + ', $event)');
        }
        
        row.attr('ng-class', '{\'md-selected\': isSelected(' + item + ')}');
      }
      
      iElement.find('tr').attr('md-table-repeat', '');
    }
    
    return postLink;
  }

  return {
    require: '^mdDataTable',
    compile: compile
  };
}]);