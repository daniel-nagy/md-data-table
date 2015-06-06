angular.module('nutritionApp').factory('$nutrition', ['$resource', function ($resource) {
  'use strict';
  
  var desserts = $resource('http://localhost:3000/nutriton/deserts', {filter: 'name', limit: 5, page: 1});
  
  return {
    desserts: desserts
  };
}]);