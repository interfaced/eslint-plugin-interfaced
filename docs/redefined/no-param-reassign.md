# interfaced/no-param-reassign

Ignore report for self assignment with typecast.

## Examples

The following code causes the reports for `arg` from original `no-param-reassign`:

```js
function func(arg) {
	arg = /** @type {string} */ (arg);
}
```

and when `props` option is set to `true`:

```js
function func(arg) {
	arg.a = /** @type {string} */ (arg.a);
}
```

but doesn't when `interfaced/no-param-reassign` is used.

## Resources

* [Original](https://eslint.org/docs/rules/no-param-reassign)
* [Source](../../lib/rules/redefined/no-param-reassign.js)
* [Tests](../../test/eslint/rules/redefined/no-param-reassign.js)
