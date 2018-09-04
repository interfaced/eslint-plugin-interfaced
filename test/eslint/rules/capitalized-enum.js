const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Klass.Enum = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Klass.enum = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`
		),
		errors: errors(
			`Enum "enum" is not capitalized.`
		)
	}]
});
