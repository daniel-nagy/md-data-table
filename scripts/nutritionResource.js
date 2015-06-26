angular.module('nutritionApp').factory('$nutrition', ['$resource', function ($resource) {
  'use strict';

  return {
    desserts: $resource('https://infinite-earth-4803.herokuapp.com/nutriton/desserts/:id', {}, {
      filter: {
        method: 'GET',
        url: 'https://infinite-earth-4803.herokuapp.com/nutriton/desserts/search'
      }
    })
  };
}]);