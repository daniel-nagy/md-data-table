angular.module('md.data.table')

.controller('mdDataTableController', ['$attrs', '$element', '$parse', '$scope', function ($attrs, $element, $parse, $scope) {
  'use strict';
  
  var self = this;
  
  self.selectedItems = [];
  self.columns = [];
  self.classes = [];
  
  // support theming
  ['md-primary', 'md-hue-1', 'md-hue-2', 'md-hue-3'].forEach(function(mdClass) {
    if($element.hasClass(mdClass)) {
      self.classes.push(mdClass);
    }
  });
  
  if($attrs.mdRowSelect) {
    $parse($attrs.mdRowSelect).assign($scope.$parent.$parent, self.selectedItems);
  }
  
  if($attrs.mdFilter) {
    self.filter = $scope.filter;
  }
  
  self.column = function (index, callback) {
    angular.forEach($element.find('tbody').find('tr'), function(row) {
      callback(row.children[index]);
    });
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
  
  angular.forEach($element.find('th'), self.setColumns);

}]);