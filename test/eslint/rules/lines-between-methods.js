const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass1 {`,
			`   constructor() {}`,
			``,
			``,
			`   method() {}`,
			`}`,
			``,
			`class Klass2 {`,
			`   constructor() {}`,
			``,
			``,
			`   method() {}`,
			`}`
		)
	}, {
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass1 {`,
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
			`}`,
			``,
			`class Klass2 {`,
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
			amount: 2
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
			`Amount of newlines between methods should be 2, but 1 given.`
		)
	}, {
		options: [{
			amount: 2
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
			`Amount of newlines between methods should be 2, but 1 given.`
		)
	}, {
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   constructor() {}`,
			``,
			`   // Comment`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   anotherMethod() {}`,
			`}`
		),
		output: concat(
			`class Klass {`,
			`   /**`,
			`    * @override`,
			`    */`,
			`   constructor() {}`,
			``,
			`   // Comment`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   method() {}`,
			``,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   anotherMethod() {}`,
			`}`
		),
		errors: errors(
			`Unexpected comments between methods.`,
			`Amount of newlines between methods should be 2, but 1 given.`
		)
	}]
});
