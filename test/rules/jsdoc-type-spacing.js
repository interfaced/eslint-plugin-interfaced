const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			typeApplications: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {Object.<string, number>}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			typeApplications: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object.<string,number>}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			functionParams: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function(string, number)}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			functionParams: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function(string,number)}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			functionResult: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function(): number}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			functionResult: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function():number}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			recordFields: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {{one: string, two: string}}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			recordFields: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {{`,
			` *     one: string,`,
			` *     two: string,`,
			` * }}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			recordFields: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {{one:string,two:string}}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			recordFields: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {{`,
			` *     one:string,`,
			` *     two:string,`,
			` * }}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			unionElements: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {number | string}`,
			` */`,
			`function _() {}`
		)
	}, {
		options: [{
			unionElements: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {number|string}`,
			` */`,
			`function _() {}`
		)
	}],
	invalid: [{
		options: [{
			typeApplications: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {Object.<string,number>}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type applications should have space after comma.`
		)
	}, {
		options: [{
			typeApplications: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {Object.<string, number>}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Type applications should not have space after comma.`
		)
	}, {
		options: [{
			functionParams: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function(string,number)}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Function params should have space after comma.`
		)
	}, {
		options: [{
			functionParams: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function(string, number)}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Function params should not have space after comma.`
		)
	}, {
		options: [{
			functionResult: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {function():number}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Function result should have space after colon.`
		)
	}, {
		options: [{
			functionResult: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {function(): number}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Function result should not have space after colon.`
		)
	}, {
		options: [{
			recordFields: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {{one:string,two:string}}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Record fields should have space after colon.`,
			`Record fields should have space after comma.`
		)
	}, {
		options: [{
			recordFields: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {{one: string, two: string}}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Record fields should not have space after colon.`,
			`Record fields should not have space after comma.`
		)
	}, {
		options: [{
			unionElements: 'always'
		}],
		code: concat(
			`/**`,
			` * @return {number|string}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Union elements should have space around pipe.`
		)
	}, {
		options: [{
			unionElements: 'never'
		}],
		code: concat(
			`/**`,
			` * @return {number | string}`,
			` */`,
			`function _() {}`
		),
		errors: errors(
			`Union elements should not have space around pipe.`
		)
	}]
};
