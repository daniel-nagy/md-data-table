angular.module('md.data.table').directive('mdTableHead', ['$document', '$mdTable', '$q', function ($document, $mdTable, $q) {
  'use strict';

  function postLink(scope, element, attrs, tableCtrl) {
    
    // table progress
    if(angular.isFunction(scope.trigger)) {
      scope.headCtrl.pullTrigger = function () {
        var deferred = tableCtrl.defer();
        $q.when(scope.trigger(scope.headCtrl.order))['finally'](deferred.resolve);
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
      
      $document.find('body').append(div);
      
      angular.forEach(element.find('th'), function(cell, index) {
        if(index === 0 || element.parent().attr('md-row-select') && index === 1) {
          return;
        }
        
        var trim = cell.querySelector('trim');
        
        div.html(trim.innerText);
        
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
  
  function compile(tElement, tAttrs) {
    
    angular.forEach(tElement.find('th'), function (cell) {
      
      // right align numeric cells
      if(cell.hasAttribute('numeric')) {
        cell.style.textAlign = 'right';
        
        // append unit to column name
        if(cell.hasAttribute('unit')) {
          cell.innerHTML += ' ' + '(' + cell.getAttribute('unit') + ')';
        }
      }
      
      // trim long column names
      if(tAttrs.hasOwnProperty('mdTrimColumnNames')) {
        cell.innerHTML = '<trim>' + cell.innerHTML + '</trim>';
      }
    });
    
    // ensures a minimum width of 64px for column names
    if(tAttrs.hasOwnProperty('mdTrimColumnNames')) {
      var minWidth = 120 * tElement.find('th').length;
      
      if(tElement.parent().attr('md-row-select')) {
        minWidth += 66;
      }
      
      tElement.parent().css({
        'min-width': minWidth + 'px',
        'table-layout': 'fixed'
      });
    }
    
    // enable row selection
    if(tElement.parent().attr('md-row-select')) {
      var ngRepeat = tElement.parent().find('tbody').find('tr').attr('ng-repeat');
      
      if(ngRepeat) {
        var items = $mdTable.parse(ngRepeat).items;
        var checkbox = angular.element('<md-checkbox></md-checkbox>');
        
        checkbox.attr('aria-label', 'Select All');
        checkbox.attr('ng-click', 'toggleAll(' + items + ')');
        checkbox.attr('ng-class', '[mdClasses, {\'md-checked\': allSelected()}]');
        checkbox.attr('ng-disabled', '!getCount(' + items + ')');
        
        tElement.find('tr').prepend(angular.element('<th></th>').append(checkbox));
      }
    }
    
    tElement.after('<thead md-table-progress></thead>');
    
    return postLink;
  }
  
  return {
    bindToController: {
      order: '=mdOrder'
    },
    controller: function () {},
    controllerAs: 'headCtrl',
    require: '^mdDataTable',
    scope: {
      trigger: '=mdTrigger'
    },
    compile: compile
  };
}]);
