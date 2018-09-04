const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			newlinesCount: 2
		}],
		code: concat(
			`class Klass1 {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			``,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			`   }`,
			`}`,
			``,
			`class Klass2 {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			``,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			`   }`,
			`}`
		)
	}],
	invalid: [{
		options: [{
			newlinesCount: 2
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			`   }`,
			`}`
		),
		output: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			``,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			`   }`,
			`}`
		),
		errors: errors(
			`Count of newlines between props should be 2, but 1 given.`,
			`Count of newlines between props should be 2, but 1 given.`
		)
	}]
});
