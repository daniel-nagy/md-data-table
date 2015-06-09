angular.module('nutritionApp').factory('$nutrition', ['$resource', function ($resource) {
  'use strict';

  return {
    desserts: $resource('http://localhost:3000/nutriton/desserts')
  };
}]);