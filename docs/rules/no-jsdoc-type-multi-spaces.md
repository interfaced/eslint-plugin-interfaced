# interfaced/no-jsdoc-type-multi-spaces

Disallow multiple spaces in JSDoc type.

**Fixable:** this rule is automatically fixable by `--fix`.

## Examples

**Correct** code for this rule:

```js
/**
 * @type {string | number}
 */
```

**Incorrect** code for this rule:

```js
/**
 * @enum {string  |  number}
 */
```

## Resources

* [Source](../../lib/rules/no-jsdoc-type-multi-spaces.js)
* [Tests](../../test/eslint/rules/no-jsdoc-type-multi-spaces.js)
