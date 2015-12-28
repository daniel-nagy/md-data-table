'use strict';

angular.module('md.data.table').directive('mdTable', mdTable);

function mdTable() {
  
  function compile(tElement, tAttrs) {
    tElement.addClass('md-table');
    
    if(tAttrs.hasOwnProperty('mdProgress')) {
      var body = tElement.find('tbody').eq(0)[0];
      var progress = angular.element('<thead class="md-table-progress">');
      
      if(body) {
        tElement[0].insertBefore(progress[0], body);
      }
    }
  }
  
  function Controller($attrs, $element, $q, $scope) {
    var self = this;
    
    self.keys = {};
    self.queue = [];
    self.columns = {};
    
    function enableSelection() {
      var enable;
      
      if($attrs.hasOwnProperty('mdRowSelect') && $attrs.mdRowSelect === '') {
        enable = true;
      } else {
        enable = self.rowSelect;
      }
      
      if(enable && !self.selected) {
        enable = false;
        console.error('Missing model for row selection');
      } else if(enable && !angular.isArray(self.selected)) {
        enable = false;
        console.error('Model for row selection is not an array');
      }
      
      self.enableSelection = enable;
      
      return enable;
    }
    
    function resolvePromises() {
      if(!self.queue.length) {
        return;
      }
      
      self.queue[0].then(function () {
        self.queue.shift();
        resolvePromises();
      });
    }
    
    self.columnCount = function () {
      return Array.prototype.reduce.call($element.prop('rows'), function (columns, row) {
        if(!row.classList.contains('md-row') || row.classList.contains('ng-leave')) {
          return columns;
        }
        
        return row.cells.length > columns ? row.cells.length : columns;
      }, 0);
    };
    
    self.deselectAll = function () {
      this.keys = {};
      this.selected = [];
    };
    
    self.deselect = function (item, key) {
      self.selected.splice(self.getIndex(), 1);
      
      if(key && self.keys.hasOwnProperty(key)) {
        delete this.keys[key];
      }
    };
    
    self.getBody = function () {
      return $element.find('tbody');
    };
    
    self.getElement = function () {
      return $element;
    };
    
    self.getIndex = function (item, key) {
      return self.selected.indexOf(key && self.keys.hasOwnProperty(key) ? self.keys[key] : item);
    };
    
    self.queuePromise = function (promise) {
      if(!promise) {
        return;
      }
      
      if(self.queue.push(angular.isArray(promise) ? $q.all(promise) : $q.when(promise)) === 1) {
        resolvePromises();
      }
    };
    
    self.selectionEnabled = function () {
      return self.enableSelection;
    };
    
    $scope.$watch(enableSelection, function (enable) {
      return enable ? $element.addClass('md-row-select') : $element.removeClass('md-row-select');
    });
    
    if($attrs.hasOwnProperty('mdProgress')) {
      $scope.$watch('$mdTable.progress', self.queuePromise);
    }
    
    $scope.$on('md.table.deselect', function (event, item, key) {
      if(!item && !key) {
        return self.deselectAll();
      }
      
      self.deselect(item, key);
    });
  }
  
  Controller.$inject = ['$attrs', '$element', '$q', '$scope'];
  
  return {
    bindToController: true,
    compile: compile,
    controller: Controller,
    controllerAs: '$mdTable',
    restrict: 'A',
    scope: {
      progress: '=?mdProgress',
      selected: '=ngModel',
      rowSelect: '=mdRowSelect'
    }
  };
}