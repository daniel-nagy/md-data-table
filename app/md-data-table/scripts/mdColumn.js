'use strict';

angular.module('md.data.table').directive('mdColumn', mdColumn);

function mdColumn($compile) {
  
  function compile(tElement) {
    tElement.addClass('md-column');
    return postLink;
  }

  function postLink(scope, element, attrs, ctrls) {
    var headCtrl = ctrls.shift();
    var tableCtrl = ctrls.shift();
    
    function attachSortIcon() {
      var sortIcon = angular.element('<md-icon md-svg-icon="arrow-up.svg">');
      
      $compile(sortIcon.addClass('md-sort-icon').attr('ng-class', 'getDirection()'))(scope);
      
      if(element.hasClass('md-numeric')) {
        element.prepend(sortIcon);
      } else {
        element.append(sortIcon);
      }
    }
    
    function detachSortIcon() {
      Array.prototype.some.call(element.find('md-icon'), function (icon) {
        return icon.classList.contains('md-sort-icon') && element[0].removeChild(icon);
      });
    }
    
    function disableSorting() {
      detachSortIcon();
      element.removeClass('md-sort').off('click', setOrder);
    }
    
    function enableSorting() {
      attachSortIcon();
      element.addClass('md-sort').on('click', setOrder);
    }
    
    function getIndex() {
      return Array.prototype.indexOf.call(element.parent().children(), element[0]);
    }
    
    function isActive() {
      if(!scope.orderBy) {
        return false;
      }
      
      return headCtrl.order.indexOf(scope.orderBy) >= 0 ||
        headCtrl.order.indexOf('-' + scope.orderBy) >= 0;
    }
    
    function isNumeric() {
      if(attrs.hasOwnProperty('mdNumeric') && attrs.mdNumeric === '') {
        return true;
      }
      
      return scope.numeric;
    }
    
    function setOrder() {
      scope.$applyAsync(function () {
        var direction = scope.getDirection();
        var ascendingPos = headCtrl.order.indexOf(scope.orderBy);
        var descendingPos = headCtrl.order.indexOf('-' + scope.orderBy);

        if(headCtrl.allowMultipleSorts()) {
          if(!isActive()) {
            direction = 'md-desc';
          }
        } else {
          headCtrl.order = [];
        }

        if(direction === 'md-asc') {
          var key = '-' + scope.orderBy;

          if(descendingPos >= 0) {
            headCtrl.order.splice(descendingPos, 1);
          }

          if(ascendingPos >= 0) {
            headCtrl.order[ascendingPos] = key;
          } else {
            headCtrl.order.push(key);
          }
        } else {
          if(descendingPos >= 0) {
            headCtrl.order.splice(descendingPos, 1);
          }

          // Reset the direction after leaving descending on multiple sorts
          if(descendingPos >= 0 && headCtrl.allowMultipleSorts()) {
            // Next remove everything after it because the parent changed
            headCtrl.order.splice(descendingPos, (headCtrl.order.length - (descendingPos + 1)) + 1);
          } else {
            if(descendingPos >= 0) {
              headCtrl.order[descendingPos] = scope.orderBy;
            } else {
              headCtrl.order.push(scope.orderBy);
            }
          }
        }

        if(angular.isFunction(headCtrl.onReorder)) {
          headCtrl.onReorder(!headCtrl.allowMultipleSorts() ? headCtrl.order[0] : headCtrl.order);
        }
      });
    }
    
    function updateColumn(index, column) {
      tableCtrl.$$columns[index] = column;
      
      if(column.numeric) {
        element.addClass('md-numeric');
      } else {
        element.removeClass('md-numeric');
      }
    }
    
    scope.getDirection = function () {
      if(!isActive()) {
        return attrs.hasOwnProperty('mdDesc') ? 'md-desc' : 'md-asc';
      }
      
      return headCtrl.order.indexOf('-' + scope.orderBy) >= 0 ? 'md-desc' : 'md-asc';
    };
    
    scope.$watch(isActive, function (active) {
      if(active) {
        element.addClass('md-active');
      } else {
        element.removeClass('md-active');
      }
    });
    
    scope.$watch(getIndex, function (index) {
      updateColumn(index, {'numeric': isNumeric()});
    });
    
    scope.$watch(isNumeric, function (numeric) {
      updateColumn(getIndex(), {'numeric': numeric});
    });
    
    scope.$watch('orderBy', function (orderBy) {
      if(orderBy) {
        enableSorting();
      } else {
        disableSorting();
      }
    });
  }

  return {
    compile: compile,
    require: ['^^mdHead', '^^mdTable'],
    restrict: 'A',
    scope: {
      numeric: '=?mdNumeric',
      orderBy: '@?mdOrderBy'
    }
  };
}

mdColumn.$inject = ['$compile'];
