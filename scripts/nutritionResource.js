angular.module('nutritionApp').factory('$nutrition', ['$resource', function ($resource) {
  'use strict';
  
  var desserts = $resource('https://infinite-earth-4803.herokuapp.com/nutriton/deserts', {filter: 'name', limit: 10, page: 1});
  
  return {
    desserts: desserts
  };
}]);