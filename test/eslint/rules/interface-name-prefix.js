const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class IKlass {`,
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
	}]
});
