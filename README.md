# eslint-plugin-interfaced

[ESLint](https://eslint.org) plugin with rules for the approaches adopted by [Interfaced](http://interfaced.tv) company.

## Usage

1) Install the package:

```sh
npm i eslint-plugin-interfaced --save-dev
```

2) Specify "interfaced" as a plugin in your .eslintrc:

```json
{
  "plugins": [
    "interfaced"
  ]
}
```

3) Enable all of the rules that you would like to use in your .eslintrc:

```json
{
  "rules": {
    "interfaced/abstract-class-name-prefix": "error"
  }
}
```

## Rules

* [interfaced/abstract-class-name-prefix](docs/rules/abstract-class-name-prefix.md)
* [interfaced/capitalized-enum](docs/rules/capitalized-enum.md)
* [interfaced/capitalized-typedef](docs/rules/capitalized-typedef.md)
* [interfaced/caps-const](docs/rules/caps-const.md)
* [interfaced/event-const-desc](docs/rules/event-const-desc.md)
* [interfaced/event-const-value](docs/rules/event-const-value.md)
* [interfaced/interface-name-prefix](docs/rules/interface-name-prefix.md)
* [interfaced/jsdoc-tags-order](docs/rules/jsdoc-tags-order.md)
* [interfaced/jsdoc-type-application-dot](docs/rules/jsdoc-type-application-dot.md)
* [interfaced/jsdoc-type-indent](docs/rules/jsdoc-type-indent.md)
* [interfaced/jsdoc-type-spacing](docs/rules/jsdoc-type-spacing.md)
* [interfaced/lines-around-class](docs/rules/lines-around-class.md)
* [interfaced/lines-between-methods](docs/rules/lines-between-methods.md)
* [interfaced/lines-between-props](docs/rules/lines-between-props.md)
* [interfaced/lines-between-statics](docs/rules/lines-between-statics.md)
* [interfaced/methods-order](docs/rules/methods-order.md)
* [interfaced/no-empty-method](docs/rules/no-empty-method.md)
* [interfaced/no-public-underscore](docs/rules/no-public-underscore.md)
* [interfaced/no-restricted-jsdoc-tags](docs/rules/no-restricted-jsdoc-tags.md)
* [interfaced/no-tabs-in-jsdoc-type](docs/rules/no-tabs-in-jsdoc-type.md)
* [interfaced/prefer-shorthand-jsdoc-types](docs/rules/prefer-shorthand-jsdoc-types.md)
* [interfaced/prevent-unused-jsdoc-types](docs/rules/prevent-unused-jsdoc-types.md)
* [interfaced/prevent-unused-meta-params](docs/rules/prevent-unused-meta-params.md)
* [interfaced/prevent-unused-typedef-vars](docs/rules/prevent-unused-typedef-vars.md)
* [interfaced/props-order](docs/rules/props-order.md)
* [interfaced/statics-order](docs/rules/statics-order.md)
* [interfaced/typecast-spacing](docs/rules/typecast-spacing.md)

## Redefined rules

Some useful rules which are provided by ESLint are slightly inappropriate for Closure Compiler environment, 
so we redefine them with some adjusting for our requirements.

* [interfaced/camelcase](docs/redefined/camelcase.md)
* [interfaced/no-param-reassign](docs/redefined/no-param-reassign.md)
* [interfaced/no-unused-expressions](docs/redefined/no-unused-expressions.md)
* [interfaced/require-jsdoc](docs/redefined/require-jsdoc.md)
* [interfaced/valid-jsdoc](docs/redefined/valid-jsdoc.md)
