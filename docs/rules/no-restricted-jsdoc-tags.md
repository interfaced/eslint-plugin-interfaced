# interfaced/no-restricted-jsdoc-tags

Disallow the specified JSDoc tags.

## Options

```
{
	tags: <string[]>|{
	    tag: <string>,
	    allowWithTags: <string[]>,
	    allowWithTypes: <string[]>
	}[]>
}
```

#### tags

An array of tag names (e.g.: `param`, `type`, `return`, ...) or an object with fields `tag`, `allowWithTags`, `allowWithTypes`.

With an object instead of plain tag name you can achieve more precise validating. For example you want to disallow `@extends`,
except the cases when its type is type application (generics in Closure Compiler) or the JSDoc has `@interface` alongside (interface extending in Closure Compiler):

```
{
	tags: [{
	    tag: 'extends',
	    allowWithTags: ['interface'],
	    allowWithTypes: ['TypeApplication']
	}]
}
```

See constants `KNOWN_JSDOC_TAGS` for list of all supported tag names and `KNOWN_JSDOC_TYPES` for list of al supported tag types in [consts.js](../../lib/consts.js).

## Resources

* [Source](../../lib/rules/no-restricted-jsdoc-tags.js)
* [Tests](../../test/eslint/rules/no-restricted-jsdoc-tags.js)
