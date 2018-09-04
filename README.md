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
  plugins: [
    "interfaced"
  ]
}
```

3) Enable all of the rules that you would like to use in your .eslintrc

```
{
  rules: [
    "interfaced/methods-order": ...
  ]
}
```

## Rules

### typecast-spacing (fixable)

Enforce space between jsdoc and parenthesis (typecast)

### caps-const

Enforce caps notation for constant names and enum properties

### capitalized-enum

Enforce capitalization of the first letter of an enum

### capitalized-typedef

Enforce capitalization of the first letter of a typedef

### abstract-class-name-prefix

Enforce "Abstract" prefix for abstract class names

### interface-name-prefix

Enforce "I" prefix for interface names

### event-const-desc

Enforce event description ("Fired with: ...") for event constant

### no-empty-method

Disallow empty methods except abstract, interface and record methods

### no-public-underscore

Disallow methods and properties with name that starts from "_" without private/protected access modifier

### no-tabs-in-jsdoc-type

Disallow tab characters in JSDoc type

### no-restricted-jsdoc-tags

Disallow specified JSDoc tags

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

Enforce specified JSDoc tags order

**Options**:

```
{
	tagsOrder: string[] // abstract, param, return etc.
}
```

### jsdoc-type-application-dot

Enforce dot before "<" symbol in JSDoc type application

**Options**:

```
string // always, never, consistent
```

### jsdoc-type-spacing

Enforce consistent spacing in JSDoc type

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

Enforce specified methods order

**Options**:

```
{
	scopesOrder: string[], // public, protected, private
	staticInTheEnd: boolean
}
```

### props-order

Enforce specified properties order

**Options**:

```
{
	scopesOrder: string[], // public, protected, private
	constInTheEnd: boolean
}
```

### statics-order

Enforce specified static expressions (const, enum, typedef) order

**Options**:

```
{
	order: string[] // const, enum, typedef
}
```

### lines-around-class (fixable)

Enforce newlines before and after class

**Options**:

```
{
	before: number,
	after: number,
	collisionPriority: string // before, after
}
```

### lines-between-methods (fixable)

Enforce newlines between methods

**Options**:

```
{
	amount: number
}
```

### lines-between-props (fixable)

Enforce newlines between properties

**Options**:

```
{
	amount: number
}
```

### lines-between-statics (fixable)

Enforce newline between static expressions (const, enum, typedef)

**Options**:

```
{
	amount: number
}
```

## Redefined rules

Some useful rules that provides ESLint are slightly inappropriate for Closure Compiler environment, 
so we redefine them with some adjusting for our requirements

### [no-unused-expressions](https://eslint.org/docs/rules/no-unused-expressions)

Ignore report for typedefs and property definitions

### [valid-jsdoc](https://eslint.org/docs/rules/valid-jsdoc)

Ignore report about "function has no return statement" for interface and record methods

### [camelcase](https://eslint.org/docs/rules/camelcase)

Ignore report for arguments which name has "opt_" (optional argument) or "var_" (variable arguments) prefix

### [require-jsdoc](https://eslint.org/docs/rules/require-jsdoc)

Consider class expressions alongside with class declarations
