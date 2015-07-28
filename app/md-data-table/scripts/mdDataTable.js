angular.module('md.data.table')
  .directive('mdDataTable', mdDataTable)
  .controller('mdDataTableCtrl', mdDataTableCtrl);

function mdDataTable() {
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
    controller: 'mdDataTableCtrl',
    controllerAs: 'tableCtrl',
    restrict: 'A',
    scope: {}
  };
}

function mdDataTableCtrl($attrs, $element, $q, $scope) {
  'use strict';

  var self = this;
  
  self.columns = [];
  self.classes = [];
  self.isReady = {
    body: $q.defer(),
    head: $q.defer()
  };

  if($attrs.mdRowSelect) {
    self.columns.push({ isNumeric: false });
    
    if(!angular.isArray(self.selectedItems)) {
      self.selectedItems = [];
      // log warning for developer
      console.warn('md-row-select="' + $attrs.mdRowSelect + '" : ' +
      $attrs.mdRowSelect + ' is not defined as an array in your controller, ' +
      'i.e. ' + $attrs.mdRowSelect + ' = [], two-way data binding will fail.');
    }
  }
  
  if($attrs.mdProgress) {
    $scope.$watch('tableCtrl.progress', function () {
      var deferred = self.defer();
      $q.when(self.progress)['finally'](deferred.resolve);
    });
  }

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

  self.isReady.body.promise.then(function (ngRepeat) {
    if($attrs.mdRowSelect) {
      self.listener = $scope.$parent.$watch(ngRepeat.items, function (newValue, oldeValue) {
        if(newValue !== oldeValue) {
          self.selectedItems.splice(0);
        }
      });
    }
  });

  self.setColumn = function (column) {
    if(angular.isDefined(column.numeric)) {
      return self.columns.push({
        isNumeric: true,
        unit: column.unit || undefined,
      });
    }
    
    self.columns.push({ isNumeric: false });
  };
}

mdDataTableCtrl.$inject = ['$attrs', '$element', '$q', '$scope'];