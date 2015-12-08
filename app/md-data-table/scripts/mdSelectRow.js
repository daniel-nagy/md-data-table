angular.module('md.data.table').directive('mdSelectRow', mdSelectRow);

function mdSelectRow($mdTable) {
  'use strict';
  
  function template(tElement, tAttrs) {
    var ngRepeat = $mdTable.parse(tAttrs.ngRepeat);
    var checkbox = angular.element('<md-checkbox></md-checkbox>');
    
    checkbox.attr('aria-label', 'Select Row');
    checkbox.attr('ng-click', 'toggleRow(' + ngRepeat.item + ', $event)');
    checkbox.attr('ng-class', 'mdClasses');
    checkbox.attr('ng-checked', 'isSelected(' + ngRepeat.item + ')');
    
    if(tAttrs.mdDisableSelect) {
      checkbox.attr('ng-disabled', 'isDisabled()');
    }
    
    tElement.prepend(angular.element('<td></td>').append(checkbox));
    
    if(angular.isDefined(tAttrs.mdAutoSelect)) {
      tAttrs.$set('ngClick', 'toggleRow(' + ngRepeat.item + ', $event)');
    }
    
    var originalNgClass = tAttrs.ngClass;
    if (originalNgClass) {
      var openingBracket = originalNgClass.indexOf('{');
      var newNgClass = originalNgClass.substring(0,openingBracket+1) +
        '\'md-selected\': isSelected(' + ngRepeat.item + '), ' +
        originalNgClass.substring(openingBracket+1);
      tAttrs.$set('ngClass', newNgClass);
    } else {
      tAttrs.$set('ngClass', '{\'md-selected\': isSelected(' + ngRepeat.item + ')}');
    }
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
