angular.module('nutritionApp').factory('$authorize', ['$resource', function ($resource) {
  'use strict';

  return $resource('https://infinite-earth-4803.herokuapp.com/authorize/:secret');
}]);