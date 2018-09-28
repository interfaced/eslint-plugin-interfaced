const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			order: ['const', 'enum', 'typedef']
		}],
		code: concat(
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`let Enum = {`,
			`   ITEM: 'item'`,
			`};`,
			``,
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`var Typedef;`
		)
	}],
	invalid: [{
		options: [{
			order: ['const', 'enum', 'typedef']
		}],
		code: concat(
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`var Typedef;`,
			``,
			`/**`,
			` * @enum {string}`,
			` */`,
			`let Enum = {`,
			`   ITEM: 'item'`,
			`};`,
			``,
			`/**`,
			` * @const {number}`,
			` */`,
			`ns.CONST = 1;`
		),
		errors: errors(
			`This static expression (enum) should be before previous static expression (typedef) due to its priority.`,
			`This static expression (const) should be before previous static expression (enum) due to its priority.`
		)
	}]
};
