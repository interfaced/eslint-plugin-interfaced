const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			newlinesCountBefore: 2,
			newlinesCountAfter: 2
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
			newlinesCountBefore: 2,
			newlinesCountAfter: 2
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
			newlinesCountBefore: 2,
			newlinesCountAfter: 1,
			collisionPriority: 'after'
		}],
		code: concat(
			`goog.provide('Klass');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`class Klass {}`,
			``,
			`class Klass2 {}`,
			``,
			`Klass2.CONST = 1;`
		)
	}, {
		options: [{
			newlinesCountBefore: 2,
			newlinesCountAfter: 1,
			collisionPriority: 'before'
		}],
		code: concat(
			`goog.provide('Klass');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`class Klass {}`,
			``,
			``,
			`class Klass2 {}`,
			``,
			`Klass2.CONST = 1;`
		)
	}, {
		options: [{
			newlinesCountBefore: 2,
			newlinesCountAfter: 1,
			collisionPriority: 'after'
		}],
		code: concat(
			`goog.provide('Klass');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
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
			newlinesCountBefore: 2,
			newlinesCountAfter: 1,
			collisionPriority: 'before'
		}],
		code: concat(
			`goog.provide('Klass');`,
			`goog.provide('Klass2');`,
			``,
			``,
			`/**`,
			` * @abstract`,
			` */`,
			`class Klass {}`,
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
			newlinesCountBefore: 2,
			newlinesCountAfter: 2
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
			`Count of newlines before class should be 2, but 1 given.`,
			`Count of newlines after class should be 2, but 1 given.`
		)
	}, {
		options: [{
			newlinesCountBefore: 2,
			newlinesCountAfter: 2
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
			`Count of newlines before class should be 2, but 1 given.`,
			`Count of newlines after class should be 2, but 1 given.`
		)
	}]
});
