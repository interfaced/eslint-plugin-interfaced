const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			scopesOrder: ['public', 'protected', 'private'],
			constInTheEnd: true
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.publicProp = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        * @protected`,
			`        */`,
			`       this._protectedProp = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        * @private`,
			`        */`,
			`       this._privateProp = 1;`,
			``,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			`   }`,
			`}`
		)
	}, {
		options: [{
			scopesOrder: ['public', 'protected', 'private'],
			constInTheEnd: false
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.publicProp = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        * @protected`,
			`        */`,
			`       this._protectedProp = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        * @private`,
			`        */`,
			`       this._privateProp = 1;`,
			`   }`,
			`}`
		)
	}],
	invalid: [{
		options: [{
			scopesOrder: ['public', 'protected', 'private'],
			constInTheEnd: true
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @const {number}`,
			`        */`,
			`       this.CONST = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        * @private`,
			`        */`,
			`       this._privateProp = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        * @protected`,
			`        */`,
			`       this._protectedProp = 1;`,
			``,
			`       /**`,
			`        * @type {number}`,
			`        */`,
			`       this.publicProp = 1;`,
			`   }`,
			`}`
		),
		errors: errors(
			`Prop "CONST" is constant and should be in the end of property declarations section.`,
			`Prop "_protectedProp" (protected) should be before prop "_privateProp" (private) due to its priority.`,
			`Prop "publicProp" (public) should be before prop "_protectedProp" (protected) due to its priority.`
		)
	}]
});
