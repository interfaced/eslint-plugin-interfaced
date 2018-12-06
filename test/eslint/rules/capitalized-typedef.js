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
			`ns.Typedef2;`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`Typedef3;`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @typedef {number}`,
			` */`,
			`let typedef1;`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`ns.typedef2;`,
			``,
			`/**`,
			` * @typedef {number}`,
			` */`,
			`typedef3;`
		),
		errors: errors(
			`Typedef "typedef1" isn't capitalized.`,
			`Typedef "typedef2" isn't capitalized.`,
			`Typedef "typedef3" isn't capitalized.`
		)
	}]
};
