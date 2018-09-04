const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			amount: 2
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
			amount: 2
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
			`Amount of newlines between props should be 2, but 1 given.`,
			`Amount of newlines between props should be 2, but 1 given.`
		)
	}, {
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.prop = 1;`,
			``,
			`       this.method();`,
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
			`       this.method();`,
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
			`Unexpected code between props.`,
			`Amount of newlines between props should be 2, but 1 given.`
		)
	}]
});
