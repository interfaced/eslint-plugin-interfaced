# Change log

## 1.1.0 (release date: 13.07.2018)

* `lines-around-class`: use `1` as the default value for `before` and `after`
* `prefer-shorthand-jsdoc-types`: auto fixing; removed `consistent` option
* `jsdoc-type-spacing`: auto fixing; completely new options (see docs/rules/jsdoc-type-spacing)
* `jsdoc-type-application-dot`: auto fixing
* `jsdoc-tags-order`: auto fixing

* JSDoc tokenization
* Rules documentation is separated and extended

## 1.0.0 (release date: 27.06.2018)

* `eslint@5`

## 0.6.0 (release date: 20.06.2018)

* `prefer-shorthand-jsdoc-types`: handle params without type
* `caps-const`: skip computed properties of an enum

* New rule: `event-const-value`

## 0.5.0 (release date: 15.01.2018)

* New rules:
    - `prefer-shorthand-jsdoc-types`
    - `prevent-unused-typedef-vars`
    - `prevent-unused-meta-params`

## 0.4.1 (release date: 11.12.2017)

* `camelcase`: handling of destructuring

## 0.4.0 (release date: 11.12.2017)

* `no-unused-expressions`: consider property definitions from the prototype
* `caps-const`, `capitalized-enum`, `capitalized-typedef`: removed auto fixing to avoid destructive code changes

* New rules:
    - `interface-name-prefix`
    - `abstract-class-name-prefix`
    - `no-tabs-in-jsdoc-type`

* New redefinitions:
	- `camelcase` to ignore report for arguments which name has `opt_`/`var_` prefix
	- `require-jsdoc` to consider class expressions alongside with class declarations

## 0.3.1 (release date: 23.11.2017)

* `lines-around-class`: attach only one JSDoc to class instead of all before/after comments
* `lines-between-*`: report about unexpected comments between nodes without trying to fix it

## 0.3.0 (release date: 20.11.2017)

* `npm@5`
* `no-empty-method`: treat record (class marked by `@record`) as entity with allowed empty methods
* `space-in-typecast`: renamed to `typecast-spacing` to be consistent with ESLint conventions
* `jsdoc-tags-order`, `no-restricted-jsdoc-tags`: report error for jsdoc instead of its owner

* New rules:
    - `jsdoc-type-spacing`
    - `jsdoc-type-application-dot`
    - `capitalized-enum`
    - `capitalized-typedef`

* New redefinitions:
	- `valid-jsdoc` to ignore report about "function has no return statement" for interface and record methods
	- `no-unused-expressions` to ignore typedefs
    
## 0.2.1 (release date: 9.11.2017)

* `jsdoc-tags-order`, `no-restricted-jsdoc-tags`: extended known tags by JSDoc3 and Closure Compiler
* `lines-between-*`: report about unexpected code between nodes without trying to fix it

## 0.2.0 (release date: 31.10.2017)

* `eslint@4`
* `newline-before-after-class`: param `newlinesCountBefore` renamed to `before` 
* `newline-before-after-class`: param `newlinesCountAfter` renamed to `after` 
* `newline-between-methods`: param `newlinesCount` renamed to `amount` 
* `newline-between-props`: param `newlinesCount` renamed to `amount` 
* `newline-between-statics`: param `newlinesCount` renamed to `amount` 

* Renamed rules to be consistent with ESLint conventions:
    - `newline-before-after-class` -> `lines-around-class`
    - `newline-between-methods` -> `lines-between-methods`
    - `newline-between-props` -> `lines-between-props`
    - `newline-between-statics` -> `lines-between-statics`

## 0.1.2 (release date: 5.07.2017)

* `space-in-typecast`: more robust implementation
* `*`: handling of doctrine's parse exceptions

## 0.1.1 (release date: 29.06.2017)

* `caps-const`: added handling of literals in enum
* `methods-order`: added grouping by class to exclude misleading errors
* `props-order`: added grouping by class to exclude misleading errors
* `newline-between-methods`: added grouping by class to exclude misleading errors
* `newline-between-props`: added grouping by class to exclude misleading errors

## 0.1.0 (release date: 8.06.2017)

* Initial release
