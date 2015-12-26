'use strict';

angular.module('md.data.table').directive('mdTablePagination', mdTablePagination);

function mdTablePagination() {
  
  function postLink(scope, element, attrs) {
    if(!scope.label) {
      scope.label = {
        page: 'Page',
        rowsPerPage: 'Rows per page:',
        of: 'of'
      };
    }
    
    scope.first = function () {
      scope.page = 1;
    };
    
    scope.hasNext = function () {
      return scope.page * scope.limit < scope.total;
    };
    
    scope.hasPrevious = function () {
      return scope.page > 1;
    };
    
    scope.last = function () {
      scope.page = scope.pages();
    };
    
    scope.max = function () {
      return scope.hasNext() ? scope.page * scope.limit : scope.total;
    };
    
    scope.min = function () {
      return scope.page * scope.limit - scope.limit;
    };
    
    scope.next = function () {
      scope.page++;
    };
    
    scope.pages = function () {
      return Math.ceil(scope.total / scope.limit);
    };
    
    scope.previous = function () {
      scope.page--;
    };
    
    scope.range = function (total) {
      return new Array(total);
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
    
    scope.$watch('limit', function () {
      if(scope.limit * scope.page > scope.max() && scope.hasPrevious()) {
        scope.previous();
      }
    });
  }
  
  return {
    link: postLink,
    restrict: 'E',
    scope: {
      boundaryLinks: '=?mdBoundaryLinks',
      label: '=?mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      pageSelect: '=?mdPageSelect',
      options: '=mdOptions',
      total: '@mdTotal'
    },
    templateUrl: 'md-table-pagination.html'
  };
}