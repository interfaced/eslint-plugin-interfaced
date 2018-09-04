# ESLint plugin "interfaced"

***

Collection of rules for approaches adopted by "Interfaced" company

## Usage

1) Install the package

```
npm i eslint-plugin-interfaced --save-dev
```

2) Specify "interfaced" as plugin in your .eslintrc

```
{
  "plugins": [
    "interfaced"
  ]
}
```

3) Enable all of the rules that you would like to use in your .eslintrc

```
{
  "rules": [
    "interfaced/methods-order": ...
  ]
}
```

## Rules

### typecast-spacing (fixable)

Enforce space between jsdoc and parenthesis (typecast).

### caps-const (fixable)

Enforce caps notation for constant names and enum properties.

### capitalized-enum (fixable)

Enforce capitalization of the first letter of an enum.

### capitalized-typedef (fixable)

Enforce capitalization of the first letter of a typedef.

### event-const-desc

Enforce event description ("Fired with: ...") for event constant.

### valid-jsdoc

It uses [original](https://eslint.org/docs/rules/valid-jsdoc) rule, but ignores report about "function has no return statement" for interface and record methods.

### no-empty-method

Disallow empty methods except abstract, interface and record methods.

### no-public-underscore

Disallow methods and properties with name that starts from "_" without private/protected access modifier.

### no-unused-expressions

It uses [original](https://eslint.org/docs/rules/no-unused-expressions) rule, but ignores report for typedefs and property definitions.

### no-restricted-jsdoc-tags

Disallow specified JSDoc tags.

**Options**:

```
{
	tags: Array<string|{tag: string, allowWithTags: string[], allowWithTypes: string[]}>
}
```

**Example**:

```
{
	tags: ['returns', {tag: 'extends', allowWithTags: ['interface'], allowWithTypes: ['TypeApplication']}]
}
```

### jsdoc-tags-order

Enforce specified JSDoc tags order.

**Options**:

```
{
	tagsOrder: string[] // abstract, param, return etc.
}
```

### jsdoc-type-application-dot

Enforce dot before "<" symbol in JSDoc type application.

**Options**:

```
string // always, never, consistent
```

### jsdoc-type-spacing

Enforce consistent spacing in JSDoc type.

**Options**:

```
{
	typeApplications: string, // always, never
	functionParams: string, // always, never
	functionResult: string, // always, never
	recordFields: string, // always, never
	unionElements: string // always, never
}
```

### methods-order

Enforce specified methods order.

**Options**:

```
{
	scopesOrder: string[], // public, protected, private
	staticInTheEnd: boolean
}
```

### props-order

Enforce specified properties order.

**Options**:

```
{
	scopesOrder: string[], // public, protected, private
	constInTheEnd: boolean
}
```

### statics-order

Enforce specified static expressions (const, enum, typedef) order.

**Options**:

```
{
	order: string[] // const, enum, typedef
}
```

### lines-around-class (fixable)

Enforce newlines before and after class.

**Options**:

```
{
	before: number,
	after: number,
	collisionPriority: string // before, after
}
```

### lines-between-methods (fixable)

Enforce newlines between methods.

**Options**:

```
{
	amount: number
}
```

### lines-between-props (fixable)

Enforce newlines between properties.

**Options**:

```
{
	amount: number
}
```

### lines-between-statics (fixable)

Enforce newline between static expressions (const, enum, typedef).

**Options**:

```
{
	amount: number
}
```

## Rules to implement (in order of priority)

* Enforce `super` call when method is marked by `@override`
* Check that class name for abstract class starts with `Abstract`
* Check that class name for interface class starts with `I`
* Disallow `@override` JSDoc tag for classes without extending/implementing
* Enforce newline before/after `super` call
* Disallow tabs in typedef
* Enforce structure of multiline typedef
* Enforce empty method open/close curly brackets to be on the same line
* Expressions blacklist for old platforms
