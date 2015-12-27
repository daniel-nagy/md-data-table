'use strict';

angular.module('md.data.table').directive('mdSelect', mdSelect);

function mdSelect($compile) {
  
  function Controller() {
    
  }
  
  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls.shift();
    var selectCtrl = ctrls.shift();
    
    selectCtrl.isSelected = function () {
      return selectCtrl.isEnabled && tableCtrl.selected.indexOf(selectCtrl.model) !== -1;
    };
    
    selectCtrl.select = function () {
      if(selectCtrl.disabled) {
        return;
      }
      
      tableCtrl.selected.push(selectCtrl.model);
      
      if(angular.isFunction(selectCtrl.onSelect)) {
        selectCtrl.onSelect(selectCtrl.model, tableCtrl.selected);
      }
    };
    
    selectCtrl.deselect = function () {
      tableCtrl.selected.splice(tableCtrl.selected.indexOf(selectCtrl.model), 1);
    };
    
    selectCtrl.toggle = function (event) {
      if(event && event.stopPropagation) {
        event.stopPropagation();
      }
      
      return selectCtrl.isSelected() ? selectCtrl.deselect() : selectCtrl.select();
    };
    
    function attachCheckbox() {
      element.prepend(createCheckbox());
    }
    
    function autoSelect(event) {
      scope.$applyAsync(function () {
        selectCtrl.toggle(event);
      });
    }
    
    function enableAutoSelect() {
      if(attrs.hasOwnProperty('mdAutoSelect') && attrs.mdAutoSelect === '') {
        return true;
      }
      
      return selectCtrl.autoSelect;
    }
    
    function disableSelection () {
      removeCheckbox();
      element.off('click', autoSelect);
    }
    
    function enableSelection() {
      attachCheckbox();
      
      if(enableAutoSelect()) {
        element.on('click', autoSelect);
      }
    }
    
    function createCheckbox() {
      var checkbox = angular.element('<md-checkbox>');
      
      checkbox.attr('aria-label', 'Select Row');
      checkbox.attr('ng-click', '$mdSelect.toggle($event)');
      checkbox.attr('ng-checked', '$mdSelect.isSelected()');
      checkbox.attr('ng-disabled', '$mdSelect.disabled');
      
      return angular.element('<td class="md-cell">').append($compile(checkbox)(scope));
    }
    
    function removeCheckbox() {
      element.find('md-checkbox').parent().remove();
    }
    
    scope.$watch(tableCtrl.enableSelection, function (enable) {
      selectCtrl.isEnabled = enable;
      
      if(selectCtrl.isEnabled) {
        enableSelection();
      } else {
        disableSelection();
      }
    });
    
    scope.$watch(enableAutoSelect, function (newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      
      if(selectCtrl.isEnabled && newValue) {
        element.on('click', autoSelect);
      } else {
        element.off('click', autoSelect);
      }
    });
    
    scope.$watch(selectCtrl.isSelected, function (selected) {
      return selected ? element.addClass('md-selected') : element.removeClass('md-selected');
    });
  }
  
  return {
    bindToController: true,
    controller: Controller,
    controllerAs: '$mdSelect',
    link: postLink,
    require: ['^^mdTable', 'mdSelect'],
    restrict: 'A',
    scope: {
      model: '=mdSelect',
      disabled: '=ngDisabled',
      onSelect: '=?mdOnSelect',
      autoSelect: '=mdAutoSelect'
    }
  };
}

mdSelect.$inject = ['$compile'];