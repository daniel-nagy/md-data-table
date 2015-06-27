## Version History

### 0.5.x

**Version 0.5.0**

* Support for `<tfoot>` elements.

### 0.4.x

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

### 0.3.x

**Version 0.3.1**

* accurate calculation of the width of column names
* improved styles for column padding and pagination

**Version 0.3.0**

* The working directory has been restructured at an attempt to be more organized.
* `md-filter` has been renamed to `md-order` for better naming convention.
* Column headers now display sort icons when column ordering is enabled.
* Bug Fix: Numeric columns will now right align without column ordering enabled.