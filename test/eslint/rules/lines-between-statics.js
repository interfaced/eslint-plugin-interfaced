const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			amount: 2
		}],
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		)
	}],
	invalid: [{
		options: [{
			amount: 2
		}],
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		),
		output: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		),
		errors: errors(
			`Amount of newlines between static expressions should be 2, but 1 given.`,
			`Amount of newlines between static expressions should be 2, but 1 given.`
		)
	}, {
		options: [{
			amount: 2
		}],
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`/**`,
			` * @type {number}`,
			` */`,
			`Klass.prop = 1;`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		),
		output: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`/**`,
			` * @type {number}`,
			` */`,
			`Klass.prop = 1;`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		),
		errors: errors(
			`Unexpected code between static expressions.`,
			`Amount of newlines between static expressions should be 2, but 1 given.`
		)
	}, {
		options: [{
			amount: 2
		}],
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`// Comment`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		),
		output: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`// Comment`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`,
			``,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`var Enum = {`,
			`   ITEM: string`,
			`};`
		),
		errors: errors(
			`Unexpected comments between static expressions.`,
			`Amount of newlines between static expressions should be 2, but 1 given.`
		)
	}]
};
