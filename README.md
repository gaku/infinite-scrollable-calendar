infinite-scrollable-calendar
============================

Infinite scrollable calendar directive for Angular.JS

## How to run the demo?
- Run `bower install` at the source directory.
- Access `test_cal.html` from a browser.

## Setup
- Dates are passed as string.  The format is "YYYY-MM-DD".
- Use `base-date` attribute to specify a day where calendar is displayed.  The value should be Angular variable.
If you need to pass a specific date declare as `base-date="'2013-09-09'"`.
- `start-date` and `end-date` attributes of the directive are the Angular values that are used for two-way bindings.
- If you don't want to indicate today, remove `cal-today` class.  Default is to show it in bold.

