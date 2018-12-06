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
			` * @const {number}`,
			` */`,
			`let CONST = 1;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`let CONST_TWO = 2;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`let CONST3 = 3;`
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
	}, {
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`CONST = 1;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`CONST_TWO = 2;`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`CONST3 = 3;`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Enum1 = {`,
			`   VALUE: 1,`,
			`   'VALUE_TWO': 2,`,
			`   'VALUE_THREE': 3,`,
			`   VALUE4: 4`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Enum2 = {`,
			`   [value]: 1,`,
			`   [obj.prop]: 2`,
			`};`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum1 = {`,
			`   VALUE: 1,`,
			`   'VALUE_TWO': 2,`,
			`   'VALUE_THREE': 3,`,
			`   VALUE4: 4`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum2 = {`,
			`   [value]: 1,`,
			`   [obj.prop]: 2`,
			`};`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`Enum1 = {`,
			`   VALUE: 1,`,
			`   'VALUE_TWO': 2,`,
			`   'VALUE_THREE': 3,`,
			`   VALUE4: 4`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Enum2 = {`,
			`   [value]: 1,`,
			`   [obj.prop]: 2`,
			`};`
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
			`Constant "const_one" isn't in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`let const = 1;`
		),
		errors: errors(
			`Constant "const" isn't in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.const = 1;`
		),
		errors: errors(
			`Constant "const" isn't in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`const = 1;`
		),
		errors: errors(
			`Constant "const" isn't in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Enum = {`,
			`   VALUE_one: 1,`,
			`   'value_TWO': 2`,
			`};`
		),
		errors: errors(
			`Enum property "VALUE_one" isn't in caps notation.`,
			`Enum property "value_TWO" isn't in caps notation.`
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
			`Enum property "VALUE_one" isn't in caps notation.`,
			`Enum property "value_TWO" isn't in caps notation.`
		)
	}, {
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`Enum = {`,
			`   VALUE_one: 1,`,
			`   'value_TWO': 2`,
			`};`
		),
		errors: errors(
			`Enum property "VALUE_one" isn't in caps notation.`,
			`Enum property "value_TWO" isn't in caps notation.`
		)
	}]
});
