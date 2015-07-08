angular.module('md.data.table')

.directive('mdDataTable', function () {
  'use strict';
  
  function compile(tElement, tAttrs) {
    var head = tElement.find('thead');
    var body = tElement.find('tbody');
    var foot = tElement.find('tfoot');
    
    // make sure the table has a head element
    if(!head.length) {
      head = tElement.find('tbody').eq(0);
      
      if(head.children().find('th').length) {
        head.replaceWith('<thead>' + head.html() + '</thead>');
      } else {
        throw new Error('mdDataTable', 'Expecting <thead></thead> element.');
      }
      
      head = tElement.find('thead');
      body = tElement.find('tbody');
    }
    
    // notify the children to begin work
    head.attr('md-table-head', '');
    body.attr('md-table-body', '');
    
    if(foot.length) {
      foot.attr('md-table-foot', '');
      
      if(tAttrs.mdRowSelect) {
        foot.find('tr').prepend('<td></td>');
      }
    }
    
    // log rudimentary warnings for the developer
    if(!body.children().attr('ng-repeat')) {
      if(tAttrs.mdRowSelect) {
        console.warn('Use ngRepeat to enable automatic row selection.');
      }
      if(head.attr('md-order')) {
        console.warn('Column ordering without ngRepeat is not supported by this directive.');
      }
    }
  }
  
  return {
    bindToController: {
      progress: '=mdProgress',
      selectedItems: '=mdRowSelect'
    },
    compile: compile,
    controller: 'mdDataTableController',
    controllerAs: 'tableCtrl',
    restrict: 'A',
    scope: {}
  };
})

.controller('mdDataTableController', ['$attrs', '$element', '$q', '$scope', function ($attrs, $element, $q, $scope) {
  'use strict';

  var self = this;

  if($attrs.mdRowSelect && !angular.isArray(self.selectedItems)) {
    self.selectedItems = [];
    // log warning for developer
    console.warn('md-row-select="' + $attrs.mdRowSelect + '" : ' +
    $attrs.mdRowSelect + ' is not defined as an array in your controller, ' +
    'i.e. ' + $attrs.mdRowSelect + ' = [], two-way data binding will fail.');
  }
  
  if($attrs.mdProgress) {
    $scope.$watch('tableCtrl.progress', function () {
      var deferred = self.defer();
      $q.when(self.progress)['finally'](deferred.resolve);
    });
  }

  self.columns = [];
  self.classes = [];
  self.repeatEnd = [];

  // support theming
  ['md-primary', 'md-hue-1', 'md-hue-2', 'md-hue-3'].forEach(function(mdClass) {
    if($element.hasClass(mdClass)) {
      self.classes.push(mdClass);
    }
  });

  self.defer = function () {
    if(self.deferred) {
      self.deferred.reject('cancel');
    } else {
      self.showProgress();
    }

    self.deferred = $q.defer();
    self.deferred.promise.then(self.resolve);

    return self.deferred;
  };

  self.resolve = function () {
    self.deferred = undefined;
    self.hideProgress();
  };
  
  self.repeatEnd.push(function (ngRepeat) {
    if(!self.listener && $attrs.mdRowSelect) {
      self.listener = $scope.$parent.$watch(ngRepeat.items, function (newValue, oldeValue) {
        if(newValue !== oldeValue) {
          self.selectedItems.splice(0);
        }
      });
    }
  });
  
  self.onRepeatEnd = function (ngRepeat) {
    self.repeatEnd.forEach(function (listener) {
      listener(ngRepeat);
    });
  };

  self.setColumns = function (cell) {
    if(!cell.attributes.numeric) {
      return self.columns.push({ isNumeric: false });
    }
    
    self.columns.push({
      isNumeric: true,
      unit: cell.attributes.unit ? cell.attributes.unit.value : undefined,
    });
  };

  angular.forEach($element.find('th'), self.setColumns);
}]);