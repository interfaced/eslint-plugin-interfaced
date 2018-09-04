# interfaced/require-jsdoc

The original rule doesn't check `ClassExpression` (only `ClassDeclaration`).
The redefined rule adds this check when option `require.ClassDeclaration` is given.

## Examples

The following code doesn't cause the report for `Klass` from original `require-jsdoc`:

```js
const Klass = class {}
```

but does when `interfaced/require-jsdoc` is used.

## Resources

* [Original](https://eslint.org/docs/rules/require-jsdoc)
* [Source](../../lib/rules/redefined/require-jsdoc.js)
* [Tests](../../test/eslint/rules/redefined/require-jsdoc.js)
