const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`,
			``,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`Klass.Enum = {`,
			`   ITEM: string`,
			`};`
		)
	}, {
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`,
			``,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`Klass.Enum = {`,
			`   ITEM: string`,
			`};`,
			``,
			``,
			`class Klass2 {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass2.CONST = 1;`,
			``,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass2.Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`Klass2.Enum = {`,
			`   ITEM: string`,
			`};`
		)
	}],
	invalid: [{
		options: [{
			amount: 2
		}],
		code: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`Klass.Enum = {`,
			`   ITEM: string`,
			`};`
		),
		output: concat(
			`class Klass {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`,
			``,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`Klass.Enum = {`,
			`   ITEM: string`,
			`};`
		),
		errors: errors(
			`Amount of newlines between static expressions should be 2, but 1 given.`,
			`Amount of newlines between static expressions should be 2, but 1 given.`
		)
	}]
});
