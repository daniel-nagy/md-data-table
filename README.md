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

```html
<md-data-table-container>
  <table md-data-table md-row-select md-column-sort ng-controller="nutritionController">
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

#### observations

Finding a cross browser solution for this was more challenging then anticipated. I was unable to style the `<th>` element itself to achieve this effect. My solution was to wrap the cell's contents in an additional container.

The specification does not declare a minimum width for table cells. When the width of the largest cell defines the width of the column this is not an issue, however, with this feature enabled this becomes a concern. For example, if you have a numeric cell, the width of the cell may be very small. Without a minimum width on the header cell, the cell will shrink to a point that is unreadable. In fact, the cell needs a minimum width of 12px just to display the ellipsis. I decided a minimum width for header cells, when this feature is enabled, is necessary. Currently the minimum width of header cells is `120px` which leaves `64px` for the column name (`120px - 56px`). There is one noncritical problem with this, the first table cell will have more space (`56px - 24px || 56px`) and the last table cell will have less space (`-24px`). This is due to the way the table is padded. Is it correctable? Maybe, I'm not entirely sure about the `24px` padding on the sides because `<tr>` elements are un-style-able. This blemish is not really noticeable but is a flaw none the less.

Furthermore on hover, header names will only display an addition `56px` worth of text. Additional text will still overflow. I made this decision because otherwise the title would bleed over into its neighbor cell. I imagine this issue will be solved with tooltips.

## Column Ordering

As of version 0.0.2 you must now opt into column ordering by specifying the `md-column-sort` attribute.

Column ordering is automatically enabled when `ng-repeat` is used to display the contents of a table. The order property defaults to the header cell text (in lowercase) but is configurable using the `order-by` attribute which will specify the property for that column to sort on.

#### observations

I see three different use cases for column ordering.

1. **Data that is included directly in the markup.**

   If the developer is including data directly in the markup, I don't believe column sorting is a concern of theirs. However, this could be done by manually sorting the rows from within the directive.

2. **Using ngRepeat to display data**

   I've implemented a naive way of handling this by checking for an `ng-repeat` directive during the compile phase and attaching on an `orderBy` variable that I can then use to sort the columns from within the directive. It would be better to first check if an `orderBy` variable exists and then parse it or maybe reserve an attribute for two way data-binding. That way the developer has access to the `orderBy` variable in their controller.

3. **Using ngRepeat to display paginated chunks of data from the server**

   This is probably the most desirable way to display data in a table. My naive approach will not work in this situation. When a header cell is clicked, a request needs to be sent to the server to sort the data and return the results. To be honest I'm not entirely sure how to implement this.

## Contributing

This repository contains a nice demo application for developing features. As you modify files the package will automatically be generated. If you decide to add templates to the module, uncomment the `html2js` task in the `Gruntfile` to have templates automatically included in the build and stored in the template cache.

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
