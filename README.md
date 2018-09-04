# eslint-plugin-interfaced

***

[ESLint](https://eslint.org) plugin with rules for approaches adopted by [Interfaced](http://interfaced.tv) company.

## Usage

1) Install the package:

```
npm i eslint-plugin-interfaced --save-dev
```

2) Specify "interfaced" as a plugin in your .eslintrc:

```
{
  plugins: [
    "interfaced"
  ]
}
```

3) Enable all of the rules that you would like to use in your .eslintrc:

```
{
  rules: [
    "interfaced/methods-order": ...
  ]
}
```

## Rules

### abstract-class-name-prefix

Enforce "Abstract" prefix for abstract class name.

### capitalized-enum

Enforce capitalization of the first letter of an enum.

### capitalized-typedef

Enforce capitalization of the first letter of a typedef.

### caps-const

Enforce caps notation for constant name and enum properties.

### event-const-desc

Enforce event description ("Fired with: ...") for event constant.

### event-const-value

Enforce event constant value to be a lowercase latinic string with dash sign delimiter.

### interface-name-prefix

Enforce "I" prefix for interface name.

### jsdoc-tags-order

Enforce specified order for JSDoc tags.

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

### methods-order

Enforce specified order for methods.

**Options**:

```
{
	scopesOrder: string[], // public, protected, private
	staticInTheEnd: boolean
}
```

### no-empty-method

Disallow empty methods when class is neither abstract, interface nor record.

### no-public-underscore

Disallow methods and properties with name that starts from "_" without private/protected access modifier.

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

### no-tabs-in-jsdoc-type

Disallow tab characters in JSDoc type.

### prefer-shorthand-jsdoc-types

Enforce usage of a shorthand notation for some JSDoc types when possible.

**Options**:

```
{
	optionalParam: string, // always, never
	nullableType: string // always, never
}
```

### prevent-unused-meta-params

Prevent interface, record, abstract or overriding method params to be marked as unused.

### prevent-unused-typedef-vars

Prevent typedef variable to be marked as unused.

### props-order

Enforce specified order for properties.

**Options**:

```
{
	scopesOrder: string[], // public, protected, private
	constInTheEnd: boolean
}
```

### statics-order

Enforce specified order for static expressions (const, enum, typedef).

**Options**:

```
{
	order: string[] // const, enum, typedef
}
```

### typecast-spacing (fixable)

Enforce spacing for typecast (JSDoc + parenthesis).

## Redefined rules

Some useful rules which are provided by ESLint are slightly inappropriate for Closure Compiler environment, 
so we redefine them with some adjusting for our requirements.

### [camelcase](https://eslint.org/docs/rules/camelcase)

Ignore report for arguments that have name starting with "opt_" (optional argument) or "var_" (variable arguments).

### [no-unused-expressions](https://eslint.org/docs/rules/no-unused-expressions)

Ignore report for typedef and property definition.

### [require-jsdoc](https://eslint.org/docs/rules/require-jsdoc)

Consider class expressions alongside with class declarations.

### [valid-jsdoc](https://eslint.org/docs/rules/valid-jsdoc)

Ignore report about "function has no return statement" for interface and record methods.
