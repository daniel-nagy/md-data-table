## Change Log

#### Version 0.9.15
###### March 24, 2016

* Use peer dependencies so npm can warn developers about incompatible versions.

#### Version 0.9.14
###### March 11, 2016

* All rows will be considered selected if there is at least one selectable row (not disabled) and all selectable rows are selected.

#### Version 0.9.13
###### March 11, 2016

* Fix issue [#316](https://github.com/daniel-nagy/md-data-table/issues/316)

#### Version 0.9.12
###### March 2, 2016

* Merge pull request [#304](https://github.com/daniel-nagy/md-data-table/pull/304) from brunoalbano:autofocus.
* Fix issue [#294](https://github.com/daniel-nagy/md-data-table/issues/294).

#### Version 0.9.11
###### February 7, 2016

Merge pull request [#281](https://github.com/daniel-nagy/md-data-table/pull/281) from aleeeftw:angular-symbols-fix.

#### Version 0.9.10
###### February 3, 2016

* Fix select menu styles for Angular Material v1.0.4
* Renamed md-data-table directory to src and moved it outside the demo app
* Changed main files to unminified source
* Added comment banner to source

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