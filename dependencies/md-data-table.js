angular.module('md.data.table', []).directive('mdTableBody', function () {
  'use strict';

  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      scope.isSelected = function (item) {
        return ctrl.selectedItems.indexOf(item) !== -1;
      };
      
      scope.toggleRow = function (item) {
        if(scope.isSelected(item)) {
          ctrl.selectedItems.splice(ctrl.selectedItems.indexOf(item), 1);
        } else {
          ctrl.selectedItems.push(item);
        }
      };
    }
  };
});

angular.module('md.data.table')

.controller('mdDataTableController', ['$attrs', '$parse', '$scope', function ($attrs, $parse, $scope) {
  'use strict';

  this.selectedItems = [];
  
  /*
   * Ensures two things.
   *
   * 1. If the scope variable does not exist, at the time of table
   *    creation, it will be created in the proper scope.
   *
   * 2. If the variable is not an array, it will be converted to an
   *    array.
   */
  if($attrs.mdRowSelect) {
    $parse($attrs.mdRowSelect).assign($scope.$parent.$parent, this.selectedItems);
  }
}]);

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

angular.module('md.data.table')

.directive('mdTableHead', ['$compile', '$mdTableRepeat', '$parse', function ($compile, $mdTableRepeat, $parse) {
  'use strict';

  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      var order;
      
      function setOrderBy(cell, index) {
        if(element.parent().attr('md-row-select') && index === 0) {
          return;
        }
        
        var orderBy = cell.attributes['order-by'] || {
          value: cell.textContent.toLowerCase()
        };
        
        cell.setAttribute('order-by', orderBy.value);
        cell.setAttribute('ng-class', '{\'md-active\': isActive(\'' + orderBy.value + '\')}');
        cell.setAttribute('ng-click', 'orderBy(\'' + orderBy.value + '\')');
        
        $compile(cell)(scope);
      }
      
      function autoSort(body) {
        order = $parse($mdTableRepeat.parse(body.attr('ng-repeat')).orderBy);
        
        scope.isActive = function (prop) {
          return order(scope) === prop || order(scope) === '-' + prop;
        };
        
        scope.orderBy = function (prop) {
          order.assign(scope, order(scope) === prop ? '-' + prop : prop);
        };
      }
      
      function manualSort() {
        scope.isActive = function (prop) {
          return order === prop || order === '-' + prop;
        };
        
        scope.orderBy = function (prop) {
          ctrl.selectedItems.splice(0);
          scope.filter(order = order === prop ? '-' + prop : prop);
        };
      }
      
      ctrl.setFilter = function (body) {
        if(element.parent().attr('md-column-sort') !== undefined) {
          angular.forEach(element.find('tr').children(), setOrderBy);
          
          if(element.parent().attr('md-filter')) {
            manualSort();
          } else {
            autoSort(body);
          }
        }
      };
      
      scope.allSelected = function (items) {
        return items ? items.length === ctrl.selectedItems.length : false;
      };
      
      scope.toggleAll = function (items) {
        if(scope.allSelected(items)) {
          ctrl.selectedItems.splice(0);
        } else {
          angular.forEach(items, function (item) {
            if(ctrl.selectedItems.indexOf(item) === -1) {
              ctrl.selectedItems.push(item);
            }
          });
        }
      };
    }
  };
}]);

angular.module('md.data.table').directive('mdTableRepeat', function () {
  'use strict';
  
  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      if(scope.$last) {
        ctrl.ready();
      }
    }
  };
});

angular.module('md.data.table').factory('$mdTableRepeat', function () {
  'use strict';
  
  var cache = {};
  
  function Repeat(ngRepeat) {
    this._tokens = ngRepeat.split(' ');
    this._iterator = 0;
    
    this.item = this.current();
    while(this.hasNext() && this.getNext() !== 'in') {
      this.item += this.current();
    }
    
    this.items = this.getNext();
    while(this.hasNext() && ['|', 'track'].indexOf(this.getNext()) === -1) {
      this.items += this.current();
    }
    
    this.orderBy = undefined;
    if(this.hasNext() && this.getNext() === 'orderBy:') {
      this.orderBy = this.getNext();
    }
    
    this.trackBy = undefined;
    if(this.hasNext()) {
      this.trackBy = this.getNext() === 'by' ? this.getNext() : this.current();
    }
  }
  
  Repeat.prototype.current = function () {
    return this._tokens[this._iterator];
  };
  
  Repeat.prototype.getNext = function() {
    return this._tokens[++this._iterator];
  };
  
  Repeat.prototype.getValue = function() {
    return this._tokens.join(' ');
  };
  
  Repeat.prototype.hasNext = function () {
    return this._iterator < this._tokens.length - 1;
  };
  
  Repeat.prototype.insertOrderBy = function (property) {
    this.orderBy = property;
    this._iterator = this.trackBy ? this._tokens.indexOf(this.trackBy) : this._tokens.length;
    this._tokens.splice(this._iterator, 0, '|', 'orderBy:', property);
    return this._tokens.join(' ');
  };
  
  function parse(ngRepeat) {
    if(!cache.hasOwnProperty(ngRepeat)) {
      return (cache[ngRepeat] = new Repeat(ngRepeat));
    }
    return cache[ngRepeat];
  }
  
  return {
    parse: parse
  };
  
});