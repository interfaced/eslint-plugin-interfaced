const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @type {number| string}`,
			` */`
		)
	}, {
		code: concat(
			`/**`,
			` * @type {number |string}`,
			` */`
		)
	}, {
		code: concat(
			`/**`,
			` * @type  {number|string}  `,
			` */`
		)
	}, {
		code: concat(
			`/**`,
			` * @type {{`,
			` *   foo: string,`,
			` *   bar: string,`,
			` * }}`,
			` */`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @type {number|  string}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {number| string}`,
			` */`
		),
		errors: errors(
			'Unexpected multiple spaces (2) before "string".'
		)
	}, {
		code: concat(
			`/**`,
			` * @type {number  |string}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {number |string}`,
			` */`
		),
		errors: errors(
			'Unexpected multiple spaces (2) before "|".'
		)
	}, {
		code: concat(
			`/**`,
			` * @type {{`,
			` *   foo: string,  bar: string`,
			` * }}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {{`,
			` *   foo: string, bar: string`,
			` * }}`,
			` */`
		),
		errors: errors(
			'Unexpected multiple spaces (2) before "bar".'
		)
	}]
};
