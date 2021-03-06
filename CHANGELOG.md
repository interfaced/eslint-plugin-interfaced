# Change log

## 2.0.0 (release date: 27.12.2019)

Functionally identical to 2.0.0-beta.1

## 2.0.0-beta.1 (release date: 09.08.2019)

* Support ESLint 6
* Removed `valid-jsdoc` and `require-jsdoc` rules since they were deprecated in ESLint 6
* Removed `camelcase` rule in order to switch back to its original implementation

## 1.6.1 (release date: 24.01.2019)

* `valid-jsdoc`: handle the new error message type that was added in `eslint@5.12`

## 1.6.0 (release date: 6.12.2018)

* `caps-const`: fixed an exception on enum-variables checking
* `event-const-value`: fixed an exception on constant-variables checking

* New rules:
    - `singular-enum`
    - `no-jsdoc-type-multi-spaces`

* Renamed rules:
    - `no-tabs-in-jsdoc-type` -> `no-jsdoc-type-tabs`

* Removed rules:
    - `statics-order`
    - `lines-between-static`
    - `prevent-unused-typedef-vars`

* Added `type` field to rule metas
* Support for global constants, enums and typedefs
* Support for exported constants, enums and typedefs

## 1.5.0 (release date: 19.10.2018)

* `abstract-class-name-prefix`, `interface-name-prefix`: handle anonymous class declarations

* New rules:
    - `prevent-unused-jsdoc-types`

## 1.4.0 (release date: 9.10.2018)

* `jsdoc-type-spacing`: don't crash on an one-symbol token

* New rules:
    - `jsdoc-type-indent`

* Preserve the head and the tail of a JSDoc during autofix

## 1.3.0 (release date: 28.09.2018)

* `jsdoc-type-spacing`: tolerate multiline types
* `lines-around-class`: fixed scope handling for node environment
* `lines-between-statics`: don't group static expressions [BREAKING]

* Handle class and static expressions defined through a variable declaration

## 1.2.0 (release date: 30.08.2018)

* New redefinitions:
    - `no-param-reassign` to ignore report for self assignment with typecast

## 1.1.2 (release date: 2.08.2018)

* `lines-around-class`: handle nested classes

## 1.1.1 (release date: 30.07.2018)

* Use public fork of Doctrine instead of local one

## 1.1.0 (release date: 13.07.2018)

* `lines-around-class`: use `1` as the default value for `before` and `after`
* `prefer-shorthand-jsdoc-types`: autofixing; removed `consistent` option
* `jsdoc-type-spacing`: autofixing; completely new options (see `docs/rules/jsdoc-type-spacing`)
* `jsdoc-type-application-dot`: autofixing
* `jsdoc-tags-order`: autofixing

* JSDoc tokenization
* Rules documentation is separated and extended

## 1.0.0 (release date: 27.06.2018)

* `eslint@5`

## 0.6.0 (release date: 20.06.2018)

* `prefer-shorthand-jsdoc-types`: handle params without type
* `caps-const`: skip computed properties of an enum

* New rules:
    - `event-const-value`

## 0.5.0 (release date: 15.01.2018)

* New rules:
    - `prefer-shorthand-jsdoc-types`
    - `prevent-unused-typedef-vars`
    - `prevent-unused-meta-params`

## 0.4.1 (release date: 11.12.2017)

* `camelcase`: handling of destructuring

## 0.4.0 (release date: 11.12.2017)

* `no-unused-expressions`: consider property definitions from the prototype
* `caps-const`, `capitalized-enum`, `capitalized-typedef`: removed autofixing to avoid destructive code changes

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
