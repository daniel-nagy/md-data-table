angular.module('md.data.table').directive('mdTableFoot', function () {
  'use strict';

  function postLink(scope, element, attrs, ctrl) {
    var cells = element.find('td');
    
    ctrl.columns.forEach(function(column, index) {
      if(column.isNumeric) {
        cells.eq(index).addClass('numeric');
      }
    });
    
    if(cells.length < ctrl.columns.length) {
      element.find('tr').append('<td colspan="' + (ctrl.columns.length - cells.length) + '"></td>');
    }
  }
  
  return {
    require: '^mdDataTable',
    link: postLink
  };
});