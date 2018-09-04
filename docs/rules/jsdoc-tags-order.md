# interfaced/jsdoc-tags-order

Enforce the specified order for JSDoc tags.

**Fixable:** this rule is automatically fixable by `--fix`.

## Options

```
{
	tagsOrder: <string[]>
}
```

#### tagsOrder

An array of tag names (e.g.: `param`, `type`, `return`, ...).
See constant `KNOWN_JSDOC_TAGS` in [consts.js](../../lib/consts.js) for list of all supported tag names.

## Resources

* [Source](../../lib/rules/jsdoc-tags-order.js)
* [Tests](../../test/eslint/rules/jsdoc-tags-order.js)
