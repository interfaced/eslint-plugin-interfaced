const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @typedef {{item1: string, item2: string}}`,
			` */`
		)
	}, {
		code: concat(
			`/**`,
			` * @typedef {{`,
			` *     item1: string,`,
			` *     item2: string,`,
			` * }}`,
			` */`
		)
	}, {
		code: concat(
			`/**`,
			` * @description 	non-type with tab`,
			` */`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @typedef {{`,
			` * 	item1: string,`,
			` * 	item2: string,`,
			` * }}`,
			` */`
		),
		errors: errors(
			'Unexpected tab character in type of @typedef.'
		)
	}]
};
