'use strict';

angular.module('md.data.table').directive('mdTablePagination', mdTablePagination);

function mdTablePagination() {
  
  function postLink(scope) {
    if(!scope.label) {
      scope.label = {
        0: 'Rows per page:',
        1: 'of'
      };
    }
    
    scope.hasNext = function () {
      return scope.page * scope.limit < scope.total;
    };
    
    scope.hasPrevious = function () {
      return scope.page > 1;
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
    
    scope.previous = function () {
      scope.page--;
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
      // boundaryLinks: '=?mdBoundaryLinks',
      label: '=?mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      // pageSelect: '=?mdPageSelect',
      options: '=mdOptions',
      total: '@mdTotal'
    },
    templateUrl: 'md-table-pagination.html'
  };
}