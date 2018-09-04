# interfaced/camelcase

Ignore report for arguments that have name starting with `opt_` (optional) or `var_` (variable).

## Examples

The following code causes the report for `opt_arg2` from original `camelcase`:

```js
function func(arg, opt_arg2) {}
```

but doesn't when `interfaced/camelcase` is used.

## Resources

* [Original](https://eslint.org/docs/rules/camelcase)
* [Source](../../lib/rules/redefined/camelcase.js)
* [Tests](../../test/eslint/rules/camelcase.js)
