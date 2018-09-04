# interfaced/statics-order

Enforce the specified order for static expressions (const, enum, typedef).

## Options

```
{
	order: <string[]>
}
```

#### order

An array of the types (`'const'`, `'enum'`, `'typedef'`) that indicates the order in which static expressions should be defined.
The default value is `['const', 'enum', 'typedef']`.

## Resources

* [Source](../../lib/rules/statics-order.js)
* [Tests](../../test/eslint/rules/statics-order.js)
