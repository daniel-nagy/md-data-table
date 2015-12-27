'use strict';

angular.module('md.data.table').directive('mdRow', mdRow);

function mdRow() {

  function compile(tElement) {
    tElement.addClass('md-row');
  }

  return {
    compile: compile
  };
}