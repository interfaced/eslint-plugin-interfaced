const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`class Klass {}`,
			``,
			``,
			`Klass.CONST = 1;`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
			``,
			``,
			`/**`,
			` * @const`,
			` */`,
			`Klass.CONST = 1;`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`function func() {`,
			`    class Klass {}`,
			``,
			``,
			`    Klass.CONST = 1;`,
			`}`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`block: {`,
			`    class Klass {}`,
			``,
			``,
			`    Klass.CONST = 1;`,
			`}`
		)
	}, {
		options: [{
			before: 2,
			after: 1,
			collisionPriority: 'after'
		}],
		code: concat(
			`goog.provide('Klass1');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`class Klass1 {}`,
			``,
			`class Klass2 {}`,
			``,
			`Klass2.CONST = 1;`
		)
	}, {
		options: [{
			before: 2,
			after: 1,
			collisionPriority: 'before'
		}],
		code: concat(
			`goog.provide('Klass1');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`class Klass1 {}`,
			``,
			``,
			`class Klass2 {}`,
			``,
			`Klass2.CONST = 1;`
		)
	}, {
		options: [{
			before: 2,
			after: 1,
			collisionPriority: 'after'
		}],
		code: concat(
			`goog.provide('Klass1');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass1 {}`,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass2 {}`,
			``,
			`Klass2.CONST = 1;`
		)
	}, {
		options: [{
			before: 2,
			after: 1,
			collisionPriority: 'before'
		}],
		code: concat(
			`goog.provide('Klass1');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass1 {}`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass2 {}`,
			``,
			`Klass2.CONST = 1;`
		)
	}],
	invalid: [{
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			`class Klass {}`,
			``,
			`Klass.CONST = 1;`
		),
		output: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`class Klass {}`,
			``,
			``,
			`Klass.CONST = 1;`
		),
		errors: errors(
			`Amount of newlines before class should be 2, but 1 given.`,
			`Amount of newlines after class should be 2, but 1 given.`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
			``,
			`/**`,
			` * @const`,
			` */`,
			`Klass.CONST = 1;`
		),
		output: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
			``,
			``,
			`/**`,
			` * @const`,
			` */`,
			`Klass.CONST = 1;`
		),
		errors: errors(
			`Amount of newlines before class should be 2, but 1 given.`,
			`Amount of newlines after class should be 2, but 1 given.`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`// Comment`,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
			``,
			`// Comment`,
			``,
			``
		),
		output: concat(
			`goog.provide('Klass');`,
			``,
			``,
			`// Comment`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
			``,
			``,
			`// Comment`,
			``,
			``
		),
		errors: errors(
			`Amount of newlines before class should be 2, but 1 given.`,
			`Amount of newlines after class should be 2, but 1 given.`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`function func() {`,
			`    // Comment`,
			``,
			`    class Klass {}`,
			``,
			`    Klass.CONST = 1;`,
			`}`
		),
		output: concat(
			`function func() {`,
			`    // Comment`,
			``,
			``,
			`    class Klass {}`,
			``,
			``,
			`    Klass.CONST = 1;`,
			`}`
		),
		errors: errors(
			`Amount of newlines before class should be 2, but 1 given.`,
			`Amount of newlines after class should be 2, but 1 given.`
		)
	}, {
		options: [{
			before: 2,
			after: 2
		}],
		code: concat(
			`for (;;) {`,
			`    // Comment`,
			``,
			`    class Klass {}`,
			``,
			`    Klass.CONST = 1;`,
			`}`
		),
		output: concat(
			`for (;;) {`,
			`    // Comment`,
			``,
			``,
			`    class Klass {}`,
			``,
			``,
			`    Klass.CONST = 1;`,
			`}`
		),
		errors: errors(
			`Amount of newlines before class should be 2, but 1 given.`,
			`Amount of newlines after class should be 2, but 1 given.`
		)
	}]
});
