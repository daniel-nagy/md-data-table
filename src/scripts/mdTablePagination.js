'use strict';

angular.module('md.data.table').directive('mdTablePagination', mdTablePagination);

function mdTablePagination() {
  
  function compile(tElement) {
    tElement.addClass('md-table-pagination');
  }
  
  function Controller($attrs, $mdUtil, $scope) {
    var self = this;
    var defaultLabel = {
      page: 'Page:',
      rowsPerPage: 'Rows per page:',
      of: 'of'
    };
    
    self.label = angular.copy(defaultLabel);
    
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
        $mdUtil.nextTick(function () {
          self.onPaginate(self.page, self.limit);
        });
      }
    };
    
    self.pages = function () {
      return Math.ceil(self.total / (isZero(self.limit) ? 1 : self.limit));
    };
    
    self.previous = function () {
      self.page--;
      self.onPaginationChange();
    };
    
    self.showBoundaryLinks = function () {
      return $attrs.mdBoundaryLinks === '' || self.boundaryLinks;
    };
    
    self.showPageSelect = function () {
      return $attrs.mdPageSelect === '' || self.pageSelect;
    };
    
    $scope.$watch('$pagination.limit', function (newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      
      // find closest page from previous min
      self.page = Math.floor(((self.page * oldValue - oldValue) + newValue) / (isZero(newValue) ? 1 : newValue));
      self.onPaginationChange();
    });
    
    $attrs.$observe('mdLabel', function (label) {
      angular.extend(self.label, defaultLabel, $scope.$eval(label));
    });
  }
  
  Controller.$inject = ['$attrs', '$mdUtil', '$scope'];
  
  return {
    bindToController: {
      boundaryLinks: '=?mdBoundaryLinks',
      limit: '=mdLimit',
      page: '=mdPage',
      pageSelect: '=?mdPageSelect',
      onPaginate: '=?mdOnPaginate',
      limitOptions: '=?mdLimitOptions',
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