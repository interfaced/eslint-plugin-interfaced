const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			newlinesCount: 2
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {}`,
			``,
			``,
			`   method() {}`,
			`}`
		)
	}, {
		options: [{
			newlinesCount: 2
		}],
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   constructor() {}`,
			``,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method() {}`,
			`}`
		)
	}],
	invalid: [{
		options: [{
			newlinesCount: 2
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {}`,
			``,
			`   method() {}`,
			`}`
		),
		output: concat(
			`class Klass {`,
			`   constructor() {}`,
			``,
			``,
			`   method() {}`,
			`}`
		),
		errors: errors(
			`Count of newlines between methods should be 2, but 1 given.`
		)
	}, {
		options: [{
			newlinesCount: 2
		}],
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   constructor() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method() {}`,
			`}`
		),
		output: concat(
			`class Klass {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   constructor() {}`,
			``,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method() {}`,
			`}`
		),
		errors: errors(
			`Count of newlines between methods should be 2, but 1 given.`
		)
	}]
});
