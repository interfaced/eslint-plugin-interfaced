const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @abstract`,
			`    */`,
			`   method() {}`,
			`}`
		)
	}, {
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class Klass {`,
			`   method() {}`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   method() {}`,
			`}`
		),
		errors: errors(
			`Unexpected empty method.`
		)
	}]
});
