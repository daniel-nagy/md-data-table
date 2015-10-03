angular.module('md.data.table').directive('mdTableHead', mdTableHead);

function mdTableHead($mdTable, $q) {
  'use strict';

  function compile(tElement) {
    tElement.find('th').attr('md-column-header', '');
    
    // enable row selection
    if(tElement.parent().attr('md-row-select')) {
      var ngRepeat = $mdTable.getAttr(tElement.parent().find('tbody').find('tr'), 'ngRepeat');
      
      if(ngRepeat) {
        tElement.find('tr').prepend(angular.element('<th md-select-all="' + $mdTable.parse(ngRepeat).items + '"></th>'));
      }
    }
    
    tElement.after('<thead md-table-progress></thead>');
    
    return postLink;
  }
  
  function Controller($element, $scope) {
    var rows = $element.find('tr');
    
    if(!$scope.sigRow || parseInt($scope.sigRow, 10) === isNaN() || $scope.sigRow < 0) {
      $scope.sigRow = rows.length - 1;
    }
    
    // when tables headers have multiple rows we need a significant row
    // to append the checkbox to and to controll the text alignment for
    // numeric columns
    this.isSignificant = function (row) {
      return row.prop('rowIndex') === $scope.sigRow;
    };
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    var controller = element.data('$mdTableHeadController');
    
    // table progress
    if(angular.isFunction(scope.trigger)) {
      controller.pullTrigger = function () {
        var deferred = tableCtrl.defer();
        $q.when(scope.trigger(controller.order))['finally'](deferred.resolve);
      };
    }
  }
  
  Controller.$inject = ['$element', '$scope'];
  
  return {
    bindToController: {
      order: '=mdOrder'
    },
    compile: compile,
    controller: Controller,
    controllerAs: '$mdDataTableHeadCtrl',
    require: '^mdDataTable',
    scope: {
      trigger: '=?mdTrigger',
      sigRow: '=?'
    }
  };
}

mdTableHead.$inject = ['$mdTable', '$q'];