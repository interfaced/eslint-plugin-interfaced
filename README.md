# eslint-plugin-interfaced

[ESLint](https://eslint.org) plugin with essential rules for [Closure Compiler](https://developers.google.com/closure/compiler/) environment and [JSDoc](http://usejsdoc.org/).

## Usage

1) Install the package:

```sh
npm i eslint-plugin-interfaced --save-dev
```

2) Specify "interfaced" as a plugin in your `.eslintrc`:

```json
{
  "plugins": [
    "interfaced"
  ]
}
```

3) Enable all of the rules that you would like to use in your `.eslintrc`:

```json
{
  "rules": {
    "interfaced/abstract-class-name-prefix": "error"
  }
}
```

## Rules

### JSDoc

* [interfaced/jsdoc-tags-order](docs/rules/jsdoc-tags-order.md) - enforce the specified order for JSDoc tags
* [interfaced/jsdoc-type-application-dot](docs/rules/jsdoc-type-application-dot.md) - enforce dot before "<" symbol in JSDoc type application
* [interfaced/jsdoc-type-indent](docs/rules/jsdoc-type-indent.md) - enforce consistent indentation in JSDoc type
* [interfaced/jsdoc-type-spacing](docs/rules/jsdoc-type-spacing.md) - enforce consistent spacing in JSDoc type
* [interfaced/no-jsdoc-type-multi-spaces](docs/rules/no-jsdoc-type-multi-spaces.md) - disallow multiple spaces in JSDoc type
* [interfaced/no-jsdoc-type-tabs](docs/rules/no-jsdoc-type-tabs.md) - disallow tab characters in JSDoc type
* [interfaced/no-restricted-jsdoc-tags](docs/rules/no-restricted-jsdoc-tags.md) - disallow the specified JSDoc tags
* [interfaced/prefer-shorthand-jsdoc-types](docs/rules/prefer-shorthand-jsdoc-types.md) - enforce usage of a shorthand notation for some JSDoc types
* [interfaced/prevent-unused-jsdoc-types](docs/rules/prevent-unused-jsdoc-types.md) - prevent variables used in JSDoc type to be marked as unused

### Naming convention

* [interfaced/abstract-class-name-prefix](docs/rules/abstract-class-name-prefix.md) - enforce "Abstract" prefix for abstract class name
* [interfaced/capitalized-enum](docs/rules/capitalized-enum.md) - enforce capitalization of the first letter of an enum
* [interfaced/capitalized-typedef](docs/rules/capitalized-typedef.md) - enforce capitalization of the first letter of a typedef
* [interfaced/caps-const](docs/rules/caps-const.md) - enforce caps notation for constant name and enum properties
* [interfaced/event-const-desc](docs/rules/event-const-desc.md) - enforce event description ("Fired with: ...") for event constant
* [interfaced/event-const-value](docs/rules/event-const-value.md) - enforce event constant value to be a lowercase latin string with dash sign delimiter
* [interfaced/interface-name-prefix](docs/rules/interface-name-prefix.md) - enforce "I" prefix for interface name
* [interfaced/singular-enum](docs/rules/singular-enum.md) - enforce enum name to be singular

### Stylistic issues

* [interfaced/lines-around-class](docs/rules/lines-around-class.md) - enforce newlines before and after class
* [interfaced/lines-between-methods](docs/rules/lines-between-methods.md) - enforce newlines between methods
* [interfaced/lines-between-props](docs/rules/lines-between-props.md) - enforce newlines between properties
* [interfaced/methods-order](docs/rules/methods-order.md) - enforce the specified order for methods
* [interfaced/props-order](docs/rules/props-order.md) - enforce the specified order for properties
* [interfaced/typecast-spacing](docs/rules/typecast-spacing.md) - enforce spacing in typecast (JSDoc + parenthesis)

### Other

* [interfaced/no-empty-method](docs/rules/no-empty-method.md) - disallow empty methods when class is neither abstract, interface nor record
* [interfaced/no-public-underscore](docs/rules/no-public-underscore.md) - disallow methods and properties with name that starts from "_" without private/protected access modifier
* [interfaced/prevent-unused-meta-params](docs/rules/prevent-unused-meta-params.md) - prevent interface, record, abstract or overriding method params to be marked as unused

### Redefined

Some useful rules provided by ESLint are slightly inappropriate for our environment, so we redefine them with some adjusting:

* [interfaced/camelcase](docs/redefined/camelcase.md)
* [interfaced/no-param-reassign](docs/redefined/no-param-reassign.md)
* [interfaced/no-unused-expressions](docs/redefined/no-unused-expressions.md)
* [interfaced/require-jsdoc](docs/redefined/require-jsdoc.md)
* [interfaced/valid-jsdoc](docs/redefined/valid-jsdoc.md)
