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

### space-in-typecast (fixable)

No options

### caps-const (fixable)

No options

### event-const-desc

No options

### no-empty-method

No options

### no-public-underscore

No options

### no-restricted-jsdoc-tags

Options:

```
{
	tags: Array<string|{tag: string, allowWithTags: string[], allowWithTypes: string[]}>
}
```

Example:

```
{
	tags: ['returns', {tag: 'extends', allowWithTags: ['interface'], allowWithTypes: ['TypeApplication']}]
}
```

### jsdoc-tags-order

Options:

```
{
	tagsOrder: string[] // abstract, param, return etc.
}
```

### methods-order

Options:

```
{
	scopesOrder: string[], // public, protected, private
	staticInTheEnd: boolean
}
```

### props-order

Options:

```
{
	scopesOrder: string[], // public, protected, private
	constInTheEnd: boolean
}
```

### statics-order

Options:

```
{
	order: string[] // const, enum, typedef
}
```

### lines-around-class (fixable)

Options:

```
{
	before: number,
	after: number,
	collisionPriority: string // before, after
}
```

### lines-between-methods (fixable)

Options:

```
{
	amount: number
}
```

### lines-between-props (fixable)

Options:

```
{
	amount: number
}
```

### lines-between-statics (fixable)

Options:

```
{
	amount: number
}
```

## Rules to implement (in order of priority)

* Enforce `super` call when method is marked by `@override`
* Check that class name for abstract class starts with `Abstract`
* Check that class name for interface class starts with `I`
* Disallow `.` in generics (e.g.: `Klass.<number>` is invalid)
* Disallow `@override` JSDoc tag for classes without extending/implementing
* Enforce newline before/after `super` call
* Disallow tabs in typedef
* Enforce structure of multiline typedef
* Enforce empty method open/close curly brackets to be on the same line
* Expressions blacklist for old platforms
