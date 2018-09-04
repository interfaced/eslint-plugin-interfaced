const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
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
			`Klass.EVENT_STATE_CHANGE = 'state-change';`
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
			`Klass.EVENT_STATE_CHANGE = 3;`
		),
		errors: errors(
			`Event constant "EVENT_RIGHT_CLICK" value should be a string.`,
			`Event constant "EVENT_STATE_CHANGE" value should be a string.`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_RIGHT_CLICK = 'Right-Click';`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_STATE_CHANGE = 'hover:state:change';`
		),
		errors: errors(
			`Event constant "EVENT_RIGHT_CLICK" should consist of latinic lowercase letters (a-z) ` +
			`or dash sign (-), but "R" given.`,
			`Event constant "EVENT_STATE_CHANGE" should consist of latinic lowercase letters (a-z) ` +
			`or dash sign (-), but ":" given.`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {string}`,
			`        */`,
			`       this.EVENT_RIGHT_CLICK = 'right_click';`,
			`   }`,
			`}`,
			``,
			`/**`,
			` * @const {string}`,
			` */`,
			`Klass.EVENT_STATE_CHANGE = '3';`
		),
		errors: errors(
			`Event constant "EVENT_RIGHT_CLICK" should consist of latinic lowercase letters (a-z) ` +
			`or dash sign (-), but "_" given.`,
			`Event constant "EVENT_STATE_CHANGE" should consist of latinic lowercase letters (a-z) ` +
			`or dash sign (-), but "3" given.`
		)
	}]
});
