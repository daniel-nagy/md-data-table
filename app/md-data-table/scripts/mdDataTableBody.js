angular.module('md.data.table').directive('mdTableBody', ['$interpolate', function ($interpolate) {
  'use strict';
  
  function postLink(scope, element, attrs, tableCtrl) {
    
    // row selection
    if(element.parent().attr('md-row-select')) {
      
      tableCtrl.repeatEnd.push(function (ngRepeat) {
        var isDisabled = $interpolate('{{' + attrs.mdDisableSelect + '}}');
        var model = {};
        
        var getSelectableItems = function(items) {
          return items.filter(function (item) {
            model[ngRepeat.item] = item;
            return isDisabled(model) !== 'true';
          });
        };
        
        scope.getCount = function(items) {
          return items.reduce(function(sum, item) {
            model[ngRepeat.item] = item;
            return isDisabled(model) !== 'true' ? ++sum : sum;
          }, 0);
        };
        
        scope.allSelected = function (items) {
          var count = scope.getCount(items);
          return count && count === tableCtrl.selectedItems.length;
        };
        
        scope.toggleAll = function (items) {
          var selectableItems = getSelectableItems(items);
          
          if(selectableItems.length === 0) {
            return;
          }
          
          if(selectableItems.length === tableCtrl.selectedItems.length) {
            tableCtrl.selectedItems.splice(0);
          } else {
            tableCtrl.selectedItems = selectableItems;
          }
        };
      });
    }
  }
  
  function compile(tElement) {
    tElement.find('tr').attr('md-table-row', '');
    
    if(tElement.find('tr').attr('ng-repeat') && tElement.parent().attr('md-row-select')) {
      tElement.find('tr').attr('md-table-repeat', '');
    }
    
    return postLink;
  }

  return {
    compile: compile,
    require: '^mdDataTable'
  };
}]);