angular.module('md.data.table', ['md.table.templates'])

.directive('mdTableBody', ['$mdTableRepeat', '$timeout', function ($mdTableRepeat, $timeout) {
  'use strict';
  
  function postLink(scope, element, attrs, ctrl) {
    var listener;
    
    scope.mdClasses = ctrl.classes;
    
    // enable row selection
    if(element.parent().attr('md-row-select')) {
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
    
    ctrl.ready = function () {
      var self = this;
      
      if(!listener) {
        var items = $mdTableRepeat.parse(element.find('tr').attr('ng-repeat')).items;
        
        // clear the selected items (incase of server side filtering or pagination)
        listener = scope.$watch(items, function (newValue, oldValue) {
          if(newValue !== oldValue) {
            ctrl.selectedItems.splice(0);
          }
        });
      }
      
      // set numeric cells
      this.columns.forEach(function (column, index) {
        if(!column.isNumeric) {
          return;
        }
        
        self.column(index, function (cell) {
          cell.style.textAlign = 'right';
          
          if(self.columns[index].hasOwnProperty('precision')) {
            $timeout(function () {
              cell.innerHTML = parseInt(cell.innerHTML).toFixed(self.columns[index].precision);
            });
          }
          
          if(cell.attributes.hasOwnProperty('show-unit')) {
            $timeout(function () {
              cell.innerHTML += self.columns[index].unit;
            });
          }
        });
      });
    }
  }
  
  function compile(iElement) {
    // enable row selection
    if(iElement.parent().attr('md-row-select')) {
      var ngRepeat = iElement.find('tr').attr('ng-repeat');
      
      if(ngRepeat) {
        var item = $mdTableRepeat.parse(ngRepeat).item;
        var checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        checkbox.attr('aria-label', 'Select Row');
        checkbox.attr('ng-click', 'toggleRow(' + item + ')');
        checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': isSelected(' + item + ')}]');
        
        iElement.find('tr').prepend(angular.element('<td></td>').append(checkbox)).attr('md-table-repeat', '');
      }
    }
    
    return postLink;
  }

  return {
    require: '^mdDataTable',
    compile: compile
  };
}]);

angular.module('md.data.table')

.controller('mdDataTableController', ['$attrs', '$element', '$parse', '$scope', function ($attrs, $element, $parse, $scope) {
  'use strict';
  
  var self = this;
  
  self.selectedItems = [];
  self.columns = [];
  self.classes = [];
  
  // support theming
  ['md-primary', 'md-hue-1', 'md-hue-2', 'md-hue-3'].forEach(function(mdClass) {
    if($element.hasClass(mdClass)) {
      self.classes.push(mdClass)
    }
  });
  
  if($attrs.mdRowSelect) {
    $parse($attrs.mdRowSelect).assign($scope.$parent.$parent, self.selectedItems);
  }
  
  if($attrs.mdFilter) {
    self.filter = $scope.filter;
  }
  
  self.column = function (index, callback) {
    angular.forEach($element.find('tbody').find('tr'), function(row) {
      callback(row.children[index]);
    });
  };

  self.setColumns = function (cell) {
    if(!cell.attributes.numeric) {
      return self.columns.push({ isNumeric: false });
    }
    
    self.columns.push({
      isNumeric: true,
      unit: cell.attributes.unit ? cell.attributes.unit.value : undefined,
      precision: cell.attributes.precision ? cell.attributes.precision.value : undefined
    });
  }
  
  angular.forEach($element.find('th'), self.setColumns);

}]);

angular.module('md.data.table')

.directive('mdDataTable', function () {
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

angular.module('md.data.table')

.directive('mdTableHead', ['$mdTableRepeat', function ($mdTableRepeat) {
  'use strict';


  function postLink(scope, element, attrs, ctrl) {
    
    // column filtering
    if(attrs.mdFilter) {
      scope.$parent.isActive = function (prop) {
        return scope.filter === prop || scope.filter === '-' + prop;
      };
      
      scope.$parent.orderBy = function (prop) {
        scope.filter = scope.filter === prop ? '-' + prop : prop;
      };
    }
    
    // row selection
    if(element.parent().attr('md-row-select')) {
      scope.$parent.allSelected = function (items) {
        return items ? items.length === ctrl.selectedItems.length : false;
      };
      
      scope.$parent.toggleAll = function (items) {
        if(scope.$parent.allSelected(items)) {
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
    
    function onMouseEnter() {
      if((this.firstChild.width + 56) > this.clientWidth) {
        this.firstChild.style.textAlign = 'right';
        this.firstChild.style.marginLeft = Math.max(0, (this.clientWidth - this.firstChild.width)) + 'px';
      }
    }
    
    function onMouseLeave() {
      this.firstChild.style.marginLeft = '56px';
      if(!this.classList.contains('trim')) {
        this.firstChild.style.textAlign = 'left';
      }
    }
    
    // trim column names
    if(attrs.hasOwnProperty('mdTrimColumnNames')) {
      angular.forEach(element.find('th'), function(cell, index) {
        if(cell.classList.contains('trim')) {
          // the first cell doesn't have any margining
          if(this.parent().attr('md-row-select') && index == 1) {
            return;
          }
          
          // we need to add an element to the DOM and measure it
          // to get the width of the cell
          var element = angular.element('<div></div>');
          
          element.html(cell.firstChild.innerHTML).css({
            position: 'absolute',
            visibility: 'hidden'
          });
          
          angular.element(document).find('body').append(element);
          
          cell.firstChild.width = element.prop('clientWidth');
          
          // 24px padding at the end of the table
          if(!cell.nextElementSibling) {
            cell.firstChild.width += 24;
          }
          
          element.remove();
          
          cell.addEventListener('mouseenter', onMouseEnter);
          cell.addEventListener('mouseleave', onMouseLeave);
        }
      }, element);
    }
  }
  
  function compile(iElement, iAttrs) {
    
    angular.forEach(iElement.find('th'), function (cell) {
      // enable column filtering
      if(iAttrs.mdFilter) {
        var orderBy = cell.getAttribute('order-by');
        
        // use the cell's text as the filter property
        if(!orderBy) {
          cell.setAttribute('order-by', orderBy = cell.textContent.toLowerCase());
        }
        
        cell.setAttribute('ng-class', '{\'md-active\': isActive(\'' + orderBy + '\')}');
        cell.setAttribute('ng-click', 'orderBy(\'' + orderBy + '\')');
      }
      
      // right align numeric cells
      if(cell.hasAttribute('numeric')) {
        cell.style.textAlign = 'right'
        
        // append unit to column name
        if(cell.hasAttribute('unit')) {
          cell.innerHTML += ' ' + '(' + cell.getAttribute('unit') + ')';
        }
      }
      
      // trim long column names
      if(iAttrs.hasOwnProperty('mdTrimColumnNames')) {
        cell.classList.add('trim', 'animate');
        cell.innerHTML = '<div>' + cell.innerHTML + '</div>';
      }
    });
    
    if(iAttrs.hasOwnProperty('mdTrimColumnNames')) {
      // enforce a minimum width of 120px per column
      iElement.parent().css({
        'min-width': 120 * iElement.find('th').length + 'px',
        'table-layout': 'fixed'
      });
    }
    
    // enable row selection
    if(iElement.parent().attr('md-row-select')) {
      var ngRepeat = iElement.parent().find('tbody').find('tr').attr('ng-repeat');
      
      if(ngRepeat) {
        var items = $mdTableRepeat.parse(ngRepeat).items
        var checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        checkbox.attr('aria-label', 'Select All');
        checkbox.attr('ng-click', 'toggleAll(' + items + ')');
        checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': allSelected(' + items + ')}]');
        
        iElement.find('tr').prepend(angular.element('<th></th>').append(checkbox));
      }
    }
    
    return postLink;
  }
  
  return {
    require: '^mdDataTable',
    scope: {
      filter: '=mdFilter'
    },
    compile: compile
  };
}]);

angular.module('md.data.table').directive('mdDataTablePagination', function () {
  'use strict';

  return {
    templateUrl: 'templates.md-data-table-pagination.html',
    scope: {
      limit: '=mdLimit',
      page: '=mdPage',
      rowSelect: '=mdRowSelect',
      total: '@mdTotal'
    },
    link: function (scope) {
      
      scope.hasNext = function () {
        return ((scope.page * scope.limit) < scope.total);
      };
      
      scope.hasPrevious = function () {
        return (scope.page > 1);
      };
      
      scope.next = function () {
        if(scope.hasNext()) {
          scope.page++;
        }
      }
      
      scope.min = function () {
        return (((scope.page - 1) * scope.limit) + 1);
      };
      
      scope.max = function () {
        return scope.hasNext() ? scope.page * scope.limit : scope.total;
      }
      
      scope.onSelect = function () {
        if(scope.min() > scope.total) {
          scope.page--;
        }
      };
      
      scope.previous = function () {
        if(scope.hasPrevious()) {
          scope.page--;
        }
      }
    }
  };
});

angular.module('md.data.table').directive('mdTableRepeat', function () {
  'use strict';
  
  return {
    require: '^mdDataTable',
    link: function (scope, element, attrs, ctrl) {
      // notifies the parent directive everytime ngRepeat changes
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
    
    // this.orderBy = undefined;
    // if(this.hasNext() && this.getNext() === 'orderBy:') {
    //   this.orderBy = this.getNext();
    // }
    //
    // this.trackBy = undefined;
    // if(this.hasNext()) {
    //   this.trackBy = this.getNext() === 'by' ? this.getNext() : this.current();
    // }
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
  
  // Repeat.prototype.insertOrderBy = function (property) {
  //   this.orderBy = property;
  //   this._iterator = this.trackBy ? this._tokens.indexOf(this.trackBy) : this._tokens.length;
  //   this._tokens.splice(this._iterator, 0, '|', 'orderBy:', property);
  //   return this._tokens.join(' ');
  // };
  
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

angular.module('md.table.templates', ['templates.md-data-table-pagination.html']);

angular.module('templates.md-data-table-pagination.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('templates.md-data-table-pagination.html',
    '<span>Rows per page:</span>\n' +
    '<md-select ng-model="limit" ng-change="onSelect()" aria-label="Row Count" placeholder="{{rowSelect ? rowSelect[0] : 5}}">\n' +
    '  <md-option ng-repeat="rows in rowSelect ? rowSelect : [5, 10, 15]" value="{{rows}}">{{rows}}</md-option>\n' +
    '</md-select>\n' +
    '<span>{{min()}} - {{max()}} of {{total}}</span>\n' +
    '<md-button class="arrow left" ng-click="previous()" ng-disabled="!hasPrevious()" aria-label="Previous"></md-button>\n' +
    '<md-button class="arrow right" ng-click="next()" ng-disabled="!hasNext()" aria-label="Next"></span></md-button>');
}]);
