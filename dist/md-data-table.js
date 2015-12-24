angular.module('md.data.table', ['md.table.templates']);

'use strict';

angular.module('md.data.table').directive('mdCell', mdCell);

function mdCell() {
  
  function compile(tElement) {
    tElement.find('md-select').attr('md-container-class', 'md-table-select');
    
    return postLink;
  }
  
  function Controller() {
    
  }
  
  function postLink(scope, element, attrs, ctrls) {
    var select = element.find('md-select');
    var cellCtrl = ctrls.shift();
    var tableCtrl = ctrls.shift();
    
    if(select.length || attrs.ngClick) {
      element.addClass('clickable').on('click', function (event) {
        event.stopPropagation();
        
        if(select.length) {
          select[0].click();
        }
      });
    }
    
    cellCtrl.getTable = tableCtrl.getElement;
    
    function getColumn() {
      return tableCtrl.columns[getIndex()];
    }
    
    function getIndex() {
      return Array.prototype.indexOf.call(element.parent().children(), element[0]);
    }
    
    scope.$watch(getColumn, function (column) {
      if(!column) {
        return;
      }
      
      if(column.numeric) {
        element.addClass('numeric');
      } else {
        element.removeClass('numeric');
      }
    });
  }
  
  return {
    controller: Controller,
    compile: compile,
    require: ['mdCell', '^^mdTable'],
    restrict: 'E'
  };
}

'use strict';

angular.module('md.data.table').directive('mdColumn', mdColumn);

function mdColumn($compile) {

  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls.shift();
    var headCtrl = ctrls.shift();
    
    function attachSortIcon() {
      var sortIcon = angular.element('<md-icon class="sort-icon">&#xE5D8;</md-icon>');
      
      $compile(sortIcon.attr('ng-class', 'getDirection()'))(scope);
      
      if(element.hasClass('numeric')) {
        element.prepend(sortIcon);
      } else {
        element.append(sortIcon);
      }
    }
    
    function detachSortIcon() {
      var icons = element.find('md-icon');
      
      for(var i = 0; i < icons.length; i++) {
        var icon = icons.eq(i);
        
        if(icon.hasClass('sort-icon')) {
          return icon.remove();
        }
      }
    }
    
    function disableSorting() {
      detachSortIcon();
      element.off('click', setOrder);
    }
    
    function enableSorting() {
      attachSortIcon();
      element.on('click', setOrder);
    }
    
    function getIndex() {
      return Array.prototype.indexOf.call(element.parent().children(), element[0]);
    }
    
    function isActive() {
      if(!scope.orderBy) {
        return false;
      }
      
      return headCtrl.order === scope.orderBy || headCtrl.order === '-' + scope.orderBy;
    }
    
    function isNumeric() {
      if(attrs.hasOwnProperty('mdNumeric') && attrs.mdNumeric === '') {
        return true;
      }
      
      return scope.numeric;
    }
    
    function setOrder() {
      scope.$applyAsync(function () {
        if(!isActive()) {
          headCtrl.order = scope.getDirection() === 'asc' ? scope.orderBy : '-' + scope.orderBy;
        } else {
          headCtrl.order = scope.getDirection() === 'asc' ? '-' + scope.orderBy : scope.orderBy;
        }
      });
    }
    
    function updateColumn(index, column) {
      tableCtrl.columns[index] = column;
      
      if(column.numeric) {
        element.addClass('numeric');
      } else {
        element.removeClass('numeric');
      }
    }
    
    scope.getDirection = function () {
      if(!isActive()) {
        return attrs.hasOwnProperty('mdDesc') ? 'desc' : 'asc';
      }
      
      return headCtrl.order === '-' + scope.orderBy ? 'desc' : 'asc';
    };
    
    scope.$watch(isActive, function (active) {
      if(active) {
        element.addClass('active');
      } else {
        element.removeClass('active');
      }
    });
    
    scope.$watch(getIndex, function (index) {
      updateColumn(index, {'numeric': isNumeric()});
    });
    
    scope.$watch(isNumeric, function (numeric) {
      updateColumn(getIndex(), {'numeric': numeric});
    });
    
    scope.$watch('orderBy', function (orderBy) {
      if(orderBy) {
        enableSorting();
      } else {
        disableSorting();
      }
    });
  }

  return {
    link: postLink,
    require: ['^^mdTable', '^^mdHead'],
    restrict: 'E',
    scope: {
      numeric: '=?mdNumeric',
      orderBy: '@?mdOrderBy'
    }
  };
}

mdColumn.$inject = ['$compile'];

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

'use strict';

angular.module('md.data.table').directive('mdHead', mdHead);

function mdHead($compile) {

  function Controller() {
    
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    
    function attachCheckbox() {
      var children = element.children();
      
      // append an empty cell to preceding rows
      for(var i = 0; i < children.length - 1; i++) {
        children.eq(i).prepend('<md-column></md-column>');
      }
      
      children.eq(children.length - 1).prepend(createCheckBox());
    }
    
    function createCheckBox() {
      var checkbox = angular.element('<md-checkbox></md-checkbox>');
      
      checkbox.attr('aria-label', 'Select All');
      checkbox.attr('ng-click', 'toggleAll()');
      checkbox.attr('ng-checked', 'allSelected()');
      
      return angular.element('<md-column>').append($compile(checkbox)(scope));
    }
    
    function every(callback) {
      for(var i = 0, rows = element.next().children(); i < rows.length; i++) {
        var row = rows.eq(i);
        
        if(!row.hasClass('ng-leave') && !callback(row, row.controller('mdSelect'))) {
          return false;
        }
      }
      
      return true;
    }
    
    function forEach(callback) {
      for(var i = 0, rows = element.next().children(); i < rows.length; i++) {
        var row = rows.eq(i);
        
        if(!row.hasClass('ng-leave')) {
          callback(row, row.controller('mdSelect'));
        }
      }
    }
    
    function removeCheckbox() {
      element.find('md-checkbox').parent().remove();
    }
    
    scope.allSelected = function () {
      return every(function (row, ctrl) {
        return ctrl.disabled || ctrl.isSelected();
      });
    };
    
    scope.selectAll = function () {
      forEach(function (row, ctrl) {
        if(!ctrl.isSelected()) {
          ctrl.select();
        }
      });
    };
    
    scope.toggleAll = function () {
      return scope.allSelected() ? scope.unSelectAll() : scope.selectAll();
    };
    
    scope.unSelectAll = function () {
      forEach(function (row, ctrl) {
        if(ctrl.isSelected()) {
          ctrl.deselect();
        }
      });
    };
    
    scope.$watch(tableCtrl.enableSelection, function (enableSelection) {
      if(enableSelection) {
        attachCheckbox();
      } else {
        removeCheckbox();
      }
    });
  }
  
  return {
    bindToController: true,
    controller: Controller,
    controllerAs: '$mdHead',
    link: postLink,
    require: '^^mdTable',
    restrict: 'E',
    scope: {
      order: '=?mdOrder'
    }
  };
}

mdHead.$inject = ['$compile'];

'use strict';

angular.module('md.data.table').directive('mdSelect', mdSelect);

function mdSelect($compile) {
  
  function Controller() {
    
  }
  
  function postLink(scope, element, attrs, ctrls) {
    var tableCtrl = ctrls.shift();
    var selectCtrl = ctrls.shift();
    
    selectCtrl.isSelected = function () {
      return selectCtrl.isEnabled && tableCtrl.selected.indexOf(selectCtrl.model) !== -1;
    };
    
    selectCtrl.select = function () {
      if(selectCtrl.disabled) {
        return;
      }
      
      tableCtrl.selected.push(selectCtrl.model);
      
      if(angular.isFunction(selectCtrl.onSelect)) {
        selectCtrl.onSelect(selectCtrl.model, tableCtrl.selected);
      }
    };
    
    selectCtrl.deselect = function () {
      tableCtrl.selected.splice(tableCtrl.selected.indexOf(selectCtrl.model), 1);
    };
    
    selectCtrl.toggle = function (event) {
      if(event && event.stopPropagation) {
        event.stopPropagation();
      }
      
      return selectCtrl.isSelected() ? selectCtrl.deselect() : selectCtrl.select();
    };
    
    function attachCheckbox() {
      element.prepend(createCheckbox());
    }
    
    function autoSelect(event) {
      scope.$applyAsync(function () {
        selectCtrl.toggle(event);
      });
    }
    
    function enableAutoSelect() {
      if(attrs.hasOwnProperty('mdAutoSelect') && attrs.mdAutoSelect === '') {
        return true;
      }
      
      return selectCtrl.autoSelect;
    }
    
    function disableSelection () {
      removeCheckbox();
      element.off('click', autoSelect);
    }
    
    function enableSelection() {
      attachCheckbox();
      
      if(enableAutoSelect()) {
        element.on('click', autoSelect);
      }
    }
    
    function createCheckbox() {
      var checkbox = angular.element('<md-checkbox></md-checkbox>');
      
      checkbox.attr('aria-label', 'Select Row');
      checkbox.attr('ng-click', '$mdSelect.toggle($event)');
      checkbox.attr('ng-checked', '$mdSelect.isSelected()');
      checkbox.attr('ng-disabled', '$mdSelect.disabled');
      
      return angular.element('<md-cell>').append($compile(checkbox)(scope));
    }
    
    function removeCheckbox() {
      element.find('md-checkbox').parent().remove();
    }
    
    scope.$watch(tableCtrl.enableSelection, function (enable) {
      selectCtrl.isEnabled = enable;
      
      if(selectCtrl.isEnabled) {
        enableSelection();
      } else {
        disableSelection();
      }
    });
    
    scope.$watch(selectCtrl.isSelected, function (selected) {
      return selected ? element.addClass('md-selected') : element.removeClass('md-selected');
    });
  }
  
  return {
    bindToController: true,
    controller: Controller,
    controllerAs: '$mdSelect',
    link: postLink,
    require: ['^^mdTable', 'mdSelect'],
    restrict: 'A',
    scope: {
      model: '=mdSelect',
      disabled: '=ngDisabled',
      onSelect: '=?mdOnSelect',
      autoSelect: '=mdAutoSelect'
    }
  };
}

mdSelect.$inject = ['$compile'];

'use strict';

angular.module('md.data.table').directive('mdTable', mdTable);
  
function mdTable() {
  
  function Controller($scope, $element, $attrs) {
    var self = this;
    
    self.columns = {};
    
    self.enableSelection = function () {
      if($attrs.hasOwnProperty('mdRowSelect') && $attrs.mdRowSelect === '') {
        return true;
      }
      
      return self.rowSelect;
    };
    
    self.getElement = function () {
      return $element;
    };
    
    // self.column = function (index, callback) {
    //   var rows = $element.find('md-row');
    //
    //   for(var i = 0; i < rows.length; i++) {
    //     callback(rows.eq(i).children().eq(index));
    //   }
    // };
    
    $scope.$watch(self.enableSelection, function (enable) {
      return enable ? $element.addClass('md-row-select') : $element.removeClass('md-row-select');
    });
  }
  
  Controller.$inject = ['$scope', '$element', '$attrs'];
  
  return {
    bindToController: true,
    controller: Controller,
    controllerAs: '$mdTable',
    restrict: 'E',
    scope: {
      selected: '=ngModel',
      rowSelect: '=mdRowSelect'
    }
  };
}

'use strict';

angular.module('md.data.table').directive('mdTablePagination', mdTablePagination);

function mdTablePagination() {
  
  function postLink(scope) {
    if(!scope.label) {
      scope.label = {
        0: 'Rows per page:',
        1: 'of'
      };
    }
    
    scope.hasNext = function () {
      return scope.page * scope.limit < scope.total;
    };
    
    scope.hasPrevious = function () {
      return scope.page > 1;
    };
    
    scope.max = function () {
      return scope.hasNext() ? scope.page * scope.limit : scope.total;
    };
    
    scope.min = function () {
      return scope.page * scope.limit - scope.limit;
    };
    
    scope.next = function () {
      scope.page++;
    };
    
    scope.previous = function () {
      scope.page--;
    };
    
    scope.$watch('limit', function () {
      if(scope.limit * scope.page > scope.max() && scope.hasPrevious()) {
        scope.previous();
      }
    });
  }
  
  return {
    link: postLink,
    restrict: 'E',
    scope: {
      // boundaryLinks: '=?mdBoundaryLinks',
      label: '=?mdLabel',
      limit: '=mdLimit',
      page: '=mdPage',
      // pageSelect: '=?mdPageSelect',
      options: '=mdOptions',
      total: '@mdTotal'
    },
    templateUrl: 'md-table-pagination.html'
  };
}

angular.module('md.table.templates', ['md-table-pagination.html']);

angular.module('md-table-pagination.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('md-table-pagination.html',
    '<!-- <span class="label shrink" ng-if="pageSelect">{{paginationLabel.page}}</span>\n' +
    '\n' +
    '<md-select ng-if="pageSelect" ng-model="page" md-container-class="md-pagination-select" ng-change="onPageChange()" aria-label="Page Number">\n' +
    '  <md-option ng-repeat="num in pages track by $index" ng-value="$index + 1">{{$index + 1}}</md-option>\n' +
    '</md-select> -->\n' +
    '\n' +
    '<span class="label">{{label[0]}}</span>\n' +
    '\n' +
    '<md-select ng-model="limit" md-container-class="md-pagination-select" ng-change="onLimitChange()" aria-label="Rows" placeholder="{{options ? options[0] : 5}}">\n' +
    '  <md-option ng-repeat="rows in options ? options : [5, 10, 15]" ng-value="rows">{{rows}}</md-option>\n' +
    '</md-select>\n' +
    '\n' +
    '<span class="label">{{min() + 1}} - {{max()}} {{label[1]}} {{total}}</span>\n' +
    '\n' +
    '<!-- <md-button class="md-icon-button" type="button" ng-if="boundaryLinks" ng-click="first()" ng-disabled="!hasPrevious()" aria-label="First">\n' +
    '  <md-icon>&#xE045;</md-icon>\n' +
    '</md-button> -->\n' +
    '<md-button class="md-icon-button" type="button" ng-click="previous()" ng-disabled="!hasPrevious()" aria-label="Previous">\n' +
    '  <md-icon>&#xE408;</md-icon>\n' +
    '</md-button>\n' +
    '<md-button class="md-icon-button" type="button" ng-click="next()" ng-disabled="!hasNext()" aria-label="Next">\n' +
    '  <md-icon>&#xE409;</md-icon>\n' +
    '</md-button>\n' +
    '<!-- <md-button class="md-icon-button" type="button" ng-if="boundaryLinks" ng-click="last()" ng-disabled="!hasNext()" aria-label="Last">\n' +
    '  <md-icon>&#xE044;</md-icon>\n' +
    '</md-button> -->');
}]);
