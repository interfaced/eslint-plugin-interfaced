const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`/**`,
			` * @abstract`,
			` */`,
			`class AbstractKlass {`,
			`   constructor() {}`,
			`}`
		)
	}, {
		code: concat(
			`/**`,
			` * @abstract`,
			` */`,
			`one.two.AbstractKlass = class {`,
			`   constructor() {}`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {`,
			`   constructor() {}`,
			`}`
		),
		errors: errors(
			'Abstract class name "Klass" should start with "Abstract".'
		)
	}, {
		code: concat(
			`/**`,
			` * @abstract`,
			` */`,
			`one.two.Klass = class {`,
			`   constructor() {}`,
			`}`
		),
		errors: errors(
			'Abstract class name "Klass" should start with "Abstract".'
		)
	}]
});
