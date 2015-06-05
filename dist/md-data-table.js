angular.module('md.data.table', [])

.directive('mdDataTable', ['$compile', '$timeout', function ($compile, $timeout) {
  'use strict';
  
  function postLink(scope, element, attrs) {
    var head, body;
    
    scope.setOrder = function(prop) {
      scope.order = scope.order === prop ? '-' + prop : prop;
    }
    
    scope.isActive = function(prop) {
      return scope.order === prop || scope.order === '-' + prop;
    }
    
    function createCheckbox(label, model) {
      return $compile(angular.element('<md-checkbox></md-checkbox>')
        .attr('aria-label', label)
        .attr('ng-click', '$event.stopPropagation()')
        .attr('ng-model', model))(scope);
    }
    
    function toggleRow(row, value) {
      scope.select[row.id] = value !== undefined ? value : !scope.select[row.id];
    }
    
    function Header() {
      this.row = element.find('thead').find('tr');
      
      this.toggleAll = function () {
        angular.forEach(body.rows, function (row) {
          toggleRow(row, scope.selectAll);
        });
      };
      
      this.enableRowSelect = function () {
        var checkbox = createCheckbox('Toggle All', 'selectAll')
          .on('click', this.toggleAll);
        this.row.prepend(angular.element('<th></th>').append(checkbox));
      };
    }
    
    function Body() {
      this.rows = element.find('tbody').find('tr');
      
      this.column = function (index, callback) {
        angular.forEach(this.rows, function(row) {
          callback(row.children[index]);
        });
      };
      
      this.enableRowSelect = function () {
        scope.select = [];
        
        angular.forEach(this.rows, function(row, index) {
          row.id = index;
          
          scope.select.push(false);
          
          var checkbox = createCheckbox('Toggle Row', 'select[' + index + ']');
          
          angular.element(row).prepend(angular.element('<td></td>').append(checkbox));
          
          row.addEventListener('click', function () {
            scope.$apply(toggleRow(this));
          });
        });
      };
    }
    
    function addNumericColumn(columnHeader, column) {
      var unit = columnHeader.attributes.unit || { value: undefined };
      var precision = columnHeader.attributes.precision || { value: 0 };
      
      columnHeader.style.textAlign = 'right';
      
      if(unit.value) {
        columnHeader.innerHTML += ' ' + '(' + unit.value + ')';
      }
      
      body.column(column, function (cell) {
        cell.style.textAlign = 'right';
        cell.innerHTML = parseInt(cell.innerHTML).toFixed(precision.value);
        if(cell.attributes.hasOwnProperty('show-unit')) {
          cell.innerHTML += unit.value;
        }
      });
    }
    
    function trimColumnNames() {
      head.row.children().addClass('trim animate');
      
      // get the natural width of the table
      element.css('width', 'auto');
      
      // don't allow the table to shrink beyound its natural width,
      // but allow it to grow
      element.css({
        'min-width': element.prop('scrollWidth') + 'px',
        'width': '100%',
        'table-layout': 'fixed'
      });
    }
    
    function setOrderByAttr(columnHeader) {
      var order = columnHeader.attributes['order-by'] || {
        value: columnHeader.textContent.toLowerCase()
      };
      
      columnHeader.setAttribute('order-by', order.value);
      columnHeader.setAttribute('ng-class', '{\'md-active\': isActive(\'' + order.value + '\')}');
      columnHeader.setAttribute('ng-click', 'setOrder(\'' + order.value + '\')');
      
      $compile(columnHeader)(scope);
    }
    
    function config() {
      head = new Header();
      body = new Body();
      
      if(attrs.hasOwnProperty('trimColumnNames')) {
        trimColumnNames();
      }
      
      if(attrs.hasOwnProperty('mdRowSelect')) {
        head.enableRowSelect();
        body.enableRowSelect();
      }
      
      angular.forEach(head.row.children(), function (cell, index) {
        // we want to avoid applying these functoions to checkboxes
        if(attrs.hasOwnProperty('mdRowSelect') && index === 0) {
          return;
        }
        
        if(attrs.hasOwnProperty('mdColumnSort')) {
          setOrderByAttr(cell);
        }
        
        if(cell.attributes.numeric) {
          addNumericColumn(cell, index);
        }
        
        // I've exhausted all of the CSS magic I can think of to get
        // column names to overflow properly in Safari. My solution
        // is to wrap collumn names in a container.
        if(attrs.hasOwnProperty('trimColumnNames')) {
          cell.innerHTML = '<div>' + cell.innerHTML + '</div>';
        }
      });
    }
    
    function ready() {
      // we need to wait for ng-repeat and interpolate strings to be
      // compiled
      return element.find('tbody').children().length;
    }
    
    var listener = scope.$watch(ready, function (ready) {
      if(ready) {
        listener();
        
        // at this point Firefox is still not ready so we need to
        // wait for the next digest cycle
        $timeout(config);
      }
    });
  }
  
  function compile(iElement, iAttrs) {
    if(iAttrs.hasOwnProperty('mdColumnSort')) {
      var body = iElement.find('tbody').find('tr');
      
      if(body.attr('ng-repeat')) {
        body.attr('ng-repeat', body.attr('ng-repeat') + ' | orderBy: order');
      }
    }
    return postLink;
  }
  
  return {
    scope: true,
    restrict: 'A',
    compile: compile
  };
}]);