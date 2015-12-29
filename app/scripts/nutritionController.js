angular.module('nutritionApp').controller('nutritionController', ['$http', '$mdEditDialog', '$q', '$timeout', '$scope', function ($http, $mdEditDialog, $q, $timeout, $scope) {
  'use strict';
  
  $scope.selected = [];
  
  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  
  $scope.columns = [{
    name: 'Dessert',
    orderBy: 'name',
    unit: '100g serving'
  }, {
    descendFirst: true,
    name: 'Type',
    orderBy: 'type'
  }, {
    name: 'Calories',
    numeric: true,
    orderBy: 'calories.value'
  }, {
    name: 'Fat',
    numeric: true,
    orderBy: 'fat.value',
    unit: 'g'
  }, /* {
    name: 'Carbs',
    numeric: true,
    orderBy: 'carbs.value',
    unit: 'g'
  }, */ {
    name: 'Protein',
    numeric: true,
    orderBy: 'protein.value',
    trim: true,
    unit: 'g'
  }, /* {
    name: 'Sodium',
    numeric: true,
    orderBy: 'sodium.value',
    unit: 'mg'
  }, {
    name: 'Calcium',
    numeric: true,
    orderBy: 'calcium.value',
    unit: '%'
  }, */ {
    name: 'Iron',
    numeric: true,
    orderBy: 'iron.value',
    unit: '%'
  }, {
    name: 'Comments',
    orderBy: 'comment'
  }];
  
  $http.get('desserts.js').then(function (desserts) {
    $scope.desserts = desserts.data;
    // $timeout(function () {
    //   $scope.desserts = desserts.data;
    // }, 1000);
  });
  
  $scope.editComment = function (event, dessert) {
    event.stopPropagation();
    
    var promise = $mdEditDialog.large({
      // messages: {
      //   test: 'I don\'t like tests!'
      // },
      modelValue: dessert.comment,
      placeholder: 'Add a comment',
      save: function (input) {
        dessert.comment = input.$modelValue;
      },
      targetEvent: event,
      title: 'Add a comment',
      validators: {
        'md-maxlength': 30
      }
    });
    
    promise.then(function (ctrl) {
      var input = ctrl.getInput();
      
      input.$viewChangeListeners.push(function () {
        input.$setValidity('test', input.$modelValue !== 'test');
      });
    });
  };
  
  $scope.getTypes = function () {
    return ['Candy', 'Ice cream', 'Other', 'Pastry'];
  };
  
  $scope.onPaginate = function(page, limit) {
    // $scope.$broadcast('md.table.deselect');
    
    console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
    console.log('Page: ' + page + ' Limit: ' + limit);
    
    $scope.promise = $timeout(function () {
      
    }, 2000);
  };
  
  $scope.deselect = function (item) {
    console.log(item.name, 'was deselected');
  };
  
  $scope.log = function (item) {
    console.log(item.name, 'was selected');
  };
  
  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {
      
    }, 2000);
  };
  
  $scope.onReorder = function(order) {
    
    console.log('Scope Order: ' + $scope.query.order);
    console.log('Order: ' + order);
    
    $scope.promise = $timeout(function () {
      
    }, 2000);
  };
  
}]);