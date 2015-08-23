## Version History

* [0.8.0.x](#08x)
* [0.7.0.x](#07x)
* [0.6.0.x](#06x)
* [0.5.0.x](#05x)
* [0.4.0.x](#04x)
* [0.3.0.x](#03x)

### 0.8.x

#### Version 0.8.9
###### August 23, 2015

* Fix for issue #84
* Fix for issue #93

Thanks [@pavelhoral](https://github.com/pavelhoral)!

#### Version 0.8.8
###### August 16, 2015

* Tables with multi-row headers can now specify a significant row that will be used to append the checkbox to and set the text alignment for numeric columns. The default is to use the last row. See [Numeric Columns](#numeric-columns) and [Row Selection](#row-selection).

#### Version 0.8.7
###### August 14, 2015

* I no longer replace the `th` element, instead I build the template and append it to the original `th` element. This should fix issues with `ng-repeat`.

#### Version 0.8.6
###### August 13, 2015

* Temporary patch to prevent tables that use `ng-repeat` on header columns from not working. Changes will need to be made to the `mdColumnHeader` directive to insure that no other directives, that transform the template, will conflict with it in the future.

#### Version 0.8.4
###### August 12, 2015

* Fixing bug where the arrow icon, while hovering an inactive column name with the `descend-first` attribute, would not point in the appropriate direction.

#### Version 0.8.3
###### August 11, 2015

* Inline menus have been updated for Angular Material 0.10.1

**Note:** Menus are going to look bad in the Codepen because Google has not yet updated the CDN for Angular Material to version 0.10.1

#### Version 0.8.2
###### August 9, 2015

* Support for [inline menus](#inline-menus)

**Notes**

I targeted the latest version of Angular Material which is currently v0.10.0. There have been changes to the template for the select element since this release, so if you are using a version of Angular Material greater than v0.10.0 you will notice inconsistencies in the styling of the element. I will fix this as soon as v0.10.1 is released.

#### Version 0.8.1
###### August 9, 2015

* I am now using the `$interpolate` service to get the start and stop symbols

#### Version 0.8.0

**Syntax Changes**

* The name of a column is now placed in a `name` attribute. This decision was made do to the difficulty of transforming the template with interpolate strings and `ng-repeat`.
* The `unit` and `show-unit` attributes can be used regardless of weather or not the column in numeric (if you want).
* `md-trim-column-names` has been renamed to just `trim` and is now enabled individually for each column.
* The `md-auto-select` and `md-disable-select` attributes have been moved to the `tr` element within the `tbody` element.

**Improvements**

* You may now (properly) use `ng-repeat` and `ng-attr-*` on column headers.
* This version fixes issue #41.
* This version fixes issue #57.
* Trimming long column names is achieved cleanly with CSS and no longer uses `table-layout: fixed` or Javascript.

**Issues**

I have discovered an issue in Chrome's (and Opera's) web browser. This issue has existed for sometime and either no one has noticed it or no one has really cared. It appears Chrome has issues with properly rendering the table when the container is small enough to allow the table to scroll horizontally and the viewport is short enough that it can be scrolled vertically. This results in an undesirable laggy/rubber-band-ish effect when scrolling vertically for cells that meet one of the following criteria:

* The cell is positioned relative.
* The cell contains an `md-checkbox` element.
* The cell contains an `md-icon` element.

I have tested Safari, FireFox, Mobile Safari, and even IE 10 and was not able to reproduce this issue. I will open an issue for this momentarily. Please leave a comment if you have any ideas on how to fix this. If you know anyone who works for Google, make them fix it :stuck_out_tongue_closed_eyes:.

**Update**

~~It appears the latest version of Chrome (v44.0.2403.130) for OS X has resolved this issue, yay!~~

I spoke too soon. On my work machine, an older non-retina display Macbook Pro, this is not experienced; however, on my personal machine, a retina display Macbook Pro, this is still experienced. It is clear that not all OS X Chrome users are effected by this bug. This bug seems to be related to hardware in some way? My personal machine has an Intel Iris Pro GPU with 1536 MB of VRAM. Hardware is not really my thing. Maybe someone else with a retina display Macbook Pro can reproduce this issue?

### 0.7.x

#### Version 0.7.6

* **Important:** Pagination is now its own toolbar and should not be wrapped in a `md-data-table-toolbar` element.
* The pagination toolbar will now collapse into two separate toolbars on screens less than or equal to `600px` wide.

#### Version 0.7.5

* First and last page navigation links courtesy of [@vcastello](https://github.com/scooper91).

#### Version 0.7.4

* The `precision` attribute has been removed from numeric columns, use Angular's [number](https://docs.angularjs.org/api/ng/filter/number) filter instead.

#### Version 0.7.3

* I've added an `md-progress` [attribute](#table-progress) to the table element to trigger the progress indicator from outside the table scope.

* I'm also using `ng-value` instead of `value` in the pagination directive now, which should hopefully fix the issue some people are having with their trigger function being called on page load.

#### Version 0.7.2

* I've rewrapped the trigger functions in timeouts because I realize it's unexpected and inconvenient for the scope to be stale.

#### Version 0.7.1

* The function you pass to `md-trigger` will now be wrapped in a promise, meaning even if you call it from within your controller a loading indicator will be displayed. :)

* I've removed the `$timeout` when calling your `md-trigger` function meaning the function will be call **before** two-way data binding has had a chance to update your model scope.

* The reason your `md-trigger` function is being called when the page loads is because of a bug in the `mdSelect` module. I've created a pull request to fix this issue but as an immediate fix you can use a `String` instead of a `Number` for your `md-limit` value. For more information see the issue I opened awhile back [#3233](https://github.com/angular/material/issues/3233).

#### Version 0.7.0

* Conditionally disable row selection. See [Row Selection](#row-selection) for more details.

### 0.6.x

#### Version 0.6.0

* Register trigger handlers for column reorder and pagination change. If the function returns a promise, a loading indicator will be displayed.

### 0.5.x

#### Version 0.5.1

* You can now set the default sort direction for a column.

#### Version 0.5.0

* Support for `<tfoot>` elements.

### 0.4.x

#### Version 0.4.7

* Bug Fix: Numeric columns will now align properly when using `ngRepeat` to do client side sorting and pagination.
* Selected items will not be cleared when using `ngRepeat` to do client side sorting and pagination. (I don't know if they were before but I do know now).

#### Version 0.4.6

* Improvement: You can now interpolate the pagination label.
* Improvement: Pagination will now calculate an appropriate page based on the current min value when the number of rows are changed (hopefully).

#### Version 0.4.5

* Improvement: You must now explicitly place an `orderBy` attribute on a header cell to enable sorting on that column. This allows for a combination of columns that are sortable and not sortable.
* Improvement: you may now use `ngRepeat` on header cells with column ordering.

#### Version 0.4.4

* Bug Fix: When the number of rows per page is changed, pagination will now decrement the page until the min value is less than the total number of items or the page is zero.

#### Version 0.4.3

* Bug Fix: using `parseFloat` instead of `parseInt`. Thanks [@vcastello](https://github.com/vcastello)!

#### Version 0.4.2

* Bug Fix: Conditionally clearing selected items only when row selection is enabled. Good catch [@scooper91](https://github.com/scooper91)!

#### Version 0.4.1

* Bug Fix: two-way data binding of selected items.

#### Version 0.4.0

* A row will now reflect its selected status with a background fill
* New Feature: the `md-auto-select` attribute may be use to allow row selection by clicking anywhere inside the row.

### 0.3.x

#### Version 0.3.1

* accurate calculation of the width of column names
* improved styles for column padding and pagination

#### Version 0.3.0

* The working directory has been restructured at an attempt to be more organized.
* `md-filter` has been renamed to `md-order` for better naming convention.
* Column headers now display sort icons when column ordering is enabled.
* Bug Fix: Numeric columns will now right align without column ordering enabled.