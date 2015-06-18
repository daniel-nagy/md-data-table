angular.module('md.data.table').directive('mdTableBody', ['$mdTableRepeat', '$timeout', function ($mdTableRepeat, $timeout) {
  'use strict';
  
  function postLink(scope, element, attrs, ctrl) {
    var listener;
    
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
    
    ctrl.ready = function () {
      var self = this;
      
      if(!listener && element.parent().attr('md-row-select')) {
        var items = $mdTableRepeat.parse(element.find('tr').attr('ng-repeat')).items;
        
        // clear the selected items (incase of server side filtering or pagination)
        listener = scope.$watch(items, function (newValue, oldValue) {
          if(newValue !== oldValue) {
            ctrl.selectedItems.splice(0);
          }
        });
      }
      
      // set numeric cells
      this.columns.forEach(function (column, index) {
        if(!column.isNumeric) {
          return;
        }
        
        self.column(index, function (cell) {
          cell.style.textAlign = 'right';
          
          if(self.columns[index].hasOwnProperty('precision')) {
            $timeout(function () {
              cell.innerHTML = parseInt(cell.innerHTML).toFixed(self.columns[index].precision);
            });
          }
          
          if(cell.attributes.hasOwnProperty('show-unit')) {
            $timeout(function () {
              cell.innerHTML += self.columns[index].unit;
            });
          }
        });
      });
    };
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