angular.module('md.data.table').directive('mdColumnHeader', mdColumnHeader);

function mdColumnHeader($compile, $timeout) {
  'use strict';

  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls[0];
    var theadCtrl = ctrls[1];
    var template = angular.element('<th></th>');
      
    template.text('{{name}}');
    
    if(attrs.unit) {
      template.text(template.text() + ' ({{unit}})');
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
          return theadCtrl.order[0] === '-' ? 'down' : 'up';
        }
        return attrs.descendFirst ? 'down' : 'up';
      };
      
      scope.isActive = function () {
        return theadCtrl.order === scope.order || theadCtrl.order === '-' + scope.order;
      };
      
      scope.setOrder = function () {
        if(scope.isActive()) {
          theadCtrl.order = theadCtrl.order === scope.order ? '-' + scope.order : scope.order;
        } else {
          theadCtrl.order = angular.isDefined(attrs.descendFirst) ? '-' + scope.order : scope.order;
        }
        
        if(theadCtrl.pullTrigger) {
          $timeout(theadCtrl.pullTrigger);
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
    } else if(theadCtrl.isLastChild(template[0])) {
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

mdColumnHeader.$inject = ['$compile', '$timeout'];