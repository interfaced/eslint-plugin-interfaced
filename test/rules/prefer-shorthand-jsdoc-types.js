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
			` */`,
			`function _(a, b, c) {}`
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
			` */`,
			`function _(a, b, c) {}`
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
			` */`,
			`function _(a, b, c) {}`
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
			` */`,
			`function _(a, b, c) {}`
		)
	}, {
		options: [{
			nullableType: 'always'
		}],
		code: concat(
			`/**`,
			` * @type {?number}`,
			` */`,
			`const a = null;`
		)
	}, {
		options: [{
			nullableType: 'never'
		}],
		code: concat(
			`/**`,
			` * @type {number|null}`,
			` */`,
			`const a = null;`
		)
	}],
	invalid: [{
		options: [{
			optionalParam: 'always'
		}],
		code: concat(
			`/**`,
			` * @param {number} a`,
			` * @param {number|undefined} b`,
			` * @param {number=} c`,
			` */`,
			`function _(a, b, c) {}`
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
			` * @param {number=} c`,
			` */`,
			`function _(a, b, c) {}`
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
			` * @type {number|null}`,
			` */`,
			`const a = null;`
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
			` * @type {?number}`,
			` */`,
			`const a = null;`
		),
		errors: errors(
			`Use "|null" instead of "?" to describe nullable in @type.`
		)
	}]
};
