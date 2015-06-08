angular.module('nutritionApp').factory('$nutrition', ['$resource', function ($resource) {
  'use strict';
  
  var desserts = $resource('http://localhost:3000/nutriton/desserts', {filter: 'name', limit: 10, page: 1});
  
  return {
    desserts: desserts
  };
}]);