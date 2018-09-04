const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`Klass.Typedef;`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`Klass.typedef;`
		),
		output: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`Klass.Typedef;`
		),
		errors: errors(
			`Typedef "typedef" is not capitalized.`
		)
	}]
});
