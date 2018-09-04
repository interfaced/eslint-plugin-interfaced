const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST_TWO = 2;`,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST3 = 3;`,
			`   }`,
			`}`
		)
	}, {
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Klass.Enum = {`,
			`   VALUE: 1,`,
			`   VALUE_TWO: 2,`,
			`   VALUE_THREE: 3,`,
			`   VALUE4: 4`,
			`};`
		)
	}, {
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST_TWO = 2;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST3 = 3;`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.const_one = 1;`,
			`   }`,
			`}`
		),
		output: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST_ONE = 1;`,
			`   }`,
			`}`
		),
		errors: errors(
			`Constant "const_one" is not in caps notation.`
		)
	}, {
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Klass.Enum = {`,
			`   VALUE_one: 1,`,
			`   value_TWO: 2`,
			`};`
		),
		output: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Klass.Enum = {`,
			`   VALUE_ONE: 1,`,
			`   VALUE_TWO: 2`,
			`};`
		),
		errors: errors(
			`Enum property "VALUE_one" is not in caps notation.`,
			`Enum property "value_TWO" is not in caps notation.`
		)
	}, {
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.const = 1;`
		),
		output: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`
		),
		errors: errors(
			`Constant "const" is not in caps notation.`
		)
	}]
});
