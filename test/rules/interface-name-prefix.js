const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class IKlass {`,
			`   constructor() {}`,
			`}`
		)
	}, {
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`one.two.IKlass = class {`,
			`   constructor() {}`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class Klass {`,
			`   constructor() {}`,
			`}`
		),
		errors: errors(
			'Interface name "Klass" should start with "I".'
		)
	}, {
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`one.two.Klass = class {`,
			`   constructor() {}`,
			`}`
		),
		errors: errors(
			'Interface name "Klass" should start with "I".'
		)
	}]
});
