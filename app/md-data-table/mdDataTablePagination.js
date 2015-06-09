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