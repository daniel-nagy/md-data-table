angular.module('md.data.table').controller('mdDataTableController', ['$attrs', '$element', '$q', '$scope', '$timeout', function ($attrs, $element, $q, $scope, $timeout) {
  'use strict';
  
  var self = this;
  
  if($attrs.mdRowSelect) {
    self.selectedItems = angular.isArray($scope.selectedItems) ? $scope.selectedItems : [];
    
    // log warning for developer
    if(!angular.isArray($scope.selectedItems)) {
      console.warn('md-row-select="' + $attrs.mdRowSelect + '" : ' +
      $attrs.mdRowSelect + ' is not defined as an array in your controller, ' +
      'i.e. ' + $attrs.mdRowSelect + ' = [], two-way data binding will fail.');
    }
  }
  
  self.columns = [];
  self.classes = [];
  
  // support theming
  ['md-primary', 'md-hue-1', 'md-hue-2', 'md-hue-3'].forEach(function(mdClass) {
    if($element.hasClass(mdClass)) {
      self.classes.push(mdClass);
    }
  });
  
  self.defer = function () {
    if(self.deferred) {
      self.deferred.reject('cancel');
    } else {
      self.showProgress();
    }
    
    self.deferred = $q.defer();
    self.deferred.promise.then(self.resolve);
    
    return self.deferred;
  };
  
  self.resolve = function () {
    self.deferred = undefined;
    self.hideProgress();
  };
  
  self.ready = function (items) {
    if(!self.listener && $attrs.mdRowSelect) {
      self.listener = $scope.$parent.$watch(items, function (newValue, oldeValue) {
        if(newValue !== oldeValue) {
          self.selectedItems.splice(0);
        }
      });
    }
  };

  self.setColumns = function (cell) {
    if(!cell.attributes.numeric) {
      return self.columns.push({ isNumeric: false });
    }
    
    self.columns.push({
      isNumeric: true,
      unit: cell.attributes.unit ? cell.attributes.unit.value : undefined,
      precision: cell.attributes.precision ? cell.attributes.precision.value : undefined
    });
  };
  
  self.addNumericCell = function (cell, index) {
    cell.addClass('numeric');
    
    if(self.columns[index].hasOwnProperty('precision')) {
      $timeout(function () {
        cell.text(parseFloat(cell.text()).toFixed(self.columns[index].precision));
      });
    }
    
    if(angular.isDefined(cell.showUnit)) {
      $timeout(function () {
        cell.text(cell.text() + self.columns[index].unit);
      });
    }
  };
  
  angular.forEach($element.find('th'), self.setColumns);
}]);