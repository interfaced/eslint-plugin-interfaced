# interfaced/singular-enum

Enforce enum name to be singular.

## Examples

**Correct** code for this rule:

```js
/**
 * @enum {string}
 */
const Color = {
    RED: 'red',
    BLUE: 'blue'
};
```

**Incorrect** code for this rule:

```js
/**
 * @enum {string}
 */
const Colors = {
    RED: 'red',
    BLUE: 'blue'
};
```

## Resources

* [Source](../../lib/rules/singular-enum.js)
* [Tests](../../test/eslint/rules/singular-enum.js)
