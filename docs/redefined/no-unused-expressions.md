# interfaced/no-unused-expressions

Ignore report for typedef and property definition.

## Examples

The following code causes the reports for `Typedef` and `this.prop` from original `no-unused-expressions`:

```js
/**
 * @typedef {{field: number}}
 */
let Typedef;
```

```js
class Klass {
	constructor() {
		/**
		 * @type {number}
		 */
		this.prop;
	}
}
```

but doesn't when `interfaced/no-unused-expressions` is used.

## Resources

* [Original](https://eslint.org/docs/rules/no-unused-expressions)
* [Source](../../lib/rules/redefined/no-unused-expressions.js)
* [Tests](../../test/eslint/rules/redefined/no-unused-expressions.js)
