angular.module('md.data.table').directive('mdColumnHeader', mdColumnHeader);

function mdColumnHeader($compile, $interpolate, $timeout) {
  'use strict';
  
  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls[0];
    var headCtrl = ctrls[1];
    var template = angular.element('<div></div>');
    
    template.text($interpolate.startSymbol() + 'name' + $interpolate.endSymbol());
    
    if(attrs.unit) {
      template.text(template.text() + ' (' + $interpolate.startSymbol() + 'unit' + $interpolate.endSymbol() + ')');
    }
    
    if(angular.isDefined(attrs.trim)) {
      template.contents().wrap('<div></div>');
    }
    
    if(attrs.orderBy) {
      var sortIcon = angular.element('<md-icon></md-icon>');
      
      var isActive = function () {
        return headCtrl.order === scope.order || headCtrl.order === '-' + scope.order;
      };
      
      var setOrder = function () {
        
        if(isActive()) {
          scope.$apply(headCtrl.order = headCtrl.order === scope.order ? '-' + scope.order : scope.order);
        } else {
          scope.$apply(headCtrl.order = angular.isDefined(attrs.descendFirst) ? '-' + scope.order : scope.order);
        }
        
        if(headCtrl.pullTrigger) {
          $timeout(headCtrl.pullTrigger);
        }
      };
      
      scope.getDirection = function () {
        if(isActive()) {
          return headCtrl.order[0] === '-' ? 'down' : 'up';
        }
        return angular.isDefined(attrs.descendFirst) ? 'down' : 'up';
      };
      
      sortIcon.attr('md-svg-icon', 'templates.arrow.html');
      sortIcon.attr('ng-class', 'getDirection()');
      
      if(angular.isDefined(attrs.numeric)) {
        template.prepend(sortIcon);
      } else {
        template.append(sortIcon);
      }
      
      element.on('click', setOrder);
      
      scope.$watch(isActive, function (active) {
        if(active) { element.addClass('md-active'); } else { element.removeClass('md-active'); }
      });
    }
    
    element.append($compile(template)(scope));
    
    if(headCtrl.isSignificant(element.parent())) {
      tableCtrl.setColumn(attrs);
      
      if(attrs.ngRepeat) {
        if(scope.$parent.$last) {
          tableCtrl.isReady.head.resolve();
        }
      } else if(tableCtrl.isLastChild(element.parent().children(), element[0])) {
        tableCtrl.isReady.head.resolve();
      }
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