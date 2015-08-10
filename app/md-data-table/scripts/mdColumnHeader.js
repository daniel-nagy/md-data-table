angular.module('md.data.table').directive('mdColumnHeader', mdColumnHeader);

function mdColumnHeader($compile, $interpolate, $timeout) {
  'use strict';

  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls[0];
    var headCtrl = ctrls[1];
    var template = angular.element('<th></th>');
    
    template.text($interpolate.startSymbol() +'name' + $interpolate.endSymbol());
    
    if(attrs.unit) {
      template.text(template.text() + ' (' + $interpolate.startSymbol() + 'unit' + $interpolate.endSymbol() + ')');
    }
    
    if(angular.isDefined(attrs.numeric)){
      template.addClass('numeric');
    }
    
    if(angular.isDefined(attrs.trim)) {
      template.addClass('trim').contents().wrap('<div></div>');
    }
    
    if(attrs.orderBy) {
      var sortIcon = angular.element('<md-icon></md-icon>');
      
      if(angular.isDefined(attrs.numeric)) {
        template.prepend(sortIcon);
      } else {
        template.append(sortIcon);
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
          headCtrl.order = angular.isDefined(attrs.descendFirst) ? '-' + scope.order : scope.order;
        }
        
        if(headCtrl.pullTrigger) {
          $timeout(headCtrl.pullTrigger);
        }
      };
      
      sortIcon.attr('md-svg-icon', 'templates.arrow.html');
      sortIcon.attr('ng-class', 'getDirection()');
      template.addClass('order');
      template.attr('ng-click', 'setOrder()');
      template.attr('ng-class', '{\'md-active\': isActive()}');
    }
    
    template.html('<div>' + template.html() + '</div>');
    
    element.replaceWith($compile(template)(scope));
    
    tableCtrl.setColumn(attrs);
    
    if(attrs.ngRepeat) {
      if(scope.$parent.$last) {
        tableCtrl.isReady.head.resolve();
      }
    } else if(tableCtrl.isLastChild(template.parent().children(), template[0])) {
      tableCtrl.isReady.head.resolve();
    }
  }

  return {
    link: postLink,
    require: ['^^mdDataTable', '^mdTableHead'],
    scope: {
      name: '@',
      order: '@orderBy',
      unit: '@'
    }
  };
}

mdColumnHeader.$inject = ['$compile', '$interpolate', '$timeout'];