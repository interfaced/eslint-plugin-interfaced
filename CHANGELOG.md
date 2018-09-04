# Change log

## 0.3.1 (release date: 23.11.2017)

* `lines-around-class`: attach only one JSDoc to class instead of all before/after comments
* `lines-between-*`: report about unexpected comments between nodes without trying to fix it

## 0.3.0 (release date: 20.11.2017)

* Required `npm@5`
* Redefined `valid-jsdoc` to ignore report about "function has no return statement" for interface and record methods
* Redefined `no-unused-expressions` to ignore typedefs
* `no-empty-method`: treat record (class marked by `@record`) as entity with allowed empty methods
* `space-in-typecast`: renamed to `typecast-spacing` to be consistent with ESLint conventions
* `jsdoc-tags-order`, `no-restricted-jsdoc-tags`: report error for jsdoc instead of its owner
* New rules:
    - `jsdoc-type-spacing`
    - `jsdoc-type-application-dot`
    - `capitalized-enum`
    - `capitalized-typedef`
    
## 0.2.1 (release date: 9.11.2017)

* `jsdoc-tags-order`, `no-restricted-jsdoc-tags`: extended known tags by JSDoc3 and Closure Compiler
* `lines-between-*`: report about unexpected code between nodes without trying to fix it

## 0.2.0 (release date: 31.10.2017)

* Migrate to ESLint 4
* `newline-before-after-class`: param `newlinesCountBefore` renamed to `before` 
* `newline-before-after-class`: param `newlinesCountAfter` renamed to `after` 
* `newline-between-methods`: param `newlinesCount` renamed to `amount` 
* `newline-between-props`: param `newlinesCount` renamed to `amount` 
* `newline-between-statics`: param `newlinesCount` renamed to `amount` 
* Renamed rules with `newline` prefix to be consistent with ESLint conventions:
    - `newline-before-after-class` -> `lines-around-class`
    - `newline-between-methods` -> `lines-between-methods`
    - `newline-between-props` -> `lines-between-props`
    - `newline-between-statics` -> `lines-between-statics`

## 0.1.2 (release date: 5.07.2017)

* `space-in-typecast`: more robust implementation
* Added handling of doctrine's parse exceptions

## 0.1.1 (release date: 29.06.2017)

* `caps-const`: added handling of literals in enum
* `methods-order`: added grouping by class to exclude misleading errors
* `props-order`: added grouping by class to exclude misleading errors
* `newline-between-methods`: added grouping by class to exclude misleading errors
* `newline-between-props`: added grouping by class to exclude misleading errors

## 0.1.0 (release date: 8.06.2017)

* Initial release
