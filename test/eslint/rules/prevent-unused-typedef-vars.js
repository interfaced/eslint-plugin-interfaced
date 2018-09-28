const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`let Typedef;`
		)
	}, {
		code: concat(
			`/**`,
			` * @typedef {{item: string}}`,
			` */`,
			`var Typedef;`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` */`,
			`let Typedef;`
		),
		errors: errors(
			`'Typedef' is defined but never used.`
		)
	}, {
		code: concat(
			`/**`,
			` */`,
			`var Typedef;`
		),
		errors: errors(
			`'Typedef' is defined but never used.`
		)
	}]
};
