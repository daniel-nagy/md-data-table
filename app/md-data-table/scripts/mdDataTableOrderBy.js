angular.module('md.data.table').directive('orderBy', ['$interpolate', '$timeout', function ($interpolate, $timeout) {
  'use strict';

  function template(tElement) {
    return '<th ng-click="setOrder()" ng-class="{\'md-active\': isActive()}">' + tElement.html() + '</th>';
  }

  function postLink(scope, element, attrs, headCtrl) {
    
    if(angular.isDefined(attrs.descendFirst)) {
      attrs.$set('descendFirst', true);
    }

    if(element.text().match(/{{[^}]+}}/)) {
      var text = $interpolate('\'' + element.text() + '\'')(scope.$parent);
      var trim = element.find('trim');

      if(trim.length) {
        trim.text(text.slice(1, -1));
      } else if(angular.isDefined(attrs.numeric)) {
        element.find('div').append(text.slice(1, -1));
      } else {
        element.find('div').prepend(text.slice(1, -1));
      }
    }

    scope.getDirection = function () {
      if(scope.isActive()) {
        return headCtrl.order[0] === '-' ? 'down' : 'up';
      }
      return attrs.descendFirst ? 'down' : 'up';
    };

    scope.isActive = function () {
      return headCtrl.order === scope.order || headCtrl.order === '-' + scope.order;
    };

    scope.setOrder = function () {
      if(scope.isActive()) {
        headCtrl.order = headCtrl.order === scope.order ? '-' + scope.order : scope.order;
      } else {
        headCtrl.order = attrs.descendFirst ? '-' + scope.order : scope.order;
      }
      
      if(headCtrl.pullTrigger) {
        $timeout(headCtrl.pullTrigger);
      }
    };
  }

  function compile(tElement, tAttrs) {
    var sortIcon = angular.element('<md-icon></md-icon>');

    sortIcon.attr('md-svg-icon', 'templates.arrow.html');
    sortIcon.attr('ng-class', 'getDirection()');

    if(angular.isDefined(tAttrs.numeric)) {
      tElement.prepend(sortIcon);
    } else {
      tElement.append(sortIcon);
    }

    tElement.html('<div>' + tElement.html() + '</div>');

    return postLink;
  }

  return {
    compile: compile,
    replace: true,
    require: '^mdTableHead',
    restrict: 'A',
    scope: {
      order: '@orderBy'
    },
    template: template
  };
}]);