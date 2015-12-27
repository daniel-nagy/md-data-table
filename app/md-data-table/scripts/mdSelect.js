'use strict';

angular.module('md.data.table').directive('mdSelect', mdSelect);

function mdSelect($compile) {
  
  // empty controller to be bind scope properties to
  function Controller() {
    
  }
  
  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls.shift();
    var selectCtrl = ctrls.shift();
    
    selectCtrl.isSelected = function () {
      if(!tableCtrl.selectionEnabled()) {
        return false;
      }
      
      if(selectCtrl.id) {
        return tableCtrl.keys.hasOwnProperty(selectCtrl.id);
      }
      
      return tableCtrl.selected.indexOf(selectCtrl.model) !== -1;
    };
    
    selectCtrl.select = function () {
      if(selectCtrl.disabled) {
        return;
      }
      
      tableCtrl.selected.push(selectCtrl.model);
      
      if(selectCtrl.id) {
        tableCtrl.keys[selectCtrl.id] = selectCtrl.id;
      }
      
      if(angular.isFunction(selectCtrl.onSelect)) {
        selectCtrl.onSelect(selectCtrl.model, selectCtrl.id);
      }
    };
    
    selectCtrl.deselect = function () {
      tableCtrl.selected.splice(getIndex(selectCtrl.id), 1);
      
      if(selectCtrl.id) {
        delete tableCtrl.keys[selectCtrl.id];
      }
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
    
    function createCheckbox() {
      var checkbox = angular.element('<md-checkbox>');
      
      checkbox.attr('aria-label', 'Select Row');
      checkbox.attr('ng-click', '$mdSelect.toggle($event)');
      checkbox.attr('ng-checked', '$mdSelect.isSelected()');
      checkbox.attr('ng-disabled', '$mdSelect.disabled');
      
      return angular.element('<td class="md-cell">').append($compile(checkbox)(scope));
    }
    
    function disableSelection() {
      removeCheckbox();
      element.off('click', autoSelect);
    }
    
    function enableAutoSelect() {
      if(attrs.hasOwnProperty('mdAutoSelect') && attrs.mdAutoSelect === '') {
        return true;
      }
      
      return selectCtrl.autoSelect;
    }
    
    function enableSelection() {
      attachCheckbox();
      
      if(enableAutoSelect()) {
        element.on('click', autoSelect);
      }
    }
    
    function getIndex(id) {
      return tableCtrl.selected.indexOf(id ? tableCtrl.keys[id] : selectCtrl.model);
    }
    
    function removeCheckbox() {
      element.find('md-checkbox').parent().remove();
    }
    
    scope.$watch(tableCtrl.selectionEnabled, function (enabled) {
      if(enabled) {
        enableSelection();
      } else {
        disableSelection();
      }
    });
    
    scope.$watch(enableAutoSelect, function (newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      
      if(tableCtrl.selectionEnabled() && newValue) {
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
      id: '@mdSelectId',
      model: '=mdSelect',
      disabled: '=ngDisabled',
      onSelect: '=?mdOnSelect',
      autoSelect: '=mdAutoSelect'
    }
  };
}

mdSelect.$inject = ['$compile'];