angular.module('md.data.table').directive('mdSelectAll', mdSelectAll);

function mdSelectAll() {
  'use strict';
  
  function template(tElement) {
    var checkbox = angular.element('<md-checkbox></md-checkbox>');
    
    checkbox.attr('aria-label', 'Select All');
    checkbox.attr('ng-click', 'toggleAll()');
    checkbox.attr('ng-class', 'mdClasses');
    checkbox.attr('ng-checked', 'allSelected()');
    checkbox.attr('ng-disabled', '!getCount()');
    
    tElement.append(checkbox);
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    var count = 0;
    
    var getSelectableItems = function() {
      return scope.items.filter(function (item) {
        return !tableCtrl.isDisabled(item);
      });
    };
    
    tableCtrl.isReady.body.promise.then(function () {
      scope.mdClasses = tableCtrl.classes;
      
      scope.getCount = function() {
        return (count = scope.items.reduce(function(sum, item) {
          return tableCtrl.isDisabled(item) ? sum : ++sum;
        }, 0));
      };
      
      scope.allSelected = function () {
        return count && count === tableCtrl.selectedItems.length;
      };
      
      scope.toggleAll = function () {
        var selectableItems = getSelectableItems(scope.items);
        
        if(selectableItems.length === tableCtrl.selectedItems.length) {
          tableCtrl.selectedItems.splice(0);
        } else {
          tableCtrl.selectedItems = selectableItems;
        }
      };
    });
  }
  
  return {
    link: postLink,
    require: '^^mdDataTable',
    scope: {
      items: '=mdSelectAll'
    },
    template: template
  };
}
