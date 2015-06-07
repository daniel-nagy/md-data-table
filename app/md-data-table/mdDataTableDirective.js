angular.module('md.data.table')

.directive('mdDataTable', ['$mdTableRepeat', '$timeout', function ($mdTableRepeat, $timeout) {
  'use strict';
  
  function postLink(scope, element, attrs, controller) {
    var head, body, columns = [];
    
    function column(index, callback) {
      angular.forEach(body.rows, function(row) {
        callback(row.children[index]);
      });
    }
    
    function isCheckbox(cell) {
      return (attrs.hasOwnProperty('mdRowSelect') && cell === 0);
    }
    
    function addNumericColumn(cell, index) {
      if(isCheckbox(index) || !cell.attributes.numeric) {
        return columns.push({ isNumeric: false });
      }
      
      cell.style.textAlign = 'right';
      
      columns.push({
        isNumeric: true,
        unit: cell.attributes.unit ? cell.attributes.unit.value : undefined,
        precision: cell.attributes.precision ? cell.attributes.precision.value : undefined
      });
      
      if(columns[index].unit) {
        cell.innerHTML += ' ' + '(' + columns[index].unit + ')';
      }
    }
    
    function trimColumnNames() {
      head.children().addClass('trim animate');
      
      // cross browser text overflow ellipsis
      angular.forEach(head.children(), function (cell, index) {
        if(isCheckbox(index)) {
          return;
        }
        cell.innerHTML = '<div>' + cell.innerHTML + '</div>';
      });
      
      // enforce a minimum width of 100px per column
      element.css({
        'min-width': 100 * head.children().length + 'px',
        'table-layout': 'fixed'
      });
    }
    
    function once() {
      head = element.find('thead').find('tr');
      
      angular.forEach(head.children(), addNumericColumn);
      
      if(attrs.hasOwnProperty('trimColumnNames')) {
        trimColumnNames();
      }
    }
    
    controller.ready = function() {
      body = { rows: element.find('tbody').find('tr') };
      
      if(!head) {
        this.setFilter(body.rows);
        once();
      }
      
      $timeout(function () {
        angular.forEach(head.children(), function (cell, index) {
          if(isCheckbox(index)) {
            return;
          }
          
          if(columns[index].isNumeric) {
            column(index, function (cell) {
              cell.style.textAlign = 'right';
              cell.innerHTML = parseInt(cell.innerHTML).toFixed(columns[index].precision);
              
              if(cell.attributes.hasOwnProperty('show-unit')) {
                cell.innerHTML += columns[index].unit;
              }
            });
          }
        });
      });
    };
  }
  
  function compile(iElement, iAttrs) {
    var head = iElement.find('thead');
    var body = iElement.find('tbody');
    
    if(!head.length) {
      // see if we can add the element
      head = iElement.find('tbody').eq(0);
      
      if(head.children().find('th').length) {
        head.replaceWith('<thead>' + head.html() + '</thead>');
      } else {
        throw new Error('mdDataTable', 'Expecting <thead></thead> element.');
      }
      
      head = iElement.find('thead');
      body = iElement.find('tbody');
    }
    
    head = head.attr('md-table-head', '').find('tr');
    body = body.attr('md-table-body', '').find('tr');
    
    if(!body.attr('ng-repeat')) {
      // log rudimentary warnings for the developer
      if(iAttrs.hasOwnProperty('mdRowSelect')) {
        return console.warn('Use ngRepeat to enable automatic row selection.');
      }
      if(iAttrs.hasOwnProperty('mdColumnSort')) {
        if(!iAttrs.mdFilter) {
          console.warn('Use ngRepeat to enable automatic column sorting.');
        } else {
          console.warn('Manual sorting may be difficult without ngRepeat.');
        }
      }
    } else {
      var repeat = $mdTableRepeat.parse(body.attr('ng-repeat'));
      
      if(iAttrs.hasOwnProperty('mdRowSelect')) {
        head.checkbox = angular.element('<md-checkbox></md-checkbox>');
        body.checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        head.checkbox.attr('aria-label', 'Select All');
        head.checkbox.attr('ng-click', 'toggleAll(' + repeat.items + ')');
        head.checkbox.attr('ng-class', '{\'md-checked\': allSelected(' + repeat.items + ')}');
        
        body.checkbox.attr('aria-label', 'Select Row');
        body.checkbox.attr('ng-click', 'toggleRow(' + repeat.item + ')');
        body.checkbox.attr('ng-class', '{\'md-checked\': isSelected(' + repeat.item + ')}');
        
        head.prepend(angular.element('<th></th>').append(head.checkbox));
        body.prepend(angular.element('<td></td>').append(body.checkbox));
      }
      
      if(iAttrs.hasOwnProperty('mdColumnSort')) {
        if(!head.attr('md-filter') && !repeat.orderBy) {
          body.attr('ng-repeat', repeat.insertOrderBy('order'));
        }
      }
      
      body.attr('md-table-repeat', '');
    }
    
    return postLink;
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
}]);