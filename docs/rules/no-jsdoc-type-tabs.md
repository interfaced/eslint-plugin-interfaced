# interfaced/no-jsdoc-type-tabs

Disallow tab characters in JSDoc type.

## Examples

**Correct** code for this rule:

```js
/**
 * @type {{
 *     key: number
 *}}
 */
```

**Incorrect** code for this rule:

```js
/**
 * @type {{
 * \t key: number
 * }}
 */
```

## Resources

* [Source](../../lib/rules/no-jsdoc-type-tabs.js)
* [Tests](../../test/eslint/rules/no-jsdoc-type-tabs.js)
