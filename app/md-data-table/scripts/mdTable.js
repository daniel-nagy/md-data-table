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
      return $element.find('tbody').eq(0).find('tr').eq(0).find('td').length;
    };
    
    self.enableSelection = function () {
      if($attrs.hasOwnProperty('mdRowSelect') && $attrs.mdRowSelect === '') {
        return true;
      }
      
      return self.rowSelect;
    };
    
    self.getElement = function () {
      return $element;
    };
    
    self.getBody = function () {
      return $element.find('tbody');
    };
    
    $scope.$watch(self.enableSelection, function (enable) {
      return enable ? $element.addClass('md-row-select') : $element.removeClass('md-row-select');
    });
    
    if($attrs.hasOwnProperty('mdProgress')) {
      $scope.$watch('$mdTable.progress', function (promise) {
        if(promise && self.queue.push($q.when(promise)) === 1) {
          resolvePromises();
        }
      });
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