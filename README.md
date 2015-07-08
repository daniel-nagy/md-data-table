# Material Design Data Table

This module is an effort to implement Material Design data tables in [Angular Material](https://material.angularjs.org/latest/#/). I hope that this module will serve as a temporary solution to those who need this functionality and also serve as a playground, or lessons learned, when developing an official solution.

Specification for Material Design data tables can be found [here](http://www.google.com/design/spec/components/data-tables.html).

## Demo

http://danielnagy.me/md-data-table

## License

This software is provided free of change and without restriction under the [MIT License](LICENSE.md)

## Installation

This package is installable through the Bower package manager.

```
bower install angular-material-data-table --save
```

> This module is experimental technology.
> Tested in IE 10 and on IOS 7.

## Usage

**controller**

```javascript
angular.module('nutritionApp').controller('nutritionController', ['$nutrition', '$scope', function ($nutrition, $scope) {
  'use strict';
  
  $scope.selected = [];
  
  $scope.query = {
    filter: '',
    order: 'name',
    limit: 5,
    page: 1
  };
  
  function success(desserts) {
    $scope.desserts = desserts;
  }
  
  // in the future we may see a few built in alternate headers but in the mean time
  // you can implement your own search header and do something like
  $scope.search = function (predicate) {
    $scope.filter = predicate;
    $scope.deferred = $nutrition.desserts.get($scope.query, success).$promise;
  };
  
  $scope.onOrderChange = function (order) {
    return $nutrition.desserts.get($scope.query, success).$promise; 
  };
  
  $scope.onPaginationChange = function (page, limit) {
    return $nutrition.desserts.get($scope.query, success).$promise; 
  };

}]);
```

**markup**

```html
<md-data-table-toolbar>
  <h2 class="md-title">Nutrition</h2>
</md-data-table-toolbar>

<md-data-table-container>
  <table md-data-table md-row-select="selected" md-progress="deferred">
    <thead md-order="query.order" md-trigger="onOrderChange">
      <tr>
        <th order-by="name">Dessert (100g serving)</th>
        <th numeric order-by="calories.value">Calories</th>
        <th numeric unit="g" order-by="fat.value">Fat</th>
        <th numeric unit="g" order-by="carbs.value">Carbs</th>
        <th numeric unit="g" order-by="protein.value">Protein</th>
        <th numeric unit="mg" order-by="sodium.value">Sodium</th>
        <th numeric unit="%" order-by="calcium.value">Calcium</th>
        <th numeric unit="%" order-by="iron.value">Iron</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="dessert in desserts.data">
        <td>{{dessert.name}}</td>
        <td>{{dessert.calories.value}}</td>
        <td>{{dessert.fat.value | number: 1}}</td>
        <td>{{dessert.carbs.value}}</td>
        <td>{{dessert.protein.value | number: 1}}</td>
        <td>{{dessert.sodium.value}}</td>
        <td show-unit>{{dessert.calcium.value}}</td>
        <td show-unit>{{dessert.iron.value}}</td>
      </tr>
    </tbody>
  </table>
</md-data-table-container>

<md-data-table-toolbar layout-align="end">
  <md-data-table-pagination md-limit="query.limit" md-page="query.page" md-total="{{desserts.total}}" md-trigger="onPaginationChange"></md-data-table-pagination>
</md-data-table-toolbar>
```

## Change Log

**Version 0.7.4**

* The `precision` attribute has been removed from numeric columns, use Angular's [number](https://docs.angularjs.org/api/ng/filter/number) filter instead.

**Version 0.7.3**

* I've added an `md-progress` [attribute](#table-progress) to the table element to trigger the progress indicator from outside the table scope.

* I'm also using `ng-value` instead of `value` in the pagination directive now, which should hopefully fix the issue some people are having with their trigger function being called on page load.

**Version 0.7.2**

* I've rewrapped the trigger functions in timeouts because I realize it's unexpected and inconvenient for the scope to be stale.

**Version 0.7.1**

* I've removed the `$timeout` when calling your `md-trigger` function meaning the function will be call **before** two-way data binding has had a chance to update your model scope.

* The reason your `md-trigger` function is being called when the page loads is because of a bug in the `mdSelect` module. I've created a pull request to fix this issue but as an immediate fix you can use a `String` instead of a `Number` for your `md-limit` value. For more information see the issue I opened awhile back [#3233](https://github.com/angular/material/issues/3233).

**Version 0.7.0**

* Conditionally disable row selection. See [Row Selection](#row-selection) for more details.

**Version 0.6.0**

* Register trigger handlers for column reorder and pagination change. If the function returns a promise, a loading indicator will be displayed.

**Version 0.5.1**

* You can now set the default sort direction for a column.

View the [archives](ARCHIVE.md) for a complete version history.

## API Documentation

* [Column Ordering](#column-ordering)
* [Long Header Titles](#long-header-titles)
* [Numeric Columns](#numeric-columns)
* [Pagination](#pagination)
* [Row Selection](#row-selection)
* [Table Progress] (#table-progress)
* [Table Toolbars](#table-toolbars)

### Column Ordering

| Attribute       | Target    | Type       | Description |
| :-------------- | :-------- | :--------- | :---------- |
| `md-order`      | `<thead>` | `String`   | Two-way data binding order property. |
| `md-trigger`    | `<thead>` | `function` | Will execute when the order is changed, passing the order as a parameter. |
| `order-by`      | `<th>`    | `String`   | The value to sort on when the user clicks the column name. |
| `descend-first` | `<th>`    | `NULL`     | Tell the directive to first sort descending. |

The `mdOrder` attribute will be update when the user clicks a `<th>` cell to the value defined by the `order-by` attribute. The `mdOrder` attribute can be used in to do server-side sorting or client-side sorting.

If the function assigned to the `md-triger` attribute returns a promise, a loading indicator will be displayed.

> This directive does not support sorting of in-place data, i.e. data included directly in the markup, nor do I plan on supporting this.

##### Server Side Ordering

The provided usage example takes advantage of server-side sorting by submitting a query to the server.

##### Client Side Ordering

Just add an `orderBy:` property to the `ng-repeat` attribute that matches the `md-order` attribute.

```html
<md-data-table-container>
  <table md-data-table>
    <thead md-order="order">
      <!-- this cell will order by the name property -->
      <th order-by="name">Dessert (100g serving)</th>
      <!-- this cell will not change the order when clicked -->
      <th numeric>Calories</th>
    </thead>
    <tbody>
      <tr ng-repeat="dessert in desserts | orderBy: order"></tr>
    </tbody>
  </table>
</md-data-table-container>
```

### Long Header Titles

| Attribute              | Target    | Type   | Description |
| :--------------------- | :-------- | :----- | :---------- |
| `md-trim-column-names` | `<thead>` | `NULL` | Enable truncating column names. |

Column names will be shortened if they exceed the width of the cell minus the `56px` of padding between cells. If the name exceeds the width of the cell plus the `56px` of padding between cells, then only an additional `56px` of text will be shown the rest will remain truncated.

### Numeric Columns

Numeric columns align to the right of table cells. Column headers support the following attributes for numeric data.

##### Header Cells

| Attribute    | Target  | Type     | Description |
| :----------- | :------ | :------- | :---------- |
| `numeric`    | `<th>`  | `NULL`   | Informs the directive the column is numeric in nature. |
| `unit`       | `<th>`  | `String` | Specifies the unit. Providing a unit will automatically add the unit, wrapped in parenthesis, to the header cell. |

##### Body Cells

| Attribute   | Target  | Type     | Description |
| :---------- | :------ | :------- | :---------- |
| `show-unit` | `<td>`  | `NULL`   | Displays the unit in the body cell; `unit` must be specified on the header cell. |

You may use Angular's [number](https://docs.angularjs.org/api/ng/filter/number) filter on a body cell to set the decimal precision.

```html
<!-- 2 decimal places -->
<td>{{dessert.protein.value | number: 2}}</td>
```

### Pagination

To use pagination add a `md-data-table-pagination` element to the `md-data-table-toolbar`.

| Attribute       | Type       | Description |
| :---------------| :--------- | :---------- |
| `md-label`      | `Object`   | Change the pagination label. The default is 'Rows per page:'.|
| `md-limit`      | `Number`   | A row limit. |
| `md-page`       | `Number`   | Page number. |
| `md-total`      | `Number`   | Total number of items. |
| `md-row-select` | `Array`    | Row limit options. The default is `[5, 10, 15]` |
| `md-trigger`    | `function` | Will execute when the page or limit is changed, passing the page and limit as parameters. |

The `md-label` attribute has the following properties.

| Property | Type     | Description |
| :--------| :------- | :---------- |
| text     | `String` | The pagination label. |
| of       | `String` | The 'of' in 'x - y of z'. |

If the function assigned to the `md-triger` attribute returns a promise, a loading indicator will be displayed.

**Example: Client Side pagination using ngRepeat.**

```html
<tr ng-repeat="item in array | orderBy: myOrder | filter: mySkip | limitTo: myLimit">
```

```javascript
$scope.mySkip = function (item, index) {
  return index >= ($scope.myLimit * ($scope.myPage - 1));
};
```

### Row Selection

> Requires `ng-repeat`.

| Attribute           | Target    | Type    | Description |
| :------------------ | :-------- | :------ | :---------- |
| `md-row-select`     | `<table>` | `Array` | Two-way data binding of selected items |
| `md-auto-select`    | `<tbody>` | `NULL`  | allow row selection by clicking anywhere inside the row. |
| `md-disable-select` | `<tbody>` | `expression | function` | Conditionally disable row selection |

**Example: Disable all desserts with more than 400 calories.**

```html
<tbody md-disable-select="dessert.calories.value > 4000"></tbody>
<!-- or assuming isDisabled is defined in you controller -->
<tbody md-disable-select="isDisabled(dessert)"></tbody>
```

> Be sure to define the variable in your controller for two-way data binding to work. If you fail to do so, a friendly reminder will be logged to the console.

### Table Progress

| Attribute         | Target    | Type      | Description |
| :---------------- | :-------- | :-------- | :---------- |
| `md-progress`     | `<table>` | `promise` | The table will display a loading indicator until notified. |

A progress indicator can be displayed in a couple different ways. If the function you supply to the `md-trigger` attributes returns a promise, then a loading indicator will be automatically displayed whenever any events within the scope of the table are dispatched (i.e. reordering, pagination).

It's not unlikely that some events outside the scope of the table will effect its contents. For example, a search field that filters the table by sending a query to the server. To provide flexibility for such events, the table directive has a `md-progress` attribute that accepts a `promise` and will display a progress indicator until notified.

### Table Toolbars

Tables may be embedded within cards that offer navigation and data manipulation tools available at the top and bottom.

In general, use an `md-data-table-toolbar` for table toolbars, however; if you need to display information relative to a particular column in the table you may use use a `<tfoot>` element. For example, say you had a `calories.total` property that summed the total number of calories and you wanted to display that information directly beneath the Calories column.

```html
<tfoot>
  <tr>
    <td></td>
    </td><strong>Total:</strong> {{calories.total}}</td>
  </tr>
</tfoot>
```

Observe that Calories is the second column in the table. Therefore, we need to offset the first column with an empty cell. If you need to offset many columns you can use `<td colspan="${n}"></td>` where `n` is the number of columns to offset.

> Note that the directive is smart enough to insert an empty cell for the row selection column and that empty cells are not required after the last cell.

## Contributing

**Requires**

* node
* grunt-cli

This repository contains a demo application for developing features. As you make changes the application will live reload itself.

**update**

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
