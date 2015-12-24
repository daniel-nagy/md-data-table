'use strict';

angular.module('md.data.table').factory('$mdEditDialog', $mdEditDialog);
  
function $mdEditDialog($compile, $controller, $document, $mdUtil, $q, $rootScope, $templateCache, $templateRequest, $window) {
  var self = this;
  var body = angular.element($document.prop('body'));
  
  /*
   * event
   * locals
   * resolves
   * scope
   * template
   * templateUrl
   */
  var defaultOptions = {
    clickOutsideToClose: true,
    disableScroll: true,
    escToClose: true,
    focusOnOpen: true
  };
  
  function build(template, options) {
    var scope = options.scope || $rootScope.$new();
    var element = $compile(template)(scope);
    var backdrop = $mdUtil.createBackdrop(scope, 'md-edit-dialog-backdrop');
    
    if(options.controller) {
      var inject = angular.extend({$element: element, $scope: scope}, options.locals);
      var controller = $controller(options.controller, inject);
    }
    
    var restoreScroll;
    
    if(options.disableScroll) {
      restoreScroll = $mdUtil.disableScrollAround(element, body);
    }
    
    body.prepend(backdrop).append(element.addClass('md-whiteframe-1dp'));
    
    positionDialog(element, options.targetEvent.target);
    
    if(options.focusOnOpen) {
      var autofocus = $mdUtil.findFocusTarget(element);
      
      if(autofocus) {
        autofocus.focus();
      }
    }
    
    element.on('$destroy', function () {
      backdrop.remove();
      
      if(angular.isFunction(restoreScroll)) {
        restoreScroll();
      }
    });
    
    backdrop.on('click', function () {
      element.remove();
    });
  }
  
  function Controller($element, $q, save, $scope) {
    
    function update(model) {
      if($scope.editDialog.$invalid) {
        return $q.reject();
      }
      
      if(angular.isFunction(save)) {
        return $q.when(save(model));
      }
      
      return $q.resolve(model);
    }
    
    $scope.dismiss = function () {
      $element.remove();
    };
    
    $scope.submit = function (model) {
      update(model).then(function () {
        $scope.dismiss();
      });
    };
  }
  
  function getTemplate(options) {
    return $q(function (resolve, reject) {
      var template = options.template;
      
      function illegalType(type) {
        reject('Unexpected template value. Epected a string; recieved a ' + type + '.');
      }
      
      if(template) {
        return angular.isString(template) ? resolve(template) : illegalType(typeof template);
      }
      
      if(options.templateUrl) {
        template = $templateCache.get(options.templateUrl);
        
        if(template) {
          return resolve(template);
        }
        
        var success = function (template) {
          return resolve(template);
        };
        
        var error = function () {
          return reject('Error retrieving template from URL.');
        };
        
        return $templateRequest(options.templateUrl).then(success, error);
      }
      
      reject('Template not provided.');
    });
  }
  
  function positionDialog(element, target) {
    var table = angular.element(target).controller('mdCell').getTable();
    
    var getHeight = function () {
      return element.prop('clientHeight');
    };
    
    var getSize = function () {
      return {
        width: element.prop('clientWidth'),
        height: element.prop('clientHeight')
      };
    };
    
    var getWidth = function () {
      return element.prop('clientWidth');
    };
    
    var getTableBounds = function () {
      var parent = table.parent();
      
      if(parent.prop('tagName') === 'MD-TABLE-CONTAINER') {
        return parent[0].getBoundingClientRect();
      } else {
        return table[0].getBoundingClientRect();
      }
    }
    
    var reposition = function () {
      var size = getSize();
      var cellBounds = target.getBoundingClientRect();
      var tableBounds = getTableBounds();
      
      if(size.width > tableBounds.right - cellBounds.left) {
        element.css('left', tableBounds.right - size.width + 'px');
      } else {
        element.css('left', cellBounds.left + 'px');
      }
      
      if(size.height > tableBounds.bottom - cellBounds.top) {
        element.css('top', tableBounds.bottom - size.height + 'px');
      } else {
        element.css('top', cellBounds.top + 1 + 'px');
      }
      
      element.css('minWidth', cellBounds.width + 'px');
    };
    
    var watchWidth = $rootScope.$watch(getWidth, reposition);
    var watchHeight = $rootScope.$watch(getHeight, reposition);
    
    $window.addEventListener('resize', reposition);
    
    element.on('$destroy', function () {
      watchWidth();
      watchHeight();
      
      $window.removeEventListener('resize', reposition);
    });
  }
  
  function preset(size, options) {
    
    function getAttrs() {
      var attrs = 'type="' + options.type ? options.type : 'text' + '"';
      
      for(var attr in options.validators) {
        attrs += ' ' + attr + '="' + options.validators[attr] + '"';
      }
      
      return attrs;
    }
    
    return {
      controller: Controller,
      locals: {
        $q: $q,
        save: options.save
      },
      scope: angular.extend($rootScope.$new(), {
        cancel: options.cancel || 'Cancel',
        messages: options.messages,
        model: options.modelValue,
        ok: options.ok || 'Save',
        placeholder: options.placeholder,
        title: options.title,
        size: size
      }),
      template:
        '<md-edit-dialog>' +
          '<div layout="column" class="content">' +
            '<div ng-if="size === \'large\'" class="md-title">{{title || \'Edit\'}}</div>' +
            '<form name="editDialog" layout="column" ng-submit="submit(model)">' +
              '<md-input-container md-no-float>' +
                '<input name="input" ng-model="model" md-autofocus placeholder="{{placeholder}} "' + getAttrs() + '>' +
                '<div ng-messages="editDialog.input.$error">' +
                  '<div ng-repeat="(key, message) in messages" ng-message="{{key}}">{{message}}</div>' +
                '</div>' +
              '</md-input-container>' +
            '</form>' +
          '</div>' +
          '<div ng-if="size === \'large\'" layout="row" layout-align="end" class="actions">' +
            '<md-button class="md-primary" ng-click="dismiss()">{{cancel}}</md-button>' +
            '<md-button class="md-primary" ng-click="submit(model)">{{ok}}</md-button>' +
          '</div>' +
        '</md-edit-dialog>'
    };
  }
  
  self.show = function (options) {
    options = angular.extend({}, defaultOptions, options);
    
    if(!options.targetEvent) {
      return console.error('options.targetEvent is required to align the dialog with the table cell.');
    }
    
    if(options.targetEvent.target.tagName !== 'MD-CELL') {
      return console.error('The event target must be a table cell.');
    }
    
    var promise = getTemplate(options);
    
    promise.then(function (template) {
      build(template, options);
    });
    
    promise['catch'](function (error) {
      console.error(error);
    });
  };
  
  self.small = function (options) {
    self.show(angular.extend({}, options, preset('small', options)));
  };
  
  self.large = function (options) {
    self.show(angular.extend({}, options, preset('large', options)));
  };
  
  return self;
}

$mdEditDialog.$inject = ['$compile', '$controller', '$document', '$mdUtil', '$q', '$rootScope', '$templateCache', '$templateRequest', '$window'];