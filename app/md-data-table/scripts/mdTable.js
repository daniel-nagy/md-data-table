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
    
    function queuePromise(promise) {
      if(!promise) {
        return;
      }
      
      if(self.queue.push(angular.isArray(promise) ? $q.all(promise) : $q.when(promise)) === 1) {
        resolvePromises();
      }
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
    
    self.getElement = function () {
      return $element;
    };
    
    self.getBody = function () {
      return $element.find('tbody');
    };
    
    self.selectionEnabled = function () {
      return self.enableSelection;
    };
    
    $scope.$watch(enableSelection, function (enable) {
      return enable ? $element.addClass('md-row-select') : $element.removeClass('md-row-select');
    });
    
    if($attrs.hasOwnProperty('mdProgress')) {
      $scope.$watch('$mdTable.progress', queuePromise);
    }
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