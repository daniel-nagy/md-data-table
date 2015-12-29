'use strict';

angular.module('md.data.table').directive('mdTablePagination', mdTablePagination);

function mdTablePagination() {
  
  function compile(tElement) {
    tElement.addClass('md-table-pagination');
    return postLink;
  }
  
  function postLink(scope, element, attrs) {
    scope.$label = angular.extend({
      page: 'Page:',
      rowsPerPage: 'Rows per page:',
      of: 'of'
    }, scope.$eval(scope.label) || {});
    
    function isPositive(number) {
      return number > 0;
    }
    
    function isZero(number) {
      return number === 0 || number === '0';
    }
    
    function onPaginationChange() {
      if(angular.isFunction(scope.onPaginate)) {
        scope.onPaginate(scope.page, scope.limit);
      }
    }
    
    scope.disableNext = function () {
      return isZero(scope.limit) || !scope.hasNext();
    };
    
    scope.first = function () {
      scope.page = 1;
      onPaginationChange();
    };
    
    scope.hasNext = function () {
      return scope.page * scope.limit < scope.total;
    };
    
    scope.hasPrevious = function () {
      return scope.page > 1;
    };
    
    scope.last = function () {
      scope.page = scope.pages();
      onPaginationChange();
    };
    
    scope.max = function () {
      return scope.hasNext() ? scope.page * scope.limit : scope.total;
    };
    
    scope.min = function () {
      return scope.page * scope.limit - scope.limit;
    };
    
    scope.next = function () {
      scope.page++;
      onPaginationChange();
    };
    
    scope.onPageChange = onPaginationChange;
    
    scope.pages = function () {
      return Math.ceil(scope.total / (isZero(scope.limit) ? 1 : scope.limit));
    };
    
    scope.previous = function () {
      scope.page--;
      onPaginationChange();
    };
    
    scope.range = function (total) {
      return new Array(isFinite(total) && isPositive(total) ? total : 1);
    };
    
    scope.showBoundaryLinks = function () {
      if(attrs.hasOwnProperty('mdBoundaryLinks') && attrs.mdBoundaryLinks === '') {
        return true;
      }
      
      return scope.boundaryLinks;
    };
    
    scope.showPageSelect = function () {
      if(attrs.hasOwnProperty('mdPageSelect') && attrs.mdPageSelect === '') {
        return true;
      }
      
      return scope.pageSelect;
    };
    
    scope.$watch('limit', function (newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      
      // find closest page from previous min
      scope.page = Math.floor(((scope.page * oldValue - oldValue) + newValue) / (isZero(newValue) ? 1 : newValue));
      
      onPaginationChange();
    });
  }
  
  return {
    compile: compile,
    restrict: 'E',
    scope: {
      boundaryLinks: '=?mdBoundaryLinks',
      label: '@?mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      pageSelect: '=?mdPageSelect',
      onPaginate: '=?mdOnPaginate',
      options: '=mdOptions',
      total: '@mdTotal'
    },
    templateUrl: 'md-table-pagination.html'
  };
}