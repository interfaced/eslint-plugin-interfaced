const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			optionalParam: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {number} a`,
			` * @param {number=} b`,
			` * @param {number=} c`,
			` */`
		)
	}, {
		options: [{
			optionalParam: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {number|undefined} a`,
			` * @param {number} b`,
			` * @param {number=} c`,
			` */`
		)
	}, {
		options: [{
			optionalParam: 'always'
		}],
		code: concat(
			`/**`,
			` * @param a`,
			` * @param b`,
			` * @param {number=} c`,
			` */`
		)
	}, {
		options: [{
			optionalParam: 'never'
		}],
		code: concat(
			`/**`,
			` * @param {number} a`,
			` * @param {number|undefined} b`,
			` * @param {number|undefined} c`,
			` */`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type {?number}`,
			` */`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type {Array<?number>}`,
			` */`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type {number|string|null}`,
			` */`
		)
	}, {
		options: [{
			nullableType: 'never'
		}],
		code: concat(
			`/**`,
			` * @type {number|null}`,
			` */`
		)
	}, {
		options: [{
			nullableType: 'never'
		}],
		code: concat(
			`/**`,
			` * @type {Array<number|null>}`,
			` */`
		)
	}],
	invalid: [{
		options: [{
			optionalParam: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {number} a`,
			` * @param { number | undefined } b`,
			` * @param {number=} c`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {number} a`,
			` * @param { number = } b`,
			` * @param {number=} c`,
			` */`
		),
		errors: errors(
			`Use "=" instead of "|undefined" to describe optional param b.`
		)
	}, {
		options: [{
			optionalParam: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {number} a`,
			` * @param { undefined | number } b`,
			` * @param {number=} c`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {number} a`,
			` * @param {  number =} b`,
			` * @param {number=} c`,
			` */`
		),
		errors: errors(
			`Use "=" instead of "|undefined" to describe optional param b.`
		)
	}, {
		options: [{
			optionalParam: 'never'
		}],
		code: concat(
			`/**`,
			` * @param {number} a`,
			` * @param {number|undefined} b`,
			` * @param { number = } c`,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {number} a`,
			` * @param {number|undefined} b`,
			` * @param { number |undefined } c`,
			` */`
		),
		errors: errors(
			`Use "|undefined" instead of "=" to describe optional param c.`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type { number | null }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type { ?number  }`,
			` */`
		),
		errors: errors(
			`Use "?" instead of "|null" to describe nullable in @type.`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type {Array< number | null >}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {Array< ?number  >}`,
			` */`
		),
		errors: errors(
			`Use "?" instead of "|null" to describe nullable in @type.`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type { null | number }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type { ? number }`,
			` */`
		),
		errors: errors(
			`Use "?" instead of "|null" to describe nullable in @type.`
		)
	}, {
		options: [{
			nullableType: 'never'
		}],
		code: concat(
			`/**`,
			` * @type { ? number }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {  number|null }`,
			` */`
		),
		errors: errors(
			`Use "|null" instead of "?" to describe nullable in @type.`
		)
	}, {
		options: [{
			nullableType: 'never'
		}],
		code: concat(
			`/**`,
			` * @type {Array< ? number >}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {Array<  number|null >}`,
			` */`
		),
		errors: errors(
			`Use "|null" instead of "?" to describe nullable in @type.`
		)
	}]
};
