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
	}, {
		code: concat(
			`class Klass {`,
			`   method() {`,
			`       console.log('foo');`,
			`   }`,
			`}`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   method() {`,
			`       // Empty method`,
			`   }`,
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
