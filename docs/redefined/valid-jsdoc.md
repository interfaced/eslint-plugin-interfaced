# interfaced/valid-jsdoc

Ignore report about "function has no return statement" for interface and record methods.

## Examples

The following code causes the report for `method` from original `valid-jsdoc`:

```js
/**
 * @interface
 */
class Interface {
	/**
	 * @return {number}
	 */
	method() {}
}
```

but doesn't when `interfaced/valid-jsdoc` is used.

## Resources

* [Original](https://eslint.org/docs/rules/valid-jsdoc)
* [Source](../../lib/rules/redefined/valid-jsdoc.js)
* [Tests](../../test/eslint/rules/redefined/valid-jsdoc.js)
