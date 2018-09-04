# ESLint plugin "interfaced"

***

Collection of rules for an approaches adopted by "Interfaced" company

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

### newline-before-after-class (fixable)

Options:

```
{
	newlinesCountBefore: number,
	newlinesCountAfter: number,
	collisionPriority: string // before, after
}
```

### newline-between-methods (fixable)

Options:

```
{
	newlinesCount: number
}
```

### newline-between-props (fixable)

Options:

```
{
	newlinesCount: number
}
```

### newline-between-statics (fixable)

Options:

```
{
	newlinesCount: number
}
```

## Rules to implement (in order of priority)

* Check that class name for abstract class starts with "Abstract"
* Check that class name for interface class starts with "I"
* Enforce newline before/after `super` call
* Disallow tabs in typedef
* Enforce structure of multiline typedef
* Enforce empty method open/close curly brackets to be on the same line
* Expressions blacklist for old platforms
