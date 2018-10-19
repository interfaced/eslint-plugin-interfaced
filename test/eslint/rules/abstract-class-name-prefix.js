const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
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
			`export default class {`,
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
	}]
});
