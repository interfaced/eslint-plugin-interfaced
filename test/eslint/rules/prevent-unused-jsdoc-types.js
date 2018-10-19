const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @typedef {number}`,
			` */`,
			`let Type;`,
			``,
			`log(/** @type {Type} */ (1));`
		)
	}, {
		code: concat(
			`/**`,
			` * @typedef {number}`,
			` */`,
			`let Type;`,
			``,
			`(() => {`,
			`    log(/** @type {Type} */ (1));`,
			`});`
		)
	}, {
		code: concat(
			`(() => {`,
			`    /**`,
			`     * @typedef {number}`,
			`     */`,
			`    let Type;`,
			``,
			`    log(/** @type {Type} */ (1));`,
			`});`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @typedef {number}`,
			` */`,
			`let Type;`
		),
		errors: errors(
			`'Type' is defined but never used.`
		)
	}, {
		code: concat(
			`log(/** @type {Type} */ (1));`,
			``,
			`(() => {`,
			`    /**`,
			`     * @typedef {number}`,
			`     */`,
			`    let Type;`,
			`});`
		),
		errors: errors(
			`'Type' is defined but never used.`
		)
	}]
};
