const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {{item1: string, item2: string}}`,
			`        */`,
			`       this.prop = {};`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @typedef {{item1: string, item2: string}}`,
			` */`,
			`Klass.Typedef;`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {{`,
			`        *     item1: string,`,
			`        *     item2: string,`,
			`        * }}`,
			`        */`,
			`       this.prop = {};`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @typedef {{`,
			` *     item1: string,`,
			` *     item2: string,`,
			` * }}`,
			` */`,
			`Klass.Typedef;`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @description 	non-type with tab`,
			`        */`,
			`       this.prop = {};`,
			`   }`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {{`,
			`        * 	item1: string,`,
			`        * 	item2: string,`,
			`        * }}`,
			`        */`,
			`       this.prop = {};`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @typedef {{`,
			` * 	item1: string,`,
			` * 	item2: string,`,
			` * }}`,
			` */`,
			`Klass.Typedef;`
		),
		errors: errors(
			'Unexpected tab character in type of @type.',
			'Unexpected tab character in type of @typedef.'
		)
	}]
});
