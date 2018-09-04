# interfaced/props-order

Enforce the specified order for properties.

## Options

```
{
	scopesOrder: <string[]>,
	constInTheEnd: <boolean>
}
```

#### scopesOrder

An array of the scopes (`'public'`, `'protected'`, `'private'`) that indicates the order in which props should be defined in the class constructor.
The default value is `['public', 'protected', 'private']`.

#### constInTheEnd

Whether consts (props marked by `@const`) should be in the end of the class constructor. The default value is `true`.

## Resources

* [Source](../../lib/rules/props-order.js)
* [Tests](../../test/eslint/rules/props-order.js)
