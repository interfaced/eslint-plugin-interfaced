const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
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
			`export const EVENT_ERROR = 'error';`,
			``,
			`/**`,
			` * Fired with: nothing`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_CHANGE = 'change';`,
			``,
			`/**`,
			` * Fired with: nothing`,
			` * @const {string}`,
			` */`,
			`EVENT_DONE = 'done';`
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
			`export const EVENT_ERROR = 'error';`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_CHANGE = 'change';`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`EVENT_DONE = 'done';`
		),
		errors: errors(
			`Event constant "EVENT_CLICK" has no "Fired with: ..." description.`,
			`Event constant "EVENT_ERROR" has no "Fired with: ..." description.`,
			`Event constant "EVENT_CHANGE" has no "Fired with: ..." description.`,
			`Event constant "EVENT_DONE" has no "Fired with: ..." description.`
		)
	}]
});
