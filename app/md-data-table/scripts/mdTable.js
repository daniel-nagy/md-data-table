'use strict';

angular.module('md.data.table').directive('mdTable', mdTable);
  
function mdTable() {
  
  function Controller($scope, $element, $attrs) {
    var self = this;
    
    self.columns = {};
    
    self.enableSelection = function () {
      if($attrs.hasOwnProperty('mdRowSelect') && $attrs.mdRowSelect === '') {
        return true;
      }
      
      return self.rowSelect;
    };
    
    self.getElement = function () {
      return $element;
    };
    
    // self.column = function (index, callback) {
    //   var rows = $element.find('md-row');
    //
    //   for(var i = 0; i < rows.length; i++) {
    //     callback(rows.eq(i).children().eq(index));
    //   }
    // };
    
    $scope.$watch(self.enableSelection, function (enable) {
      return enable ? $element.addClass('md-row-select') : $element.removeClass('md-row-select');
    });
  }
  
  Controller.$inject = ['$scope', '$element', '$attrs'];
  
  return {
    bindToController: true,
    controller: Controller,
    controllerAs: '$mdTable',
    restrict: 'E',
    scope: {
      selected: '=ngModel',
      rowSelect: '=mdRowSelect'
    }
  };
}