'use strict';

angular.module('md.data.table').directive('mdTablePagination', mdTablePagination);

function mdTablePagination() {
  
  function compile(tElement) {
    tElement.addClass('md-table-pagination');
  }
  
  function Controller($attrs, $scope) {
    var self = this;
    
    self.$label = angular.extend({
      page: 'Page:',
      rowsPerPage: 'Rows per page:',
      of: 'of'
    }, $scope.$eval(self.label) || {});
    
    function isPositive(number) {
      return number > 0;
    }
    
    function isZero(number) {
      return number === 0 || number === '0';
    }
    
    self.disableNext = function () {
      return isZero(self.limit) || !self.hasNext();
    };
    
    self.first = function () {
      self.page = 1;
      self.onPaginationChange();
    };
    
    self.hasNext = function () {
      return self.page * self.limit < self.total;
    };
    
    self.hasPrevious = function () {
      return self.page > 1;
    };
    
    self.last = function () {
      self.page = self.pages();
      self.onPaginationChange();
    };
    
    self.max = function () {
      return self.hasNext() ? self.page * self.limit : self.total;
    };
    
    self.min = function () {
      return self.page * self.limit - self.limit;
    };
    
    self.next = function () {
      self.page++;
      self.onPaginationChange();
    };
    
    self.onPaginationChange = function () {
      if(angular.isFunction(self.onPaginate)) {
        self.onPaginate(self.page, self.limit);
      }
    };
    
    self.pages = function () {
      return Math.ceil(self.total / (isZero(self.limit) ? 1 : self.limit));
    };
    
    self.previous = function () {
      self.page--;
      self.onPaginationChange();
    };
    
    self.range = function (total) {
      return new Array(isFinite(total) && isPositive(total) ? total : 1);
    };
    
    self.showBoundaryLinks = function () {
      if($attrs.hasOwnProperty('mdBoundaryLinks') && $attrs.mdBoundaryLinks === '') {
        return true;
      }
      
      return self.boundaryLinks;
    };
    
    self.showPageSelect = function () {
      if($attrs.hasOwnProperty('mdPageSelect') && $attrs.mdPageSelect === '') {
        return true;
      }
      
      return self.pageSelect;
    };
    
    $scope.$watch('$pagination.limit', function (newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      
      // find closest page from previous min
      self.page = Math.floor(((self.page * oldValue - oldValue) + newValue) / (isZero(newValue) ? 1 : newValue));
      self.onPaginationChange();
    });
  }
  
  Controller.$inject = ['$attrs', '$scope'];
  
  return {
    bindToController: {
      boundaryLinks: '=?mdBoundaryLinks',
      label: '@?mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      pageSelect: '=?mdPageSelect',
      onPaginate: '=?mdOnPaginate',
      options: '=mdOptions',
      total: '@mdTotal'
    },
    compile: compile,
    controller: Controller,
    controllerAs: '$pagination',
    restrict: 'E',
    scope: {},
    templateUrl: 'md-table-pagination.html'
  };
}