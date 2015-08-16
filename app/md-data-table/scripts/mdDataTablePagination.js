angular.module('md.data.table').directive('mdDataTablePagination', mdDataTablePagination);

function mdDataTablePagination($q) {
  'use strict';

  function postLink(scope, element, attrs) {
    scope.paginationLabel = {
      text: 'Rows per page:',
      of: 'of'
    };
    
    if(angular.isObject(scope.label)) {
      angular.extend(scope.paginationLabel, scope.label);
    }
    
    // table progress
    if(angular.isFunction(scope.trigger)) {
      
      // the pagination directive is outside the table directive so we need
      // to locate the controller
      var findTable = function(element, callback) {
        while(element.localName !== 'md-data-table-container' && element.previousElementSibling) {
          element = element.previousElementSibling;
        }
        callback(angular.element(element.firstElementChild));
      };
      
      var setTrigger = function(table) {
        var tableCtrl = table.controller('mdDataTable');
        
        if(!tableCtrl) {
          return console.warn('Table Pagination: Could not locate your table directive, your ' + attrs.mdTrigger + ' function will not work.');
        }
        
        scope.pullTrigger = function () {
          var deferred = tableCtrl.defer();
          $q.when(scope.trigger(scope.page, scope.limit))['finally'](deferred.resolve);
        };
      };
      
      findTable(element.prop('previousElementSibling'), setTrigger);
    }
  }
  
  function Controller($scope, $timeout) {
    var min = 1;
    
    $scope.hasNext = function () {
      return (($scope.page * $scope.limit) < $scope.total);
    };
    
    $scope.hasPrevious = function () {
      return ($scope.page > 1);
    };
    
    $scope.next = function () {
      $scope.page++;
      
      if($scope.pullTrigger) {
        $timeout($scope.pullTrigger);
      }
      
      min = $scope.min();
    };
    
    $scope.last = function () {
      $scope.page = Math.ceil($scope.total / $scope.limit);
      
      if($scope.pullTrigger) {
        $timeout($scope.pullTrigger);
      }
      
      min = $scope.min();
    };
    
    $scope.min = function () {
      return ((($scope.page - 1) * $scope.limit) + 1);
    };
    
    $scope.max = function () {
      return $scope.hasNext() ? $scope.page * $scope.limit : $scope.total;
    };
    
    $scope.onSelect = function () {
      $scope.page = Math.floor(min / $scope.limit) + 1;
      
      if($scope.pullTrigger) {
        $timeout($scope.pullTrigger);
      }
      
      min = $scope.min();
      while((min > $scope.total) && $scope.hasPrevious()) {
        $scope.previous();
      }
    };
    
    $scope.previous = function () {
      $scope.page--;
      
      if($scope.pullTrigger) {
        $timeout($scope.pullTrigger);
      }
      
      min = $scope.min();
    };
    
    $scope.first = function () {
      $scope.page = 1;
      
      if($scope.pullTrigger) {
        $timeout($scope.pullTrigger);
      }
      
      min = $scope.min();
    };
  }
  
  Controller.$inject = ['$scope', '$timeout'];

  return {
    controller: Controller,
    scope: {
      label: '=mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      rowSelect: '=mdRowSelect',
      total: '@mdTotal',
      trigger: '=mdTrigger'
    },
    templateUrl: 'templates.md-data-table-pagination.html',
    link: postLink
  };
}

mdDataTablePagination.$inject = ['$q'];