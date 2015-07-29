angular.module('md.data.table').directive('mdTableFoot', mdTableFoot);

function mdTableFoot() {
  'use strict';

  function postLink(scope, element, attrs, tableCtrl) {
    var cells = element.find('td');
    
    tableCtrl.columns.forEach(function(column, index) {
      if(column.isNumeric) {
        cells.eq(index).addClass('numeric');
      }
    });
    
    if(cells.length < tableCtrl.columns.length) {
      element.find('tr').append('<td colspan="' + (tableCtrl.columns.length - cells.length) + '"></td>');
    }
  }
  
  return {
    require: '^mdDataTable',
    link: postLink
  };
}