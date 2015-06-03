angular.module('md.data.table', [])

.directive('mdDataTable', ['$compile', '$timeout', function ($compile, $timeout) {
  'use strict';
  
  function postLink(scope, element, attrs, controller, transclude) {
    var head, body;
    
    transclude(scope, function (clone) {
      element.wrap('<md-data-table-container></md-data-table-container>').append(clone);
    });
    
    function createCheckbox(label, model) {
      return $compile(angular.element('<md-checkbox></md-checkbox>')
        .attr('aria-label', label)
        .attr('ng-click', '$event.stopPropagation()')
        .attr('ng-model', model))(scope);
    }
    
    function toggleRow(row, value) {
      scope.select[row.id] = value !== undefined ? value : !scope.select[row.id];
    }
    
    function setOrder(prop) {
      scope.order = scope.order === prop ? '-' + prop : prop;
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
    
    function config() {
      head = new Header();
      body = new Body();
      
      if(attrs.hasOwnProperty('mdRowSelect')) {
        head.enableRowSelect();
        body.enableRowSelect();
      }
      
      angular.forEach(head.row.children(), function (cell, index) {
        if(body.rows.attr('ng-repeat')) {
          cell.addEventListener('click', function () {
            scope.$apply(setOrder(this.attributes['order-by'].value));
          });
        }
        
        if(!cell.attributes.numeric) {
          return;
        }
        
        var unit = cell.attributes.unit || { value: undefined };
        var precision = cell.attributes.precision || { value: 0 };
        
        cell.style.textAlign = 'right';
        
        if(unit.value) {
          cell.innerHTML += ' ' + '(' + unit.value + ')';
        }
        
        body.column(index, function (cell) {
          cell.style.textAlign = 'right';
          cell.innerHTML = parseInt(cell.innerHTML).toFixed(precision.value);
          if(cell.attributes.hasOwnProperty('show-unit')) {
            cell.innerHTML += unit.value;
          }
        });
      });
    }
    
    function ready() {
      return element.find('tbody').children().length;
    }
    
    var listener = scope.$watch(ready, function (ready) {
      if(ready) {
        listener();
        $timeout(config);
      }
    });
  }
  
  function compile(iElement) {
    var body = iElement.find('tbody').find('tr');
    var head = {
      cells: iElement.find('th')
    };
    
    if(body.attr('ng-repeat')) {
      body.attr('ng-repeat', body.attr('ng-repeat') + ' | orderBy: order');
      
      angular.forEach(head.cells, function (cell) {
        if(!cell.attributes['order-by']) {
          cell.setAttribute('order-by', cell.textContent.toLowerCase());
        }
      });
    }
    
    return {
      post: postLink
    };
  }
  
  return {
    scope: true,
    restrict: 'A',
    transclude: true,
    compile: compile
  };
}]);