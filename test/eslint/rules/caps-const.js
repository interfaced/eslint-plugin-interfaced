const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
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
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum = {`,
			`   VALUE: 1,`,
			`   'VALUE_TWO': 2,`,
			`   'VALUE_THREE': 3,`,
			`   VALUE4: 4`,
			`};`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum = {`,
			`   [value]: 1,`,
			`   [obj.prop]: 2`,
			`};`
		)
	}, {
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST_TWO = 2;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST3 = 3;`
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
		errors: errors(
			`Constant "const_one" is not in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum = {`,
			`   VALUE_one: 1,`,
			`   'value_TWO': 2`,
			`};`
		),
		errors: errors(
			`Enum property "VALUE_one" is not in caps notation.`,
			`Enum property "value_TWO" is not in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.const = 1;`
		),
		errors: errors(
			`Constant "const" is not in caps notation.`
		)
	}]
});
