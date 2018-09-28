const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class Klass {`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`new Klass();`
		)
	}, {
		code: concat(
			`/**`,
			` * @record`,
			` */`,
			`class Klass {`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`new Klass();`
		)
	}, {
		code: concat(
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {`,
			`   /**`,
			`    * @abstract`,
			`    */`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`new Klass();`
		)
	}, {
		code: concat(
			`class Klass1 extends Klass2 {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`new Klass1();`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`new Klass();`
		),
		errors: errors(
			`'arg1' is defined but never used.`,
			`'arg2' is defined but never used.`
		)
	}]
});
