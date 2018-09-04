const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			requireReturn: false,
			requireReturnDescription: false
		}],
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class Klass {`,
			`   /**`,
			`    * @return {number}`,
			`    */`,
			`   method() {}`,
			`}`
		)
	}, {
		options: [{
			requireReturn: false,
			requireReturnDescription: false
		}],
		code: concat(
			`/**`,
			` * @record`,
			` */`,
			`class Klass {`,
			`   /**`,
			`    * @return {number}`,
			`    */`,
			`   method() {}`,
			`}`
		)
	}],
	invalid: [{
		options: [{
			requireReturn: false,
			requireReturnDescription: false
		}],
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @return {number}`,
			`    */`,
			`   method() {}`,
			`}`
		),
		errors: errors(
			`Unexpected @return tag; function has no return statement.`
		)
	}]
});
