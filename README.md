# Material Design Data Table

This module is an effort to implement Material Design data tables in [Angular Material](https://material.angularjs.org/latest/#/). Data tables are used to present raw data sets and usually appear in desktop enterprise applications. Data tables are particularly useful for visualizing and manipulating large data sets.

Specification for Material Design data tables can be found [here](http://www.google.com/design/spec/components/data-tables.html).

* [License](#license)
* [Demo](#demo)
* [Installation](#installation)
* [Usage](#usage)
* [Change Log](#change-log)
* [API Documentation](#api-documentation)
* [Contributing] (#contributing)

## License

This software is provided free of charge and without restriction under the [MIT License](LICENSE.md)

## Demo

A live [demo](http://danielnagy.me/md-data-table).

A fork-able [Codepen](http://codepen.io/anon/pen/YwGJVr?editors=101). Please use this to reproduce any issues you may be experiencing.

## Installation

#### Using Bower

This package is installable through the Bower package manager.

```
bower install angular-material-data-table --save
```

In your `index.html` file, include the data table module and style sheet.

```html
<!-- style sheet -->
<link href="bower_components/angular-material-data-table/dist/md-data-table.min.css" rel="stylesheet" type="text/css"/>
<!-- module -->
<script type="text/javascript" src="bower_components/angular-material-data-table/dist/md-data-table.min.js"></script>
```

Include the `md.data.table` module as a dependency in your application.

```javascript
angular.module('myApp', ['ngMaterial', 'md.data.table']);
```

#### Using npm and Browserify (or JSPM)

In addition, this package may be installed using npm.

```
npm install angular-material-data-table --save
```

You may use Browserify to inject this module into your application.

```javascript
angular.module('myApp', [require('angular-material-data-table')]);
```

## Usage

**Example Controller**

```javascript

// Assume we have a $nutrition service that provides an API for communicating with the server

angular.module('demoApp').controller('sampleController', ['$nutrition', '$scope', function ($nutrition, $scope) {
  'use strict';
  
  $scope.selected = [];
  
  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  
  function getDesserts(query) {
    $scope.promise = $nutrition.desserts.get(query, success).$promise;
  }
  
  function success(desserts) {
    $scope.desserts = desserts;
  }
  
  $scope.onPaginate = function (page, limit) {
    getDesserts(angular.extend({}, $scope.query, {page: page, limit: limit}));
  };
  
  $scope.onReorder = function (order) {
    getDesserts(angular.extend({}, $scope.query, {order: order}));
  };

}]);
```

**Example Template**

```html
<md-toolbar class="md-table-toolbar md-default">
  <div class="md-toolbar-tools">
    <span>Nutrition</span>
  </div>
</md-toolbar>

<!-- exact table from live demo -->
<md-table-container>
  <table md-table md-row-select ng-model="selected" md-progress="promise">
    <thead md-head md-order="query.order" md-on-reorder="onReorder">
      <tr md-row>
        <th md-column md-order-by="nameToLower"><span>Dessert (100g serving)</span></th>
        <th md-column md-numeric md-order-by="calories.value"><span>Calories</span></th>
        <th md-column md-numeric>Fat (g)</th>
        <th md-column md-numeric>Carbs (g)</th>
        <th md-column md-numeric>Protein (g)</th>
        <th md-column md-numeric>Sodium (mg)</th>
        <th md-column md-numeric>Calcium (%)</th>
        <th md-column md-numeric>Iron (%)</th>
      </tr>
    </thead>
    <tbody md-body>
      <tr md-row md-select="dessert" md-select-id="{{dessert.name}}" md-auto-select ng-repeat="dessert in desserts.data">
        <td md-cell>{{dessert.name}}</td>
        <td md-cell>{{dessert.calories.value}}</td>
        <td md-cell>{{dessert.fat.value | number: 1}}</td>
        <td md-cell>{{dessert.carbs.value}}</td>
        <td md-cell>{{dessert.protein.value | number: 1}}</td>
        <td md-cell>{{dessert.sodium.value}}</td>
        <td md-cell>{{dessert.calcium.value}}{{dessert.calcium.unit}}</td>
        <td md-cell>{{dessert.iron.value}}{{dessert.iron.unit}}</td>
      </tr>
    </tbody>
  </table>
</md-table-container>

<md-table-pagination md-limit="query.limit" md-page="query.page" md-total="{{desserts.count}}" md-on-paginate="onPaginate" md-page-select></md-table-pagination>

```

## Change Log

#### Version 0.9.9
###### January 19, 2016

* The `md.table.templates` module is now defined before the `md.data.table` module to fix issue [#252](https://github.com/daniel-nagy/md-data-table/issues/252).
* Minor changes to selection logic concerning disabled rows.

#### Version 0.9.8
###### January 14, 2016

People with large datasets have been reporting that the pagination page selector negatively effects performance even when not enabled. This patch uses `ng-if` instead of `ng-show` to add or remove the page selector from the template. This should improve performance when the page selector is not enabled.

#### Version 0.9.7
###### January 8, 2016

Fix for issue [#237](https://github.com/daniel-nagy/md-data-table/issues/237).

#### Version 0.9.6
###### January 6, 2016

Removing the restriction that all rows must be selectable when row selection is enabled. There are some valid use cases for this. An empty cell will be prepended to a row that is not selectable to offset the checkbox.

#### Version 0.9.5
###### January 4, 2016

Merge pull request #230 from [@pdore-netfore](https://github.com/pdore-netfore) to use `currentTarget` instead of `target`.

#### Version 0.9.4
###### December 30, 2015

So I kinda changed row selection again... we're back to using arrays :stuck_out_tongue_closed_eyes:. The `mdTable` directive now has a hash table and will watch the model for changes. The `mdSelect` directive will register a callback to the `mdTable` directive for when items are added or removed. The `mdTable` directive will notify the `mdSelect` directive and the `mdSelect` directive will update the hash table in the `mdTable` directive. You can now add and remove items with unique identifiers to the model and the directive will pick up on these changes.

Another benefit is the `mdSelect` directive can now update the `mdTable` model if its own model is not a reference to the selected item. Therefore, what the user sees in the table will always be the same as the selected item.

#### Version 0.9.3
###### December 29, 2015

* A little bit of validation in the pagination directive to avoid things like divide by zero.

#### Version 0.9.2
###### December 28, 2015

* Wrap module in self executing function to prevent polluting the global namespace.
* Pagination will now calculate the closest multiple when the limit changes.

```javascript
let page  = 5;
let limit = 5;
let min   = page * limit - limit; // 20
```

Now say the user changes the limit from `5` to `10`, then the new page will be `3` and the new min will `20`. Same as the old min. This is because `5` and `10` are both multiples of `20`.

```javascript
let oldMin   = 20;
let newLimit = 10;
let newPage  = Math.floor(oldMin + newLimit) / newLimit; // 3
```

Now suppose the user changes the limit from `10` to `15`. Observe that `15` is not a multiple of `20`. Therefore we will end up with the closest multiple. The new page will be `2` and the new min will be `15`.

#### Version 0.9.1
###### December 28, 2015

The way the row ID feature was implemented made it difficult for the developer to manipulate the selected items from within their controller. In addition, the deselect event wasn't ideal because it would be impossible to communicate directly with one table if you had many tables that all shared a parent scope.

* The `md.table.deselect` event has been removed.
* If you specify a row ID using the `md-select-id` attribute then you must use an object model. When an item is selected, a new property will be defined on the model where the property name is the value of the `md-select-id` attribute and the value is the selected item.
* I've added a deselect event to the `md-row` element.

#### Version 0.9.0
###### December 27, 2015

Version 0.9.0 is a **HUGE** update. Most of the module has been rewritten to hopefully fix many issues people have been experiencing. In addition, there are a few new features in version 0.9.0 including edit dialogs!!

**Breaking Changes**

Although the module experienced an overhaul under the hood, most of the syntax has remained the same. A few things worth mentioning:

* Some of the attributes have been renamed.
* At the very least each element requires a designated attribute, e.g. `md-table`, `md-head`, `md-body`, `md-row`, `md-column`, `md-cell`.
* A table is no longer required to have a header, in fact many of the components are now isolate from one another and all components have their own isolated scope.
* Row selection is now completely independent of `ng-repeat`.
* Row selection can now be toggled on or off. In fact most features can be toggled on or off at anytime.
* It is now possible to have selected items persist between page changes, even for items paginated on the server. See [Row Selection](#row-selection) for an explanation of row selection behavior.
* Returning a promise from a callback will no longer show a progress indicator. All promises should be passed to the `md-progress` attribute. This is to isolate the `mdTablePagination` directive since it is not a descendent of the `mdTable` directive.
* You are now free to put whatever you want in column headers, including icons! The cost, however, is the trim functionality is no longer available.
* The `unit` and `show-unit` attributes are gone. They were mostly pointless.
* Boundary links for pagination are now disabled by default but can be enable with an attribute.

**New Features**

* The biggest new feature is edit dialogs. Edit dialogs are available through a service and come with presets for small and large dialogs. Edit dialogs and the features they provide will be explored in detail in the API section.
* Pagination now has a page selector that can be enable with an attribute, making it possible to jump directly to an arbitrary page.
* There is now an 'on select' event callback.
* An individual item, or all items, can be deselected by broadcasting an event.

**Bug Fixes**

* I've removed the `.js` extension from `require('./dist/md-data-table.min');` in `index.js` and have confirmed that it still works with Browserify so it should work with JSPM now.
* Various scoping issues should be fixed now because each directive has an isolated scope.
* Issues with `ng-repeat` should be fixed now because the directive is independent of `ng-repeat`.
* The directive no longer consumes the `ng-click` directive on table rows when auto select is enabled so you are free to use it.

If this version has resolved your issue can you please close it.

**Why Not?**

> Why not use a custom attribute for each element if you already require a designated attribute for each element?

CSS tables lack `colspan` functionality, this is reason alone to not use CSS tables.

> Why not replace the custom element with the semantically correct element and transclude its contents?

A few reasons:

1. The replace feature is deprecated.
2. You lose the ability to modify the element during the compile phase.
3. Performance.

For documentation on versions prior to 0.9.0 please reference the [legacy](https://github.com/daniel-nagy/md-data-table/tree/legacy) branch.

## API Documentation

* [Column Sorting](#column-sorting)
* [Edit Dialogs](#edit-dialogs)
* [Inline Menus](#inline-menus)
* [Numeric Columns](#numeric-columns)
* [Pagination](#pagination)
* [Row Selection](#row-selection)
* [Table Progress] (#table-progress)
* [Table Toolbars](#table-toolbars)

> I will be camelCasing attributes in tables so they do not wrap and are easier to read but don't forget to snake-case them in your template.

### Column Sorting

| Attribute      | Element    | Type       | Description |
| :------------- | :--------- | :--------- | :---------- |
| `mdOrder`      | `mdHead`   | `string`   | A variable to bind the sort order to. |
| `mdOnReorder`  | `mdHead`   | `function` | A callback function for when the order changes. The callback will receive the new order. |
| `mdOrderBy`    | `mdColumn` | `string`   | The value to bind to the sort order. |
| `mdDesc`       | `mdColumn` | `null`     | If present, the column will sort descending first. The default is to sort ascending first. |

When the user clicks the `md-column` element, the value of the `md-order-by` attribute will be bound to the variable provided to the `md-order` attribute on the `md-head` element. If the columns are already sorted by that value, a minus sign `-` will be prepended to the value. For most query languages, this is the universal symbol to sort descending.

The variable can then be used to send a query to the server, or bound to the `orderBy` property of an `ng-repeat` expression.

> It is important to know that the callback expression will be executed before the next digest cycle, meaning your local scope variable will still have the old value.

**Example Using ngRepeat**

```html
<md-table-container>
  <table md-table>
    <thead md-head md-order="myOrder">
      <!-- when the user clicks this cell, the myOrder variable will get the value 'nameToLower' -->
      <th md-column md-order-by="nameToLower">Dessert (100g serving)</th>
      <!-- the variable myOrder will not be changed when this cell is clicked -->
      <th md-column md-numeric>Calories</th>
    </thead>
    <tbody md-body>
      <!-- we can let ng-repeat sort the columns for us -->
      <tr ng-repeat="dessert in desserts | orderBy: myOrder"></tr>
    </tbody>
  </table>
</md-table-container>
```

### Edit Dialogs

Tables may require basic text editing. This module includes a service for displaying edit dialogs to modify text or anything else really. The service provides presets for both small and large edit dialogs designed for manipulating text. It also has full support for creating custom dialogs so you can be as creative as you want to be.

Unlike Angular Material dialogs, the preset methods will open the dialog.

**Restrictions**

* The dialog will always receive a new isolated scope.
* You must provide a `targetEvent` and the event target must be a table cell.

**Example**

```javascript
$scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();
  
  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */
   
  var promise = $mdEditDialog.small({
    // messages: {
    //   test: 'I don\'t like tests!'
    // },
    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
      dessert.comment = input.$modelValue;
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });

  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
});
```

#### Small Edit Dialogs

```javascript
$mdEditDialog.small(options);
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| options   | object | Small preset options. |

| Property              | Type       | Default  | Description |
| :-------------------- | :--------- | :------- | :---------- |
| `clickOutsideToClose` | `bool`     | `true`   | The user can dismiss the dialog by clicking anywhere else on the page. |
| `disableScroll`       | `bool`     | `true`   | Prevent user scroll while the dialog is open. |
| `escToClose`          | `bool`     | `true`   | The user can dismiss the dialog by clicking the esc key. |
| `focusOnOpen`         | `bool`     | `true`   | Will search the template for an `md-autofocus` element. |
| `messages`            | `object`   | `null`   | Error messages to display corresponding to errors on the `ngModelController`. |
| `modelValue`          | `string`   | `null`   | The initial value of the input element. |
| `placeholder`         | `string`   | `null`   | Placeholder text for input element. |
| `save`                | `function` | `null`   | A callback function for when the use clicks the save button. The callback will receive the [ngModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController). The dialog will close unless the callback returns a rejected promise. |
| `targetEvent`         | `event`    | `null`   | The event object. This must be provided and it must be from a table cell. |
| `type`                | `string`   | `"text"` | The value of the `type` attribute on the `input` element. |
| `validators`          | `object`   | `null`   | Optional attributes to be placed on the input element. |

The `small` method will return a `promise` that will resolve with the controller instance. The controller has two public methods, `dismiss` which will close the dialog without saving and `getInput` which will return the `ngModelController`.

#### Large Edit Dialogs

Large edit dialogs are functionally identical to small edit dialogs but have a few additional options.

```javascript
$mdEditDialog.large(options);
```
| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| options   | object | Large preset options. |

| Property              | Type       | Default    | Description |
| :-------------------- | :--------- | :--------- | :---------- |
| `cancel`              | `string`   | `"Cancel"` | Text to dismiss the dialog without saving. |
| `clickOutsideToClose` | `bool`     | `true`     | The user can dismiss the dialog by clicking anywhere else on the page. |
| `disableScroll`       | `bool`     | `true`     | Prevent user scroll while the dialog is open. |
| `escToClose`          | `bool`     | `true`     | The user can dismiss the dialog by clicking the esc key. |
| `focusOnOpen`         | `bool`     | `true`     | Will search the template for an `md-autofocus` element. |
| `messages`            | `object`   | `null`     | Error messages to display corresponding to errors on the `ngModelController`. |
| `modelValue`          | `string`   | `null`     | The initial value of the input element. |
| `ok`                  | `string`   | `"Save"`   | Text to submit and dismiss the dialog. |
| `placeholder`         | `string`   | `null`     | Placeholder text for input element. |
| `save`                | `function` | `null`     | A callback function for when the use clicks the save button. The callback will receive the `ngModelController`. The dialog will close unless the callback returns a rejected promise. |
| `targetEvent`         | `event`    | `null`     | The event object. This must be provided and it must be from a table cell. |
| `title`               | `string`   | `"Edit"`   | Dialog title text. |
| `type`                | `string`   | `"text"`   | The value of the `type` attribute on the `input` element. |
| `validators`          | `object`   | `null`     | Optional attributes to be placed on the input element. |

The `large` method will return a `promise` that will resolve with the controller instance. The controller has two public methods, `dismiss` which will close the dialog without saving and `getInput` which will return the `ngModelController`.

#### Roll Your Own

```javascript
$mdEditDialog.show(options);
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| options   | object | Dialog options. |

| Property              | Type              | Default | Description |
| :-------------------- | :---------------- | :------ | :---------- |
| `bindToController`    | `bool`            | `false` | If true, properties on the provided scope object will be bound to the controller |
| `clickOutsideToClose` | `bool`            | `true`  | The user can dismiss the dialog by clicking anywhere else on the page. |
| `controller`          | `function|string` | `null`  | Either a constructor function or a string register with the $controller service. The controller will be automatically injected with `$scope` and `$element`. Remember to annotate your controller if you will be minifying your code. |
| `controllerAs`        | `string`          | `null`  | An alias to publish your controller on the scope. |
| `disableScroll`       | `bool`            | `true`  | Prevent user scroll while the dialog is open. |
| `escToClose`          | `bool`            | `true`  | The user can dismiss the dialog by clicking the esc key. |
| `focusOnOpen`         | `bool`            | `true`  | Will search the template for an `md-autofocus` element. |
| `locals`              | `object`          | `null`  | Optional dependancies to be injected into your controller. It is not necessary to inject registered services, the `$injector` will provide them for you. |
| `resolve`             | `object`          | `null`  | Similar to locals but waits for promises to be resolved. Once the promises resolve, their return value will be injected into the controller and the dialog will open. |
| `scope`               | `object`          | `null`  | Properties to bind to the new isolated scope. |
| `targetEvent`         | `event`           | `null`  | The event object. This must be provided and it must be from a table cell. |
| `template`            | `string`          | `null`  | The template for your dialog. |
| `templateUrl`         | `string`          | `null`  | A URL to fetch your template from. |

The `show` method will return a `promise` that will resolve with the controller instance.

Table cells have a `md-placeholder` CSS class that you can use for placeholder text.

**Example: A Table Cell That Opens An Edit Dialog**

```html
<td md-cell ng-click="editComment($event, dessert)" ng-class="{'md-placeholder': !dessert.comment}">
  {{dessert.comment || 'Add a comment'}}
</td>
```

### Inline Menus

Table cells support inline menus. To use an inline menu, place an `md-select` element inside an `md-cell` element.

**Example**

```html
<td md-cell>
  <md-select ng-model="dessert.type" placeholder="Other">
    <md-option ng-value="type" ng-repeat="type in getTypes()">{{type}}</md-option>
  </md-select>
</td>
```

Clicking anywhere in the cell will activate the menu. In addition, if you have automatic row selection enabled the row will not be selected when the cell is clicked.

### Numeric Columns

Numeric columns align to the right of table cells.

| Attribute   | Element    | Type              | Description |
| :---------  | :--------- | :---------------- | :---------- |
| `mdNumeric` | `mdColumn` | `null|expression` | If the expression is `null` or evaluates to `true` then all the cells in that column will be right aligned |

You may use Angular's [number](https://docs.angularjs.org/api/ng/filter/number) filter on a cell to set the decimal precision.

```html
<!-- 2 decimal places -->
<td md-cell>{{dessert.protein.value | number: 2}}</td>
```

> If you are using `colspan` you may need to manual correct the alignment and padding of cells. You can override the cell's style with a custom CSS class.

### Pagination

| Attribute           | Type            | Description |
| :---------------- | :---------------- | :---------- |
| `mdBoundaryLinks` | `null|expression` | Displays first and last page navigation links |
| `mdLabel`         | `object`          | Change the pagination label. See more below. |
| `mdLimit`         | `integer`         | A row limit. |
| `mdPage`          | `integer`         | Page number. Pages are not zero indexed. The directive assumes the first page is one. |
| `mdOnPaginate`    | `function`        | A callback function for when the page or limit changes. The page is passed as the first argument and the limit is passed as the second argument. |
| `mdOptions`       | `array`           | Row limit options. The default is `[5, 10, 15]` |
| `mdTotal`         | `integer`         | Total number of items. |

The `md-label` attribute has the following properties.

| Property    | Type     | Default |
| :---------- | :------- | :------ |
| page        | `string` | Page:   |
| rowsPerPage | `string` | Rows per page: |
| of          | `string` | of e.g. (x - y of z) |

**Example: Changing Pagination Label**

```html
<!-- how to change the pagination label -->
<md-table-pagination md-label="{page: 'Página:', rowsPerPage: 'Filas por página:', of: 'de'}"></md-table-pagination>

<!-- or if the label is defined on the scope -->
<md-table-pagination md-label="{{label}}"></md-table-pagination>
```

I used Google translate so if the translations are wrong please fix them and make a pull request.

**Example: Client Side Pagination Using ngRepeat**

```html
<tr md-row ng-repeat="item in array | orderBy: myOrder | limitTo: myLimit: (myPage - 1) * myLimit">

<!-- and your pagination element will look something like... -->
<md-table-pagination md-limit="myLimit" md-page="myPage" md-total="{{array.length}}"></md-table-pagination>
```

**My Pagination Isn't Working?!**

* Make sure you pass `md-page`, `md-limit`, and `md-total` to the directive and that they are finite numbers.
* Pages are not zero indexed. The directive will assume pages start at one. If your query language expects pages to be zero indexed then just subtract one before making the query.

> It is important to know that the call back expression will be executed before the next digest cycle, meaning your local scope variables will still have the old values.

### Row Selection

By default, selected items will persist even on pagination change. For this to work with items being fetch from the server you will need to provide a unique identifier to the directive, probably the primary key of your data set.

If at anytime you want to add or remove items from the model in your controller you may do so.

| Attribute      | Element   | Type              | Description |
| :------------- | :-------- | :---------------- | :---------- |
| `mdRowSelect`  | `mdTable` | `null|expression` | Enable row selection. |
| `ngModel`      | `mdTable` | `array`           | A variable to bind selected items to. |
| `mdSelect`     | `mdRow`   | `any`             | The item to be selected. |
| `mdSelectId`   | `mdRow`   | `string`          | A unique identifier for the selected item. This is necessary to match items that may not be strictly equal. For example, if items are swapped from the server. |
| `mdAutoSelect` | `mdRow`   | `null|expression` | Select a row by clicking anywhere in the row. |
| `mdOnSelect`   | `mdRow`   | `function`        | A callback function for when an item is selected. The item will be passed as an argument to the callback. |
| `mdOnDeselect` | `mdRow`   | `function`        | A callback function for when an item is deselected. The item will be passed as an argument to the callback. |
| `ngDisabled`   | `mdRow`   | `expression`      | Conditionally disable row selection. |

**Example: Row Selection From The Live Demo.**

```html
<tr md-row md-select="dessert" md-select-id="{{dessert.name}}" md-auto-select ng-repeat="dessert in desserts.data">
```

**Example: Clearing Selected Items On Pagination**

```javascript
$scope.onPaginate = function () {
  $scope.selected = [];
}
```

### Table Progress

| Attribute    | Target    | Type                 | Description |
| :----------- | :-------- | :------------------- | :---------- |
| `mdProgress` | `mdTable` | `promise|[promises]` | The table will display a loading indicator until the promise is resolved or rejected. |

The table module can display a loading indicator for you whenever asynchronous code is executing. It accepts a promise or an array of promises. If another promise is received before the previous promise is resolved or rejected it will be placed in a queue.

Because I spent almost an hour debugging this I thought I would share with you. I'm not sure why this is the case but if you put the deferred object on the scope and try to pass the promise to the directive from that, the queue mechanism will not work properly.

**This Will Not Work**

```javascript
function () {
  $scope.deferred = $q.defer();
  // code
  $scope.deferred.resolve();
}
```

```html
<table md-table md-progress="deferred.promise"></table>
```

**This Will Work**

```javascript
function () {
  var deferred = $q.defer();
  $scope.promise = deferred.promise;
  // code
  deferred.resolve();
}
```

```html
<table md-table md-progress="promise"></table>
```

In addition, if you are dealing with something that returns a promise directly and not a deferred object you don't need to worry about it.

```javascript
function () {
  $scope.promise = $timeout(function () {
    // code
  }, 2000);
}
```

### Table Toolbars

Tables may be embedded within cards that offer navigation and data manipulation tools available at the top and bottom. You can use the `md-table-toolbar` and `md-default` class on a `md-toolbar` element for a plain white toolbar.

If you need to display information relative to a particular column in the table you may use use a `<md-foot>` element. For example, say you had a `calories.total` property that summed the total number of calories and you wanted to display that information directly beneath the Calories column.

```html
<tfoot md-foot>
  <tr md-row>
    <td md-cell></td>
    <td md-cell><strong>Total: </strong>{{calories.total}}</td>
    <td md-cell colspan="6"></td>
  </tr>
</tfoot>
```

Observe that Calories is the second column in the table. Therefore, we need to offset the first column with an empty cell. If you need to offset many columns you can use `<td colspan="${n}"></td>` where `n` is the number of columns to offset.

> You may need to manually correct the the text alignment and cell padding if you use `colspan`.

## Contributing

**Requires**

* node
* grunt-cli

This repository contains a demo application for developing features. As you make changes the application will live reload itself.

**Update**

I noticed the nutrition app was an inconvenience for people trying to run the app locally and contribute. I have updated the demo application to remove the dependency for the nutrition app. This is also a good example of how you can take advantage of `ngRepeat` to easily achieve client side sorting and pagination.

##### Running the App Locally

Clone this repository to your local machine.

```
git clone https://github.com/daniel-nagy/md-data-table.git
cd md-data-table
```

Create a new branch for the issue you are working on.

```
git checkout -b my-issue
```

Install the package dependencies.

```
npm install
bower install
```

Run the application and visit `127.0.0.1:8000` in the browser.

```
grunt
```

Make your modifications and update the build.

```
grunt build
```

Create a pull request!
