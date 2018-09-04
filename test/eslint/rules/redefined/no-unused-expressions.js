const {errors, concat, extendToClassExpression} = require(`../../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`
		)
	}, {
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
	}, {
		code: concat(
			`/*`,
			` */`,
			`class Klass {}`,
			``,
			`/*`,
			` * @type {number}`,
			` */`,
			`IKlass.prototype.prop;`
		)
	}],
	invalid: [{
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
