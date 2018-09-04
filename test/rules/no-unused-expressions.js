const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [],
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`
		)
	}, {
		options: [],
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /*`,
			`        * @type {number}`,
			`        */`,
			`       this.prop;`,
			``,
			`       this.initProp();`,
			`   }`,
			`}`
		)
	}],
	invalid: [{
		options: [],
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` */`,
			`Klass.Unused;`
		),
		errors: errors(
			`Expected an assignment or function call and instead saw an expression.`
		)
	}, {
		options: [],
		code: concat(
			`class Klass {`,
			`   method() {`,
			`       /*`,
			`        * @type {number}`,
			`        */`,
			`       this.prop;`,
			`   }`,
			`}`
		),
		errors: errors(
			`Expected an assignment or function call and instead saw an expression.`
		)
	}]
});
