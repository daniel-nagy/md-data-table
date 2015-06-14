angular.module('md.data.table', ['md.table.templates']);

angular.module('md.data.table').directive('mdTableBody', ['$mdTableRepeat', '$timeout', function ($mdTableRepeat, $timeout) {
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
    };
  }
  
  function compile(iElement) {
    var ngRepeat = iElement.find('tr').attr('ng-repeat');
    
    if(ngRepeat) {
      // enable row selection
      if(iElement.parent().attr('md-row-select')) {
        var item = $mdTableRepeat.parse(ngRepeat).item;
        var checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        checkbox.attr('aria-label', 'Select Row');
        checkbox.attr('ng-click', 'toggleRow(' + item + ')');
        checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': isSelected(' + item + ')}]');
        
        iElement.find('tr').prepend(angular.element('<td></td>').append(checkbox));
      }
      
      iElement.find('tr').attr('md-table-repeat', '');
    }
    
    return postLink;
  }

  return {
    require: '^mdDataTable',
    compile: compile
  };
}]);

angular.module('md.data.table').controller('mdDataTableController', ['$attrs', '$element', '$parse', '$scope', function ($attrs, $element, $parse, $scope) {
  'use strict';
  
  var self = this;
  
  self.selectedItems = [];
  self.columns = [];
  self.classes = [];
  
  // support theming
  ['md-primary', 'md-hue-1', 'md-hue-2', 'md-hue-3'].forEach(function(mdClass) {
    if($element.hasClass(mdClass)) {
      self.classes.push(mdClass);
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
  };
  
  angular.forEach($element.find('th'), self.setColumns);

}]);

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

angular.module('md.data.table').directive('mdTableHead', ['$document', '$mdTableRepeat', function ($document, $mdTableRepeat) {
  'use strict';


  function postLink(scope, element, attrs, ctrl) {
    
    // column filtering
    if(attrs.mdOrder) {
      scope.$parent.isActive = function (prop) {
        return scope.order === prop || scope.order === '-' + prop;
      };
      
      scope.$parent.orderBy = function (prop) {
        scope.order = scope.order === prop ? '-' + prop : prop;
      };
      
      scope.$parent.getDirection = function (prop) {
        if(scope.$parent.isActive(prop)) {
          return scope.order[0] === '-' ? 'down' : 'up';
        }
        return 'up';
      };
    }
    
    // row selection
    if(element.parent().attr('md-row-select')) {
      scope.$parent.allSelected = function (items) {
        return items && items.length ? items.length === ctrl.selectedItems.length : false;
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
    
    // trim column names
    if(attrs.hasOwnProperty('mdTrimColumnNames')) {
      var div = angular.element('<div></div>').css({
        position: 'absolute',
        fontSize: '12px',
        fontWeight : 'bold',
        visibility: 'hidden'
      });
      
      angular.forEach(element.find('th'), function(cell, index) {
        if(index === 0 || element.parent().attr('md-row-select') && index === 1) {
          return;
        }
        
        var trim = cell.querySelector('trim');
        
        $document.find('body').append(div.html(trim.innerText));
        
        trim.width = div.prop('clientWidth');
        
        cell.addEventListener('mouseenter', function () {
          var trim = this.querySelector('trim');
          var iconWidth = this.querySelector('md-icon') ? 26 : 0;
          
          if(trim.width > (this.clientWidth - iconWidth - 56)) {
            trim.style.minWidth = Math.min(trim.width, this.clientWidth - iconWidth - 28) + 'px';
            this.firstChild.style.color = 'rgba(0, 0, 0, 0.87)';
            this.firstChild.style.overflow = 'visible';
          }
        });
        
        cell.addEventListener('mouseleave', function () {
          this.querySelector('trim').style.minWidth = '';
          this.firstChild.style.color = '';
          this.firstChild.style.overflow = '';
        });
      });
      
      div.remove();
    }
  }
  
  function compile(iElement, iAttrs) {
    
    angular.forEach(iElement.find('th'), function (cell) {
      
      // right align numeric cells
      if(cell.hasAttribute('numeric')) {
        cell.style.textAlign = 'right';
        
        // append unit to column name
        if(cell.hasAttribute('unit')) {
          cell.innerHTML += ' ' + '(' + cell.getAttribute('unit') + ')';
        }
      }
      
      // trim long column names
      if(iAttrs.hasOwnProperty('mdTrimColumnNames')) {
        cell.innerHTML = '<trim>' + cell.innerHTML + '</trim>';
      }
      
      // enable column filtering
      if(iAttrs.mdOrder) {
        var orderBy = cell.getAttribute('order-by');
        
        // use the cell's text as the filter property
        if(!orderBy) {
          cell.setAttribute('order-by', orderBy = cell.textContent.toLowerCase());
        }
        
        cell.setAttribute('ng-class', '{\'md-active\': isActive(\'' + orderBy + '\')}');
        cell.setAttribute('ng-click', 'orderBy(\'' + orderBy + '\')');
        
        var sortIcon = angular.element('<md-icon></md-icon>');
        
        sortIcon.attr('md-svg-icon', 'templates.arrow.html');
        sortIcon.attr('ng-class', 'getDirection(\''  + orderBy + '\')');
        
        if(cell.hasAttribute('numeric')) {
          angular.element(cell).prepend(sortIcon);
        } else {
          angular.element(cell).append(sortIcon);
        }
        
        cell.innerHTML = '<div>' + cell.innerHTML + '</div>';
      }
    });
    
    // ensures a minimum width of 64px for column names
    if(iAttrs.hasOwnProperty('mdTrimColumnNames')) {
      var minWidth = 120 * iElement.find('th').length;
      
      if(iElement.parent().attr('md-row-select')) {
        minWidth += 66;
      }
      
      iElement.parent().css({
        'min-width': minWidth + 'px',
        'table-layout': 'fixed'
      });
    }
    
    // enable row selection
    if(iElement.parent().attr('md-row-select')) {
      var ngRepeat = iElement.parent().find('tbody').find('tr').attr('ng-repeat');
      
      if(ngRepeat) {
        var items = $mdTableRepeat.parse(ngRepeat).items;
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
      order: '=mdOrder'
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
      };
      
      scope.min = function () {
        return (((scope.page - 1) * scope.limit) + 1);
      };
      
      scope.max = function () {
        return scope.hasNext() ? scope.page * scope.limit : scope.total;
      };
      
      scope.onSelect = function () {
        if(scope.min() > scope.total) {
          scope.previous();
        }
      };
      
      scope.previous = function () {
        if(scope.hasPrevious()) {
          scope.page--;
        }
      };
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

angular.module('md.table.templates', ['templates.arrow.html', 'templates.navigate-before.html', 'templates.navigate-next.html', 'templates.md-data-table-pagination.html']);

angular.module('templates.arrow.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('templates.arrow.html',
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M3,9 L4.06,10.06 L8.25,5.87 L8.25,15 L9.75,15 L9.75,5.87 L13.94,10.06 L15,9 L9,3 L3,9 L3,9 Z"/></svg>');
}]);

angular.module('templates.navigate-before.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('templates.navigate-before.html',
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>\n' +
    '');
}]);

angular.module('templates.navigate-next.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('templates.navigate-next.html',
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>\n' +
    '');
}]);

angular.module('templates.md-data-table-pagination.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('templates.md-data-table-pagination.html',
    '<span class="label">Rows per page:</span>\n' +
    '<md-select ng-model="limit" ng-change="onSelect()" aria-label="Row Count" placeholder="{{rowSelect ? rowSelect[0] : 5}}">\n' +
    '  <md-option ng-repeat="rows in rowSelect ? rowSelect : [5, 10, 15]" value="{{rows}}">{{rows}}</md-option>\n' +
    '</md-select>\n' +
    '<span>{{min()}} - {{max()}} of {{total}}</span>\n' +
    '<md-button ng-click="previous()" ng-disabled="!hasPrevious()" aria-label="Previous">\n' +
    '  <md-icon md-svg-icon="templates.navigate-before.html"></md-icon>\n' +
    '</md-button>\n' +
    '<md-button ng-click="next()" ng-disabled="!hasNext()" aria-label="Next">\n' +
    '  <md-icon md-svg-icon="templates.navigate-next.html"></md-icon>\n' +
    '</md-button>');
}]);
