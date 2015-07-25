angular.module('md.data.table').directive('mdTableHead', mdTableHead);

function mdTableHead($mdTable, $q) {
  'use strict';

  function postLink(scope, element, attrs, tableCtrl) {
    
    // table progress
    if(angular.isFunction(scope.trigger)) {
      scope.headCtrl.pullTrigger = function () {
        var deferred = tableCtrl.defer();
        $q.when(scope.trigger(scope.headCtrl.order))['finally'](deferred.resolve);
      };
    }
  }
  
  function compile(tElement, tAttrs) {
    
    tElement.find('th').attr('md-column-header', '');
    
    // enable row selection
    if(tElement.parent().attr('md-row-select')) {
      var ngRepeat = tElement.parent().find('tbody').find('tr').attr('ng-repeat');
      
      if(ngRepeat) {
        var items = $mdTable.parse(ngRepeat).items;
        var checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        checkbox.attr('aria-label', 'Select All');
        checkbox.attr('ng-click', 'toggleAll(' + items + ')');
        checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': allSelected()}]');
        checkbox.attr('ng-disabled', '!getCount(' + items + ')');
        
        tElement.find('tr').prepend(angular.element('<th></th>').append(checkbox));
      }
    }
    
    tElement.after('<thead md-table-progress></thead>');
    
    return postLink;
  }
  
  return {
    bindToController: {
      order: '=mdOrder'
    },
    controller: function () {},
    controllerAs: 'headCtrl',
    require: '^mdDataTable',
    scope: {
      trigger: '=mdTrigger'
    },
    compile: compile
  };
}

mdTableHead.$inject = ['$mdTable', '$q'];