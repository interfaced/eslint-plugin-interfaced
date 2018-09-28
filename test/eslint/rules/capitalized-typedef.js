const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @typedef {number}`,
			` */`,
			`let Typedef1;`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`ns.Typedef2;`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @typedef {number}`,
			` */`,
			`let typedef1;`,
			``,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`ns.typedef2;`
		),
		errors: errors(
			`Typedef "typedef1" is not capitalized.`,
			`Typedef "typedef2" is not capitalized.`
		)
	}]
};
