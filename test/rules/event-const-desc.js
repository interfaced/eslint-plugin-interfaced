const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * Fired with: number`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_CLICK = 'click';`,
			``,
			`       /**`,
			`        * This is cool event`,
			`        * Fired with: something`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_HOVER = 'hover';`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * Fired with: nothing`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_CHANGE = 'change';`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_CLICK = 'click';`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_CHANGE = 'change';`
		),
		errors: errors(
			`Event constant "EVENT_CLICK" has no "Fired with: ..." description.`,
			`Event constant "EVENT_CHANGE" has no "Fired with: ..." description.`
		)
	}]
});
