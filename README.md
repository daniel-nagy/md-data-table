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
  
  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  
  $scope.$watchCollection('query', function (newValue, oldValue) {
    if(newValue === oldValue) {
      return;
    }
    
    $nutrition.desserts.query($scope.query, function (desserts) {
      $scope.desserts = desserts;
    });
  });

}]);
```

**markup**

```html
<md-data-table-toolbar>
  <h2 class="md-title">Nutrition</h2>
</md-data-table-toolbar>

<md-data-table-container>
  <table md-data-table md-row-select="selected">
    <thead md-order="query.order" md-trim-column-names>
      <tr>
        <th order-by="name">Dessert (100g serving)</th>
        <th numeric order-by="calories.value">Calories</th>
        <th numeric unit="g" precision="1" order-by="fat.value">Fat</th>
        <th numeric unit="g" order-by="carbs.value">Carbs</th>
        <th numeric unit="g" precision="1" order-by="protein.value">Protein</th>
        <th numeric unit="mg" order-by="sodium.value">Sodium</th>
        <th numeric unit="%" order-by="calcium.value">Calcium</th>
        <th numeric unit="%" order-by="iron.value">Iron</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="dessert in desserts">
        <td>{{dessert.name}}</td>
        <td>{{dessert.calories.value}}</td>
        <td>{{dessert.fat.value}}</td>
        <td>{{dessert.carbs.value}}</td>
        <td>{{dessert.protein.value}}</td>
        <td>{{dessert.sodium.value}}</td>
        <td show-unit>{{dessert.calcium.value}}</td>
        <td show-unit>{{dessert.iron.value}}</td>
      </tr>
    </tbody>
  </table>
</md-data-table-container>

<md-data-table-toolbar layout-align="end">
  <md-data-table-pagination md-limit="query.limit" md-page="query.page" md-total="9"></md-data-table-pagination>
</md-data-table-toolbar>
```

## Change Log

**Version 0.4.7**

* Bug Fix: Numeric columns will now align properly when using `ngRepeat` to do client side sorting and pagination.
* Selected items will not be cleared when using `ngRepeat` to do client side sorting and pagination. (I don't know if they were before but I do know now).

**Version 0.4.6**

* Improvement: You can now interpolate the pagination label.
* Improvement: Pagination will now calculate an appropriate page based on the current min value when the number of rows are changed (hopefully).

**Version 0.4.5**

* Improvement: You must now explicitly place an `orderBy` attribute on a header cell to enable sorting on that column. This allows for a combination of columns that are sortable and not sortable.
* Improvement: you may now use `ngRepeat` on header cells with column ordering.

**Version 0.4.4**

* Bug Fix: When the number of rows per page is changed, pagination will now decrement the page until the min value is less than the total number of items or the page is zero.

**Version 0.4.3**

* Bug Fix: using `parseFloat` instead of `parseInt`. Thanks [@vcastello](https://github.com/vcastello)!

**Version 0.4.2**

* Bug Fix: Conditionally clearing selected items only when row selection is enabled. Good catch [@scooper91](https://github.com/scooper91)!

**Version 0.4.1**

* Bug Fix: two-way data binding of selected items.

**Version 0.4.0**

* A row will now reflect its selected status with a background fill
* New Feature: the `md-auto-select` attribute may be use to allow row selection by clicking anywhere inside the row.

View the [archives](ARCHIVE.md) for a complete version history.

## API Documentation

### Numeric Columns

Numeric columns align to the right of table cells. Column headers support the following attributes for numeric data.

##### Header Cells

| Attribute    | Target  | Type     | Description |
| :----------- | :------ | :------- | :---------- |
| `numeric`    | `<th>`  | `NULL`   | Informs the directive the column is numeric in nature. |
| `unit`       | `<th>`  | `String` | Specifies the unit. Providing a unit will automatically add the unit, wrapped in parenthesis, to the header cell. |
| `precision`  | `<th>`  | `Number` | Specifies the number of decimal places to display. The default is none. |

##### Body Cells

| Attribute   | Target  | Type     | Description |
| :---------- | :------ | :------- | :---------- |
| `show-unit` | `<td>`  | `NULL`   | Displays the unit in the body cell; `unit` must be specified on the header cell. |


> Note that the `numeric` attribute must be present for other attributes to take effect.

### Row Selection

> Requires `ng-repeat`.

| Attribute        | Target    | Type    | Description |
| :--------------- | :-------- | :------ | :---------- |
| `md-row-select`  | `<table>` | `Array` | Two-way data binding of selected items |
| `md-auto-select` | `<tbody>` | `NULL`  | allow row selection by clicking anywhere inside the row. |

> Be sure to define the variable in your controller for two-way data binding to work. If you fail to do so, a friendly reminder will be logged to the console.

### Long Header Titles

| Attribute              | Target    | Type   | Description |
| :--------------------- | :-------- | :----- | :---------- |
| `md-trim-column-names` | `<thead>` | `NULL` | Enable truncating column names. |

Column names will be shortened if they exceed the width of the cell minus the `56px` of padding between cells. If the name exceeds the width of the cell plus the `56px` of padding between cells, then only an additional `56px` of text will be shown the rest will remain truncated.

### Column Ordering

| Attribute              | Target    | Type     | Description |
| :--------------------- | :-------- | :------- | :---------- |
| `md-order`             | `<thead>` | `String` | Two-way data binding filter. |

The `mdOrder` attribute will be update when the user clicks a `<th>` cell to the value defined by the `order-by` attribute. The `mdOrder` attribute can be used in to do server-side sorting or client-side sorting.

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

### Pagination

To use pagination add a `md-data-table-pagination` element to the `md-data-table-toolbar`.

| Attribute       | Type     | Description |
| :---------------| :------- | :---------- |
| `md-label`      | `String` | Specify the pagination label. The default is 'RowspPer page:'.|
| `md-limit`      | `Number` | A row limit. |
| `md-page`       | `Number` | Page number. |
| `md-total`      | `Number` | Total number of items. |
| `md-row-select` | `Array`  | Row limit options. The default is `[5, 10, 15]` |

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
