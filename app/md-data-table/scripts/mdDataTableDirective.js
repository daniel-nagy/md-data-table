angular.module('md.data.table').directive('mdDataTable', function () {
  'use strict';
  
  function compile(tElement, tAttrs) {
    var head = tElement.find('thead');
    var body = tElement.find('tbody');
    var foot = tElement.find('tfoot');
    
    // make sure the table has a head element
    if(!head.length) {
      head = tElement.find('tbody').eq(0);
      
      if(head.children().find('th').length) {
        head.replaceWith('<thead>' + head.html() + '</thead>');
      } else {
        throw new Error('mdDataTable', 'Expecting <thead></thead> element.');
      }
      
      head = tElement.find('thead');
      body = tElement.find('tbody');
    }
    
    // notify the children to begin work
    head.attr('md-table-head', '');
    body.attr('md-table-body', '');
    
    if(foot.length) {
      foot.attr('md-table-foot', '');
      
      if(tAttrs.mdRowSelect) {
        foot.find('tr').prepend('<td></td>');
      }
    }
    
    // log rudimentary warnings for the developer
    if(!body.children().attr('ng-repeat')) {
      if(tAttrs.mdRowSelect) {
        console.warn('Use ngRepeat to enable automatic row selection.');
      }
      if(head.attr('md-order')) {
        console.warn('Column ordering without ngRepeat is not supported by this directive.');
      }
    }
  }
  
  return {
    restrict: 'A',
    scope: {
      filter: '=mdFilter',
      selectedItems: '=mdRowSelect'
    },
    compile: compile,
    controller: 'mdDataTableController'
  };
});