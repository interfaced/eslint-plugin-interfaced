const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: ['always'],
		code: concat(
			`/**`,
			` * @return {Array.<string>}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: ['never'],
		code: concat(
			`/**`,
			` * @return {Array<string>}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: ['consistent'],
		code: concat(
			`/**`,
			` * @return {Array.<Array.<string>>}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: ['consistent'],
		code: concat(
			`/**`,
			` * @return {Array<Array<string>>}`,
			` */`,
			`function _() {}`
		)
	}],
	invalid: [{
		options: ['always'],
		code: concat(
			`/**`,
			` * @return {Array<string>}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application should have dot before "<"".`
		)
	}, {
		options: ['always'],
		code: concat(
			`/**`,
			` * Array.<string>`,
			` * @return {Array<string>} Array.<string>`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application should have dot before "<"".`
		)
	}, {
		options: ['never'],
		code: concat(
			`/**`,
			` * @return {Array.<string>}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application should not have dot before "<"".`
		)
	}, {
		options: ['never'],
		code: concat(
			`/**`,
			` * Array<string>`,
			` * @return {Array.<string>} Array<string>`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application should not have dot before "<"".`
		)
	}, {
		options: ['consistent'],
		code: concat(
			`/**`,
			` * @return {Array.<Array<string>>}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application has inconsistent dots before "<"".`,
			`Type application has inconsistent dots before "<"".`
		)
	}, {
		options: ['consistent'],
		code: concat(
			`/**`,
			` * @return {Array<Array.<string>>}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application has inconsistent dots before "<"".`,
			`Type application has inconsistent dots before "<"".`
		)
	}, {
		options: ['consistent'],
		code: concat(
			`/**`,
			` * Array.<Array.<string>>`,
			` * @return {Array.<Array<string>>} Array<Array<string>>`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type application has inconsistent dots before "<"".`,
			`Type application has inconsistent dots before "<"".`
		)
	}]
};
