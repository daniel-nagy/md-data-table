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
      // enforce a minimum width of 100px per column
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
        checkbox.attr('ng-class', '{\'md-checked\': allSelected(' + items + ')}');
        
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