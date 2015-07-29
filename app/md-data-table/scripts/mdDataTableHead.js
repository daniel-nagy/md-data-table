angular.module('md.data.table').directive('mdTableHead', mdTableHead);

function mdTableHead($mdTable, $q) {
  'use strict';

  function postLink(scope, element, attrs, tableCtrl) {
    
    // table progress
    if(angular.isFunction(scope.trigger)) {
      scope.theadCtrl.pullTrigger = function () {
        var deferred = tableCtrl.defer();
        $q.when(scope.trigger(scope.theadCtrl.order))['finally'](deferred.resolve);
      };
    }
  }
  
  function compile(tElement) {
    tElement.find('th').attr('md-column-header', '');
    
    // enable row selection
    if(tElement.parent().attr('md-row-select')) {
      var ngRepeat = tElement.parent().find('tbody').find('tr').attr('ng-repeat');
      
      if(ngRepeat) {
        tElement.find('tr').prepend(angular.element('<th md-select-all="' + $mdTable.parse(ngRepeat).items + '"></th>'));
      }
    }
    
    tElement.after('<thead md-table-progress></thead>');
    
    return postLink;
  }
  
  return {
    bindToController: {
      order: '=mdOrder'
    },
    compile: compile,
    controller: function () {},
    controllerAs: 'theadCtrl',
    require: '^mdDataTable',
    scope: {
      trigger: '=mdTrigger'
    }
  };
}

mdTableHead.$inject = ['$mdTable', '$q'];