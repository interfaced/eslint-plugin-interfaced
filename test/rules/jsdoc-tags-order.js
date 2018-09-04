const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			tagsOrder: ['template', 'abstract']
		}],
		code: concat(
			`/**`,
			` * @template TYPE`,
			` * @abstract`,
			` */`,
			`class Klass {}`
		)
	}, {
		options: [{
			tagsOrder: ['param', 'return']
		}],
		code: concat(
			`/**`,
			` * @param {number} arg`,
			` * @return {void}`,
			` */`,
			`function func(arg) {}`
		)
	}, {
		options: [{
			tagsOrder: ['param', 'return']
		}],
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @param {number} arg`,
			`    * @return {void}`,
			`    */`,
			`   method(arg) {}`,
			`}`
		)
	}],
	invalid: [{
		options: [{
			tagsOrder: ['template', 'abstract']
		}],
		code: concat(
			`/**`,
			` * @abstract`,
			` * @template TYPE`,
			` */`,
			`class Klass {}`
		),
		errors: errors(
			`JSDoc tag "template" should be before "abstract".`
		)
	}, {
		options: [{
			tagsOrder: ['param', 'return']
		}],
		code: concat(
			`/**`,
			` * @return {void}`,
			` * @param {number} arg`,
			` */`,
			`function func(arg) {}`
		),
		errors: errors(
			`JSDoc tag "param" should be before "return".`
		)
	}, {
		options: [{
			tagsOrder: ['param', 'return']
		}],
		code: concat(
			`class Klass {`,
			`   /**`,
			`    * @return {void}`,
			`    * @param {number} arg`,
			`    */`,
			`   method(arg) {}`,
			`}`
		),
		errors: errors(
			`JSDoc tag "param" should be before "return".`
		)
	}]
});
