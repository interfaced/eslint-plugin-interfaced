# interfaced/lines-around-class

Enforce newlines before and after class.

**Fixable:** this rule is automatically fixable by `--fix`.

## Options

```
{
	before: <number>,
	after: <number>,
	collisionPriority: <string>
}
```

#### before

How many newlines should be before class (including JSDoc). The default value is `1`.

#### after

How many newlines should be after class (including JSDoc). The default value is `1`.

#### collisionPriority

The case when `before` and `after` options are different may cause an inappropriate report for 2 classes that are defined one by one.
In this case we should know what option has higher priority.

Option `collisionPriority` is aimed to resolve such collisions. It can be either `'before'` or `'after'`.
The default value is `'before'`.

## Resources

* [Source](../../lib/rules/lines-around-class.js)
* [Tests](../../test/eslint/rules/lines-around-class.js)
