angular.module('md.data.table').directive('mdTableHead', ['$mdTableRepeat', function ($mdTableRepeat) {
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
      angular.forEach(element.find('th'), function(cell, index) {
        if(index === 0 || element.parent().attr('md-row-select') && index === 1) {
          return;
        }
        
        var trim = cell.querySelector('trim');
        
        // we need to add an element to the DOM and measure it
        // to get the width of the cell
        var div = angular.element('<div></div>');
        
        div.html(trim.innerText).css({
          position: 'absolute',
          visibility: 'hidden'
        });
        
        angular.element(document).find('body').append(div);
        
        cell.firstChild.width = div.prop('clientWidth');
        
        div.remove();
        
        // 24px padding at the end of the table
        if(!cell.nextElementSibling) {
          cell.firstChild.width += 24;
        }
        
        cell.addEventListener('mouseenter', function () {
          var marginLeft = this.firstChild.localName === 'trim' ? '56' : '22';
          
          if(this.firstChild.width > (this.clientWidth - marginLeft)) {
            marginLeft = Math.max(0, (this.clientWidth - this.firstChild.width));
            this.firstChild.style.textAlign = 'right';
            this.firstChild.style.marginLeft = marginLeft + 'px';
          }
        });
        
        cell.addEventListener('mouseleave', function () {
          this.firstChild.style.marginLeft = '';
          this.firstChild.style.textAlign = '';
        });
      });
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