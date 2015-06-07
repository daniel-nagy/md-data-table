angular.module('md.data.table')

.directive('mdTableHead', ['$compile', '$mdTableRepeat', '$parse', function ($compile, $mdTableRepeat, $parse) {
  'use strict';

  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      var order;
      
      function setOrderBy(cell, index) {
        if(element.parent().attr('md-row-select') && index === 0) {
          return;
        }
        
        var orderBy = cell.attributes['order-by'] || {
          value: cell.textContent.toLowerCase()
        };
        
        cell.setAttribute('order-by', orderBy.value);
        cell.setAttribute('ng-class', '{\'md-active\': isActive(\'' + orderBy.value + '\')}');
        cell.setAttribute('ng-click', 'orderBy(\'' + orderBy.value + '\')');
        
        $compile(cell)(scope);
      }
      
      function autoSort(body) {
        order = $parse($mdTableRepeat.parse(body.attr('ng-repeat')).orderBy);
        
        scope.isActive = function (prop) {
          return order(scope) === prop || order(scope) === '-' + prop;
        };
        
        scope.orderBy = function (prop) {
          order.assign(scope, order(scope) === prop ? '-' + prop : prop);
        };
      }
      
      function manualSort() {
        scope.isActive = function (prop) {
          return order === prop || order === '-' + prop;
        };
        
        scope.orderBy = function (prop) {
          ctrl.selectedItems.splice(0);
          scope.filter(order = order === prop ? '-' + prop : prop);
        };
      }
      
      ctrl.setFilter = function (body) {
        if(element.parent().attr('md-column-sort') !== undefined) {
          angular.forEach(element.find('tr').children(), setOrderBy);
          
          if(element.parent().attr('md-filter')) {
            manualSort();
          } else {
            autoSort(body);
          }
        }
      };
      
      scope.allSelected = function (items) {
        return items ? items.length === ctrl.selectedItems.length : false;
      };
      
      scope.toggleAll = function (items) {
        if(scope.allSelected(items)) {
          ctrl.selectedItems.splice(0);
        } else {
          angular.forEach(items, function (item) {
            if(ctrl.selectedItems.indexOf(item) === -1) {
              ctrl.selectedItems.push(item);
            }
          });
        }
      };
    }
  };
}]);