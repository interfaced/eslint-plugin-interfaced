const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			order: ['const', 'enum', 'typedef']
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
			` * @enum {string}`,
			` */`,
			`Klass.Enum = {`,
			`   ITEM: 'item'`,
			`};`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`
		)
	}, {
		options: [{
			order: ['const', 'enum', 'typedef']
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
			` * @enum {string}`,
			` */`,
			`Klass.Enum = {`,
			`   ITEM: 'item'`,
			`};`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass.Typedef;`,
			``,
			`class Klass2 {}`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass2.CONST = 1;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`Klass2.Enum = {`,
			`   ITEM: 'item'`,
			`};`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`Klass2.Typedef;`
		)
	}],
	invalid: [{
		options: [{
			order: ['const', 'enum', 'typedef']
		}],
		code: concat(
			`class Klass {}`,
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
			`   ITEM: 'item'`,
			`};`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`Klass.CONST = 1;`
		),
		errors: errors(
			`This static expression (enum) should be before previous static expression (typedef) due to its priority.`,
			`This static expression (const) should be before previous static expression (enum) due to its priority.`
		)
	}]
});
