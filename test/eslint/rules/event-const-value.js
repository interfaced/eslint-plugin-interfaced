const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_RIGHT_CLICK = 'right-click';`,
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
			`Klass.EVENT_STATE_CHANGE = 'state-change';`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`EVENT_HOVER = 'hover';`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_RIGHT_CLICK = {};`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`export const EVENT_ERROR = 3;`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_STATE_CHANGE = null;`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`EVENT_HOVER = undefined;`
		),
		errors: errors(
			`Event constant "EVENT_RIGHT_CLICK" value should be a string.`,
			`Event constant "EVENT_ERROR" value should be a string.`,
			`Event constant "EVENT_STATE_CHANGE" value should be a string.`,
			`Event constant "EVENT_HOVER" value should be a string.`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_RIGHT_CLICK = 'Right-Click';`,
			``,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_LEFT_CLICK = 'left_click';`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`export const EVENT_ERROR = 'error!';`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_STATE_CHANGE = 'state:change';`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`EVENT_HOVER = 'hover?';`
		),
		errors: errors(
			`Event constant "EVENT_RIGHT_CLICK" should consist of latin lowercase letters (a-z) ` +
			`or dash sign (-), but "R" given.`,
			`Event constant "EVENT_LEFT_CLICK" should consist of latin lowercase letters (a-z) ` +
			`or dash sign (-), but "_" given.`,
			`Event constant "EVENT_ERROR" should consist of latin lowercase letters (a-z) ` +
			`or dash sign (-), but "!" given.`,
			`Event constant "EVENT_STATE_CHANGE" should consist of latin lowercase letters (a-z) ` +
			`or dash sign (-), but ":" given.`,
			`Event constant "EVENT_HOVER" should consist of latin lowercase letters (a-z) ` +
			`or dash sign (-), but "?" given.`
		)
	}]
});
