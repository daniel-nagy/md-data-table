angular.module('md.data.table').directive('mdTableBody', function () {
  'use strict';
  
  function compile(tElement) {
    tElement.find('tr').attr('md-table-row', '');
    
    if(tElement.find('tr').attr('ng-repeat') && tElement.parent().attr('md-row-select')) {
      tElement.find('tr').attr('md-table-repeat', '');
    }
  }

  return {
    require: '^mdDataTable',
    compile: compile
  };
});