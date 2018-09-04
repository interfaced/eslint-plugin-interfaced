const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @interface`,
			` */`,
			`class Klass {`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`window.Klass = Klass;`
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
			`window.Klass = Klass;`
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
			`window.Klass = Klass;`
		)
	}, {
		code: concat(
			`class Klass extends Klass2 {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`window.Klass = Klass;`
		)
	}],
	invalid: [{
		code: concat(
			`class Klass {`,
			`   method(arg1, arg2) {}`,
			`}`,
			``,
			`window.Klass = Klass;`
		),
		errors: errors(
			`'arg1' is defined but never used.`,
			`'arg2' is defined but never used.`
		)
	}]
};
