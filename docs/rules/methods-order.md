# interfaced/methods-order

Enforce the specified order for methods.

## Options

```
{
	scopesOrder: <string[]>,
	staticInTheEnd: <boolean>
}
```

#### scopesOrder

An array of the scopes (`'public'`, `'protected'`, `'private'`) that indicates the order in which methods should be defined in the class body.
The default value is `['public', 'protected', 'private']`.

#### staticInTheEnd

Whether static methods should be in the end of the class body. The default value is `true`.

## Resources

* [Source](../../lib/rules/methods-order.js)
* [Tests](../../test/eslint/rules/methods-order.js)
