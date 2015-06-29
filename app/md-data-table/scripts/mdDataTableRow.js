angular.module('md.data.table')

.directive('mdTableRow', ['$timeout', function ($timeout) {
  'use strict';

  function postLink(scope, element, attrs, ctrl) {
    ctrl.columns.forEach(function (column, index) {
      if(column.isNumeric) {
        var cell = element.children().eq(index);
        
        cell.addClass('numeric');
        
        if(ctrl.columns[index].hasOwnProperty('precision')) {
          $timeout(function () {
            cell.text(parseFloat(cell.text()).toFixed(ctrl.columns[index].precision));
          });
        }
        
        if(angular.isDefined(cell.showUnit)) {
          $timeout(function () {
            cell.text(cell.text() + ctrl.columns[index].unit);
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
  
  function postLink(scope, element, attrs, ctrl) {
    if(scope.$last && !ctrl.listener) {
      ctrl.ready($mdTable.parse(attrs.ngRepeat).items);
    }
    
    scope.mdClasses = ctrl.classes;
    
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
      tAttrs.$set('ng-click', 'toggleRow(' + item + ', $event)');
    }
    
    tAttrs.$set('ng-class', '{\'md-selected\': isSelected(' + item + ')}');
    
    return postLink;
  }
  
  return {
    compile: compile,
    priority: 1001,
    require: '^^mdDataTable'
  };
}])