# Material Design Data Table

This module is an effort to implement Material Design data tables in [Angular Material](https://material.angularjs.org/latest/#/). I hope that this module will serve as a temporary solution to those who need this functionality and also serve as a playground, or lessons learned, when developing an official solution.

Specification for Material Design data tables can be found [here](http://www.google.com/design/spec/components/data-tables.html).

## Demo

http://danielnagy.me/md-data-table/

## Installation
This package is installable through the Bower package manager.

```
bower install angular-material-data-table --save
```

> This module is experimental technology.
> Tested in IE 10 and on IOS 7.

## usage

**controller**

```javascript
angular.module('nutritionApp').controller('nutritionController', ['$nutrition', '$scope', function ($nutrition, $scope) {
  'use strict';
  
  $nutrition.desserts.query(function (desserts) {
    $scope.desserts = desserts;
  });
  
  /* 
   * This function will execute every time a table column name is
   * selected. (notice md-filter="filter" in the template)
   *
   * @param filter Either the value of the order-by attribute or
   *               the inner text of the cell.
   */
  $scope.filter = function (filter) {
    $nutrition.desserts.query({filter: filter}, function (desserts) {
      $scope.desserts = desserts;
    });
  };

}]);
```

**markup**

```html
<md-data-table-container ng-controller="nutritionController">
  <table md-data-table md-row-select md-column-sort md-filter="filter" trim-column-names>
    <thead>
      <tr>
        <th order-by="name">Dessert (100g serving)</th>
        <th numeric>Calories</th>
        <th numeric unit="g" precision="1">Fat</th>
        <th numeric unit="g">Carbs</th>
        <th numeric unit="g" precision="1">Protein</th>
        <th numeric unit="mg">Sodium</th>
        <th numeric unit="%">Calcium</th>
        <th numeric unit="%">Iron</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="dessert in desserts">
        <td>{{dessert.name}}</td>
        <td>{{dessert.calories}}</td>
        <td>{{dessert.fat}}</td>
        <td>{{dessert.carbs}}</td>
        <td>{{dessert.protein}}</td>
        <td>{{dessert.sodium}}</td>
        <td show-unit>{{dessert.calcium}}</td>
        <td show-unit>{{dessert.iron}}</td>
      </tr>
    </tbody>
  </table>
</md-data-table-container>
```

## Numeric Columns

Numeric columns, as defined by the specification, align to the right of table cells. Column headers support the following attributes for numeric data.

| Attribute | Target Cell | Description |
| --------- | ----------- | ----------- |
| numeric   | header cell | Informs the directive the current column is numeric in nature. |
| unit      | header cell | Specifies the unit of the content. Providing a unit will automatically add the unit, wrapped in parenthesis, to the header cell. |
| precision | header cell | Specifies the number of decimal places to display. The default is none. |
| show-unit | body cell   | Displays the unit in the body cell. |


Note that the `numeric` attribute must be present for other numeric attributes to take effect.

## Row Selection

> Automatic row selection requires `ng-repeat`.

Automatic row selection is enabled using the `md-row-select` attribute. Selected items will appear in the variable assigned to the `md-row-select` attribute in the form of an array.

## Long Header Titles

Column names can be configured to shorten and display ellipses if they do not fit, with the recommended padding of `56px`, using the `trim-column-names` attribute.

#### observations

Finding a cross browser solution for this was more challenging then anticipated. I was unable to style the `<th>` element itself to achieve this effect. My solution was to wrap the cell's contents in an additional container.

The specification does not declare a minimum width for table cells. When the width of the largest cell defines the width of the column this is not an issue, however, with this feature enabled this becomes a concern. For example, if you have a numeric cell, the width of the cell may be very small. Without a minimum width on the header cell, the cell will shrink to a point that is unreadable. In fact, the cell needs a minimum width of 12px just to display the ellipsis. I decided a minimum width for header cells, when this feature is enabled, is necessary. Currently the minimum width of header cells is `100px` which leaves `44px` for the column name (`100px - 56px`). There is one noncritical problem with this, the first table cell will have more space (`56px - 24px || 56px`) and the last table cell will have less space (`-24px`). This is due to the way the table is padded. Is it correctable? Maybe, I'm not entirely sure about the `24px` padding on the sides because `<tr>` elements are un-style-able. This blemish is not really noticeable but is a flaw none the less.

Furthermore on hover, header names will only display an addition `56px` worth of text. Additional text will still overflow. I made this decision because otherwise the title would bleed over into its neighbor cell. I imagine this issue will be solved with tooltips.

## Column Ordering

As of version 0.0.2 you must now opt into column ordering by specifying the `md-column-sort` attribute.

Column ordering is automatically enabled when `ng-repeat` is used to display the contents of a table. The order property defaults to the header cell text (in lowercase) but is configurable using the `order-by` attribute which will specify the property for that column to sort on.

You may tell the directive you would like to perform manual sorting by specifying the `md-filter` attribute. The `md-filter` attribute takes a function that will executed when the user clicks a column name.

#### observations

I see three different use cases for column ordering.

1. **Data that is included directly in the markup.**

  Currently there is no support for this.

2. **Using ngRepeat to display data**

  Done automatically when the `md-column-sort` attribute is specified.

3. **Using ngRepeat to display paginated chunks of data from the server**

  The developer must assign a function to the `md-filter` attribute to filter the columns manually.

## Contributing

This repository contains a nice demo application for developing features. As you modify files the package will automatically be generated. If you decide to add templates to the module, uncomment the `html2js` task in the `Gruntfile` to have templates automatically included in the build and stored in the template cache.

**update**

The demo application is now configured to use a companion application [nutrition-app](https://github.com/daniel-nagy/nutrition-app) for developing server side filtering and pagination.

#### Running the App Locally

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

> If you're unfamiliar with Grunt, you may need to install the grunt-cli globally to use grunt from the command-line.
