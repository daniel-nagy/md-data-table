angular.module('md.data.table').directive('mdDataTable', function () {
  'use strict';
  
  function compile(iElement, iAttrs) {
    var head = iElement.find('thead');
    var body = iElement.find('tbody');
    
    // make sure the table has a head element
    if(!head.length) {
      head = iElement.find('tbody').eq(0);
      
      if(head.children().find('th').length) {
        head.replaceWith('<thead>' + head.html() + '</thead>');
      } else {
        throw new Error('mdDataTable', 'Expecting <thead></thead> element.');
      }
      
      head = iElement.find('thead');
      body = iElement.find('tbody');
    }
    
    // notify the head and the body to begin work
    head.attr('md-table-head', '');
    body.attr('md-table-body', '');
    
    // log rudimentary warnings for the developer
    if(!body.children().attr('ng-repeat')) {
      if(iAttrs.hasOwnProperty('mdRowSelect')) {
        return console.warn('Use ngRepeat to enable automatic row selection.');
      }
      if(head.attr('md-filter')) {
        console.warn('Manual sorting may be difficult without ngRepeat.');
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