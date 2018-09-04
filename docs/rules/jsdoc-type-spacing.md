# interfaced/jsdoc-type-spacing

Enforce consistent spacing in JSDoc type.

**Fixable:** this rule is automatically fixable by `--fix`.

## Options

```
{
	topBraces: <string>,
	parens: <string>,
	unaryOperator: <string>,

	unionPipe: {
		before: <string>,
	 	after: <string>
	},

	typeApplicationBrackets: <string>,
	typeApplicationComma: {
		before: <string>,
		after: <string>
	},

	recordBraces: <string>,
	recordFieldComma: {
		before: <string>,
		after: <string>
	},
	recordFieldColon: {
		before: <string>,
		after: <string>
	},

	functionKeyword: <string>,
	functionParens: <string>,
	functionParamComma: {
		before: <string>,
		after: <string>
	},
	functionParamColon: {
		before: <string>,
		after: <string>
	},
	functionResultColon: {
		before: <string>,
		after: <string>
	}
}
```

Each of the fields can be either `'always'` or `'never'`. The default value for each field is `'never'`.

#### topBraces

Checks spacing after open brace and before close brace in top type.

```js
/**
 * @return { number }
 */
```

#### parens

Checks spacing after open parenthesis and before close parenthesis in any type.

```js
/**
 * @return {( number )}
 */
```

#### unaryOperator

Checks spacing before (optional type) or after (other) the unary operators:

* Nullable type - `?`

```js
/**
 * @return {? number}
 */
```

* Non nullable type - `!`

```js
/**
 * @return {! number}
 */
```

* Optional type - `=`

```js
/**
 * @param {number =} arg
 */
```

* Rest type - `...`

```js
/**
 * @param {... number} args
 */
```

#### unionPipe

Checks spacing before and after pipes in union type.

```js
/**
 * @return {number | string}
 */
```

#### typeApplicationBrackets

Checks spacing after open brace (`<`) and before close brace (`>`) in type application.

```js
/**
 * @return {Array< number >}
 */
```

#### typeApplicationComma

Checks spacing before and after commas in type application.

```js
/**
 * @return {Object<string , number>}
 */
```

#### recordBraces

Checks spacing after open brace and before close brace in record type.

```js
/**
 * @return {{ field:number }}
 */
```

#### recordFieldComma

Checks spacing before and after commas in record type.

```js
/**
 * @return {{field1:number , field2:number}}
 */
```

#### recordFieldColon

Checks spacing before and after colons in record type.

```js
/**
 * @return {{field1 : number,field2 : number}}
 */
```

#### functionKeyword

Checks spacing after keyword `function` in function type.

```js
/**
 * @return {function ()}
 */
```

#### functionParens

Checks spacing after open parenthesis and before close parenthesis in function type.

```js
/**
 * @return {function( number )}
 */
```

#### functionParamComma

Checks spacing before and after commas in function type.

```js
/**
 * @return {function(number , string)}
 */
```

#### functionParamColon

Checks spacing before and after colons in function type.

```js
/**
 * @return {function(this : Object)}
 */
```

#### functionResultColon

Checks spacing before and after colon of result part in function type.

```js
/**
 * @return {function() : string}
 */
```

## Resources

* [Source](../../lib/rules/jsdoc-type-spacing.js)
* [Tests](../../test/eslint/rules/jsdoc-type-spacing.js)
