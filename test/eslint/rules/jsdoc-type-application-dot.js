const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: ['always'],
		code: concat(
			`/**`,
			` * @return {Array.<string>}`,
			` */`
		)
	}, {
		options: ['never'],
		code: concat(
			`/**`,
			` * @return {Array<string>}`,
			` */`
		)
	}],
	invalid: [{
		options: ['always'],
		code: concat(
			`/**`,
			` * @return {Array<string>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Array.<string>}`,
			` */`
		),
		errors: errors(
			`Type application should have dot before "<"".`
		)
	}, {
		options: ['always'],
		code: concat(
			`/**`,
			` * @return {Array. <string>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Array. .<string>}`,
			` */`
		),
		errors: errors(
			`Type application should have dot before "<"".`
		)
	}, {
		options: ['never'],
		code: concat(
			`/**`,
			` * @return {Array.<string>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Array<string>}`,
			` */`
		),
		errors: errors(
			`Type application shouldn't have dot before "<"".`
		)
	}, {
		options: ['never'],
		code: concat(
			`/**`,
			` * @return {Array .<string>}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @return {Array <string>}`,
			` */`
		),
		errors: errors(
			`Type application shouldn't have dot before "<"".`
		)
	}]
};
