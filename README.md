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

## usage

```html
<md-data-table-container>
  <table md-data-table md-row-select ng-controller="nutritionController">
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

Automatic row selection is enabled using the `md-row-select` attribute. Checkboxes will be prepended to each row. Rows can be selected by clicking anywhere in the row or directly on the checkbox. In addition, a master toggle is prepended to the header.

## Long Header Titles

Column names can be configured to shorten and display ellipses if they do not fit, with the recommended padding of `56px`, using the `trim-column-names` attribute.

> Bug in Safari that prohibits header cells from overflowing properly

## Column Ordering

Column ordering is automatically enabled when `ng-repeat` is used to display the contents of a table. The order property defaults to the header cell text (in lowercase) but is able to be set using the `order-by` attribute which will specify the property for that column to sort on.

## Contributing

This repository contains a nice demo application for developing features. As you modify files the package will automatically be generated. If you decide to add templates to the module, uncomment the `html2js` task in the `Gruntfile` to have templates automatically included in the build and stored in the template cache.

#### Running the App Locally

Clone this repository to your local machine.

```
git clone https://github.com/daniel-nagy/md-data-table.git
cd md-data-table
```

install the package dependencies.

```
npm install
bower install
```

run the application and visit `127.0.0.1:8000` in the browser

```
grunt
```

> If you're unfamiliar with Grunt, you may need to install the grunt-cli globally to use grunt from the command-line.
