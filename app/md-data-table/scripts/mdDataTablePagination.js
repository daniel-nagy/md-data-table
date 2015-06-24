angular.module('md.data.table').directive('mdDataTablePagination', function () {
  'use strict';

  return {
    templateUrl: 'templates.md-data-table-pagination.html',
    scope: {
      label: '@mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      rowSelect: '=mdRowSelect',
      total: '@mdTotal'
    },
    link: function (scope) {
      var min;
      
      scope.hasNext = function () {
        return ((scope.page * scope.limit) < scope.total);
      };
      
      scope.hasPrevious = function () {
        return (scope.page > 1);
      };
      
      scope.next = function () {
        scope.page++;
      };
      
      scope.min = function () {
        return (((scope.page - 1) * scope.limit) + 1);
      };
      
      scope.max = function () {
        return scope.hasNext() ? scope.page * scope.limit : scope.total;
      };
      
      scope.onSelect = function () {
        scope.page = Math.floor(min / scope.limit) + 1;
        
        while((scope.min() > scope.total) && scope.hasPrevious()) {
          scope.previous();
        }
      };
      
      scope.previous = function () {
        scope.page--;
      };
      
      scope.$watch('page', function () {
        min = scope.min();
      });
    }
  };
});