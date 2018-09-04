const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {?number}`,
			`        * @private`,
			`        */`,
			`       this._privateProp = null;`,
			``,
			`       /**`,
			`        * @type {?number}`,
			`        * @protected`,
			`        */`,
			`       this._protectedProp = null;`,
			``,
			`       /**`,
			`        * @type {?number}`,
			`        * @override`,
			`        */`,
			`       this._overriddenProp = null;`,
			`   }`,
			`}`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @private`,
			`    */`,
			`   _privateMethod() {}`,
			``,
			`   /**`,
			`    * @protected`,
			`    */`,
			`   _protectedMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   _overriddenMethod() {}`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   constructor() {`,
			`       /**`,
			`        * @type {?number}`,
			`        */`,
			`       this._prop = null;`,
			`   }`,
			`}`
		),
		errors: errors(
			`Property "_prop" starts with "_" but not marked by @protected or @private.`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   _method() {}`,
			`}`
		),
		errors: errors(
			`Method "_method" starts with "_" but not marked by @protected or @private.`
		)
	}]
});
