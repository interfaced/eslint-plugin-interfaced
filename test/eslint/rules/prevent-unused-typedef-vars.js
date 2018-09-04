const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [],
		code: concat(
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`
		)
	}, {
		options: [],
		code: concat(
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`var Typedef;`
		)
	}],
	invalid: [{
		options: [],
		code: concat(
			`/**`,
			` */`,
			`let Typedef;`
		),
		errors: errors(
			`'Typedef' is defined but never used.`
		)
	}]
};
