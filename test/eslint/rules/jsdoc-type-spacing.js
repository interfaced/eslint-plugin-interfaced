const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			topBraces: 'always'
		}],
		code: concat(
			`/**`,
			` * @return { Object }`,
			` */`
		)
	}, {
		options: [{
			topBraces: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object}`,
			` */`
		)
	}, {
		options: [{
			parens: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {( Object<( string )> )}`,
			` */`
		)
	}, {
		options: [{
			parens: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {(Object<(string)>)}`,
			` */`
		)
	}, {
		options: [{
			unaryOperator: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {... Object} arg1`,
			` * @param {! Object =} arg2`,
			` * @return {? Object}`,
			` */`
		)
	}, {
		options: [{
			unaryOperator: 'never'
		}],
		code: concat(
			`/**`,
			` * @param {...Object} arg1`,
			` * @param {!Object=} arg2`,
			` * @return {?Object}`,
			` */`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object | Array | Proxy}`,
			` */`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'always',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object |Array |Proxy}`,
			` */`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'never',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object| Array| Proxy}`,
			` */`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object|Array|Proxy}`,
			` */`
		)
	}, {
		options: [{
			typeApplicationBrackets: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {Object< string >}`,
			` */`
		)
	}, {
		options: [{
			typeApplicationBrackets: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object<string>}`,
			` */`
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string , number , symbol>}`,
			` */`
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'always',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string ,number ,symbol>}`,
			` */`
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'never',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string, number, symbol>}`,
			` */`
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string,number,symbol>}`,
			` */`
		)
	}, {
		options: [{
			recordBraces: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {{ field:number }}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordBraces: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {{field:number}}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number , field2:number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field1:number ,`,
			` *     field2:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'always',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number ,field2:number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field1:number ,`,
			` *     field2:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'never',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number, field2:number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field1:number,`,
			` *     field2:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number,field2:number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field1:number,`,
			` *     field2:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field : number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field : number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'always',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field :number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field :number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'never',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field: number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field: number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field:number}}`,
			` */`,

			`/**`,
			` * @return {{`,
			` *     field:number`,
			` * }}`,
			` */`
		)
	}, {
		options: [{
			functionKeyword: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function ()}`,
			` */`
		)
	}, {
		options: [{
			functionKeyword: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function()}`,
			` */`
		)
	}, {
		options: [{
			functionParens: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function( string,number )}`,
			` */`
		)
	}, {
		options: [{
			functionParens: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function(string,number)}`,
			` */`
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'always',
				after: 'always'
			},
			functionParamColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this : Object , new : Object , string , number)}`,
			` */`
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'always',
				after: 'never'
			},
			functionParamColon: {
				before: 'always',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this :Object ,new :Object ,string ,number)}`,
			` */`
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'never',
				after: 'always'
			},
			functionParamColon: {
				before: 'never',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this: Object, new: Object, string, number)}`,
			` */`
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'never',
				after: 'never'
			},
			functionParamColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this:Object,new:Object,string,number)}`,
			` */`
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function() : number}`,
			` */`
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'always',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function() :number}`,
			` */`
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'never',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(): number}`,
			` */`
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function():number}`,
			` */`
		)
	}],
	invalid: [{
		options: [{
			topBraces: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {Object }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return { Object }`,
			` */`
		),
		errors: errors(
			`Top type should have space after "{".`
		)
	}, {
		options: [{
			topBraces: 'always'
		}],
		code: concat(
			`/**`,
			` * @return { Object}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return { Object }`,
			` */`
		),
		errors: errors(
			`Top type should have space before "}".`
		)
	}, {
		options: [{
			topBraces: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {  Object}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object}`,
			` */`
		),
		errors: errors(
			`Top type should not have space after "{".`
		)
	}, {
		options: [{
			topBraces: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object  }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object}`,
			` */`
		),
		errors: errors(
			`Top type should not have space before "}".`
		)
	}, {
		options: [{
			parens: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {(Object )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {( Object )}`,
			` */`
		),
		errors: errors(
			`Type should have space after "(".`
		)
	}, {
		options: [{
			parens: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {( Object)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {( Object )}`,
			` */`
		),
		errors: errors(
			`Type should have space before ")".`
		)
	}, {
		options: [{
			parens: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {(  Object)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {(Object)}`,
			` */`
		),
		errors: errors(
			`Type should not have space after "(".`
		)
	}, {
		options: [{
			parens: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {(Object  )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {(Object)}`,
			` */`
		),
		errors: errors(
			`Type should not have space before ")".`
		)
	}, {
		options: [{
			unaryOperator: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {!Object}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {! Object}`,
			` */`
		),
		errors: errors(
			`Non nullable type should have space after "!".`
		)
	}, {
		options: [{
			unaryOperator: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {?Object}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {? Object}`,
			` */`
		),
		errors: errors(
			`Nullable type should have space after "?".`
		)
	}, {
		options: [{
			unaryOperator: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {...Object} arg`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {... Object} arg`,
			` */`
		),
		errors: errors(
			`Rest type should have space after "...".`
		)
	}, {
		options: [{
			unaryOperator: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {Object=} arg`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {Object =} arg`,
			` */`
		),
		errors: errors(
			`Optional type should have space before "=".`
		)
	}, {
		options: [{
			unaryOperator: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {!  Object}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {!Object}`,
			` */`
		),
		errors: errors(
			`Non nullable type should not have space after "!".`
		)
	}, {
		options: [{
			unaryOperator: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {?  Object}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {?Object}`,
			` */`
		),
		errors: errors(
			`Nullable type should not have space after "?".`
		)
	}, {
		options: [{
			unaryOperator: 'never'
		}],
		code: concat(
			`/**`,
			` * @param {...  Object} arg`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {...Object} arg`,
			` */`
		),
		errors: errors(
			`Rest type should not have space after "...".`
		)
	}, {
		options: [{
			unaryOperator: 'never'
		}],
		code: concat(
			`/**`,
			` * @param {Object  =} arg`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {Object=} arg`,
			` */`
		),
		errors: errors(
			`Optional type should not have space before "=".`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object| Array}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object | Array}`,
			` */`
		),
		errors: errors(
			`Union should have space before "|".`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object |Array}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object | Array}`,
			` */`
		),
		errors: errors(
			`Union should have space after "|".`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object  |Array}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object|Array}`,
			` */`
		),
		errors: errors(
			`Union should not have space before "|".`
		)
	}, {
		options: [{
			unionPipe: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object|  Array}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object|Array}`,
			` */`
		),
		errors: errors(
			`Union should not have space after "|".`
		)
	}, {
		options: [{
			typeApplicationBrackets: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {Object<string >}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object< string >}`,
			` */`
		),
		errors: errors(
			`Type application should have space after "<".`
		)
	}, {
		options: [{
			typeApplicationBrackets: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {Object< string>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object< string >}`,
			` */`
		),
		errors: errors(
			`Type application should have space before ">".`
		)
	}, {
		options: [{
			typeApplicationBrackets: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object<  string>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object<string>}`,
			` */`
		),
		errors: errors(
			`Type application should not have space after "<".`
		)
	}, {
		options: [{
			typeApplicationBrackets: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object<string  >}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object<string>}`,
			` */`
		),
		errors: errors(
			`Type application should not have space before ">".`
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string, number>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object<string , number>}`,
			` */`
		),
		errors: errors(
			'Type application should have space before ",".'
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string ,number>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object<string , number>}`,
			` */`
		),
		errors: errors(
			'Type application should have space after ",".'
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string  ,number>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object<string,number>}`,
			` */`
		),
		errors: errors(
			'Type application should not have space before ",".'
		)
	}, {
		options: [{
			typeApplicationComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {Object<string,  number>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Object<string,number>}`,
			` */`
		),
		errors: errors(
			'Type application should not have space after ",".'
		)
	}, {
		options: [{
			recordBraces: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {{field:number }}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{ field:number }}`,
			` */`
		),
		errors: errors(
			'Record should have space after "{".'
		)
	}, {
		options: [{
			recordBraces: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {{ field:number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{ field:number }}`,
			` */`
		),
		errors: errors(
			'Record should have space before "}".'
		)
	}, {
		options: [{
			recordBraces: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {{  field:number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field:number}}`,
			` */`
		),
		errors: errors(
			'Record should not have space after "{".'
		)
	}, {
		options: [{
			recordBraces: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {{field:number  }}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field:number}}`,
			` */`
		),
		errors: errors(
			'Record should not have space before "}".'
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number, field2:number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field1:number , field2:number}}`,
			` */`
		),
		errors: errors(
			'Record should have space before ",".'
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number ,field2:number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field1:number , field2:number}}`,
			` */`
		),
		errors: errors(
			'Record should have space after ",".'
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number  ,field2:number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field1:number,field2:number}}`,
			` */`
		),
		errors: errors(
			'Record should not have space before ",".'
		)
	}, {
		options: [{
			recordFieldComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field1:number,  field2:number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field1:number,field2:number}}`,
			` */`
		),
		errors: errors(
			'Record should not have space after ",".'
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field: number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field : number}}`,
			` */`
		),
		errors: errors(
			'Record should have space before ":".'
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field :number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field : number}}`,
			` */`
		),
		errors: errors(
			'Record should have space after ":".'
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field  :number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field:number}}`,
			` */`
		),
		errors: errors(
			'Record should not have space before ":".'
		)
	}, {
		options: [{
			recordFieldColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {{field:  number}}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {{field:number}}`,
			` */`
		),
		errors: errors(
			'Record should not have space after ":".'
		)
	}, {
		options: [{
			functionKeyword: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function()}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function ()}`,
			` */`
		),
		errors: errors(
			'Function should have space after "function".'
		)
	}, {
		options: [{
			functionKeyword: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function  ()}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function()}`,
			` */`
		),
		errors: errors(
			'Function should not have space after "function".'
		)
	}, {
		options: [{
			functionParens: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function(string,number )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function( string,number )}`,
			` */`
		),
		errors: errors(
			'Function should have space after "(".'
		)
	}, {
		options: [{
			functionParens: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function( string,number)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function( string,number )}`,
			` */`
		),
		errors: errors(
			'Function should have space before ")".'
		)
	}, {
		options: [{
			functionParens: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function(  string,number)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(string,number)}`,
			` */`
		),
		errors: errors(
			'Function should not have space after "(".'
		)
	}, {
		options: [{
			functionParens: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function(string,number  )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(string,number)}`,
			` */`
		),
		errors: errors(
			'Function should not have space before ")".'
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(number, number)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(number , number)}`,
			` */`
		),
		errors: errors(
			'Function should have space before ",".'
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(number ,number)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(number , number)}`,
			` */`
		),
		errors: errors(
			'Function should have space after ",".'
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(number  ,number)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(number,number)}`,
			` */`
		),
		errors: errors(
			'Function should not have space before ",".'
		)
	}, {
		options: [{
			functionParamComma: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(number,  number)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(number,number)}`,
			` */`
		),
		errors: errors(
			'Function should not have space after ",".'
		)
	}, {
		options: [{
			functionParamColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this: Object)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(this : Object)}`,
			` */`
		),
		errors: errors(
			'Function should have space before ":".'
		)
	}, {
		options: [{
			functionParamColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this :Object)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(this : Object)}`,
			` */`
		),
		errors: errors(
			'Function should have space after ":".'
		)
	}, {
		options: [{
			functionParamColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this  :Object)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(this:Object)}`,
			` */`
		),
		errors: errors(
			'Function should not have space before ":".'
		)
	}, {
		options: [{
			functionParamColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(this:  Object)}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function(this:Object)}`,
			` */`
		),
		errors: errors(
			'Function should not have space after ":".'
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function(): number}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function() : number}`,
			` */`
		),
		errors: errors(
			'Function should have space before ":".'
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'always',
				after: 'always'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function() :number}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function() : number}`,
			` */`
		),
		errors: errors(
			'Function should have space after ":".'
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function()  :number}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function():number}`,
			` */`
		),
		errors: errors(
			'Function should not have space before ":".'
		)
	}, {
		options: [{
			functionResultColon: {
				before: 'never',
				after: 'never'
			}
		}],
		code: concat(
			`/**`,
			` * @return {function():  number}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {function():number}`,
			` */`
		),
		errors: errors(
			'Function should not have space after ":".'
		)
	}]
};
