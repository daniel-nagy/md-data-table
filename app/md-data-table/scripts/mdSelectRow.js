angular.module('md.data.table').directive('mdSelectRow', mdSelectRow);

function mdSelectRow($mdTable) {
  'use strict';
  
  function template(tElement, tAttrs) {
    var item = $mdTable.parse(tAttrs.ngRepeat).item;
    var checkbox = angular.element('<md-checkbox></md-checkbox>');
    
    checkbox.attr('aria-label', 'Select Row');
    checkbox.attr('ng-click', 'toggleRow(' + item + ', $event)');
    checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': isSelected(' + item + ')}]');
    
    if(tAttrs.mdDisableSelect) {
      checkbox.attr('ng-disabled', 'isDisabled()');
    }
    
    tElement.prepend(angular.element('<td></td>').append(checkbox));
    
    if(angular.isDefined(tAttrs.mdAutoSelect)) {
      tAttrs.$set('ngClick', 'toggleRow(' + item + ', $event)');
    }
    
    tAttrs.$set('ngClass', '{\'md-selected\': isSelected(' + item + ')}');
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    var model = {};
    var ngRepeat = $mdTable.parse(attrs.ngRepeat);
    
    if(!angular.isFunction(scope.isDisabled)) {
      scope.isDisabled = function () { return false; };
    }
    
    tableCtrl.isDisabled = function (item) {
      model[ngRepeat.item] = item;
      return scope.isDisabled(model);
    };
  }
  
  return {
    link: postLink,
    priority: 1001,
    require: '^^mdDataTable',
    scope: {
      isDisabled: '&?mdDisableSelect'
    },
    template: template
  };
}

mdSelectRow.$inject = ['$mdTable'];