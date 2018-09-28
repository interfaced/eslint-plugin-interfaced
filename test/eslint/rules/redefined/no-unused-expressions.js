const {errors, concat, extendClassDeclarations} = require(`../../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		code: concat(
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef1;`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`ns.Typedef2;`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /*`,
			`        * @type {number}`,
			`        */`,
			`       this.prop;`,
			`   }`,
			`}`
		)
	}, {
		code: concat(
			`/*`,
			` */`,
			`function Klass() {}`,
			``,
			`/*`,
			` * @type {number}`,
			` */`,
			`Klass.prototype.prop;`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` */`,
			`let Unused1;`,
			``,
			`/**`,
			` */`,
			`ns.Unused2;`
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
