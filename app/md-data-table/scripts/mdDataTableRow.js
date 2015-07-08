angular.module('md.data.table')

.directive('mdTableRow', ['$mdTable', '$timeout', function ($mdTable, $timeout) {
  'use strict';

  function postLink(scope, element, attrs, tableCtrl) {
    
    if(element.parent().parent().attr('md-row-select')) {
      var disable = element.parent().attr('md-disable-select');
      
      if(scope.$last && !tableCtrl.listener) {
        tableCtrl.onRepeatEnd($mdTable.parse(attrs.ngRepeat));
      }
      
      var isDisabled = function() {
        return disable ? scope.$eval(disable) : false;
      };
      
      scope.isSelected = function (item) {
        return tableCtrl.selectedItems.indexOf(item) !== -1;
      };
      
      scope.toggleRow = function (item, event) {
        event.stopPropagation();
        
        if(isDisabled()) {
          return;
        }
        
        if(scope.isSelected(item)) {
          tableCtrl.selectedItems.splice(tableCtrl.selectedItems.indexOf(item), 1);
        } else {
          tableCtrl.selectedItems.push(item);
        }
      };
    }
    
    tableCtrl.columns.forEach(function (column, index) {
      if(column.isNumeric) {
        var cell = element.children().eq(index);
        
        cell.addClass('numeric');
        
        if(angular.isDefined(cell.attr('show-unit'))) {
          $timeout(function () {
            cell.text(cell.text() + tableCtrl.columns[index].unit);
          });
        }
      }
    });
  }
  
  return {
    link: postLink,
    require: '^^mdDataTable'
  };
}])

.directive('mdTableRepeat', ['$mdTable', function ($mdTable) {
  'use strict';
  
  function compile(tElement, tAttrs) {
    var item = $mdTable.parse(tAttrs.ngRepeat).item;
    var checkbox = angular.element('<md-checkbox></md-checkbox>');
    
    checkbox.attr('aria-label', 'Select Row');
    checkbox.attr('ng-click', 'toggleRow(' + item + ', $event)');
    checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': isSelected(' + item + ')}]');
    
    if(tElement.parent().attr('md-disable-select')) {
      checkbox.attr('ng-disabled', tElement.parent().attr('md-disable-select'));
    }
    
    tElement.prepend(angular.element('<td></td>').append(checkbox));
    
    if(angular.isDefined(tElement.parent().attr('md-auto-select'))) {
      tAttrs.$set('ngClick', 'toggleRow(' + item + ', $event)');
    }
    
    tAttrs.$set('ngClass', '{\'md-selected\': isSelected(' + item + ')}');
  }
  
  return {
    compile: compile,
    priority: 1001
  };
}]);