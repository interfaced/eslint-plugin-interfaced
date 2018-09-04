# interfaced/prefer-shorthand-jsdoc-types

Enforce usage of a shorthand notation for some JSDoc types when possible.

**Fixable:** this rule is automatically fixable by `--fix`.

## Options

```
{
	optionalParam: <string>,
	nullableType: <string>
}
```

#### optionalParam

Whether optional type (`=`) should be preferred to an union with `|undefined` in `@param` tag.
It can be either `'always'` or `'never'`. The default value is `'always'`.

#### nullableType

Whether nullable type (`?`) should be preferred to an union with `|null`.
It can be either `'always'` or `'never'`. The default value is `'always'`.

## Resources

* [Source](../../lib/rules/prefer-shorthand-jsdoc-types.js)
* [Tests](../../test/eslint/rules/prefer-shorthand-jsdoc-types.js)
