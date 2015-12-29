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
    
    function hasKeys(rows) {
      return rows.some(function(row) {
        return Array.prototype.some.call(row.attributes, function (attr) {
          return $attrs.$normalize(attr.name) === 'mdSelectId';
        });
      });
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
    
    function rows() {
      return $element.prop('rows').length;
    };
    
    function rowSelect() {
      if($attrs.hasOwnProperty('mdRowSelect') && $attrs.mdRowSelect === '') {
        return true;
      }
      
      return self.rowSelect;
    }
    
    function validate() {
      return validateModel() && (angular.isArray(self.selected) ? validateArray() : validateObject());
    }
    
    function validateArray() {
      var rows = self.getBodyRows();
      
      if(rows.length && hasKeys(rows)) {
        return console.error('IDs will not work with arrays. Please use an object instead.');
      }
      
      return true;
    }
    
    function validateModel() {
      if(!self.selected) {
        return console.error('Row selection model is undefined.');
      }
      
      if(!angular.isObject(self.selected)) {
        return console.error('Row selection model is an invalid type.');
      }
      
      return true;
    }
    
    function validateObject() {
      var rows = self.getBodyRows();
      
      if(rows.length && !hasKeys(rows)) {
        return console.error('Please use an array if you are not using IDs.');
      }
      
      return true;
    }
    
    self.columnCount = function () {
      return Array.prototype.reduce.call($element.prop('rows'), function (columns, row) {
        if(!row.classList.contains('md-row') || row.classList.contains('ng-leave')) {
          return columns;
        }
        
        return row.cells.length > columns ? row.cells.length : columns;
      }, 0);
    };
    
    self.getRows = function (collection) {
      return Array.prototype.reduce.call(collection, function (result, group) {
        return result.concat(Array.prototype.filter.call(group.rows, function (row) {
          return !row.classList.contains('ng-leave');
        }));
      }, []);
    };
    
    self.getBodyRows = function () {
      return self.getRows($element.prop('tBodies'));
    };
    
    self.getElement = function () {
      return $element;
    };
    
    self.queuePromise = function (promise) {
      if(!promise) {
        return;
      }
      
      if(self.queue.push(angular.isArray(promise) ? $q.all(promise) : $q.when(promise)) === 1) {
        resolvePromises();
      }
    };
    
    $scope.$watchGroup([rowSelect, rows], function (enable) {
      self.selectEnabled = enable[0] && !!validate();
      
      if(self.selectEnabled) {
        $element.addClass('md-row-select');
      } else {
        $element.removeClass('md-row-select');
      }
    });
    
    if($attrs.hasOwnProperty('mdProgress')) {
      $scope.$watch('$mdTable.progress', self.queuePromise);
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