const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			tagsOrder: ['template', 'abstract']
		}],
		code: concat(
			`/**`,
			` * @template TYPE`,
			` * @abstract`,
			` */`
		)
	}, {
		options: [{
			tagsOrder: ['param', 'return']
		}],
		code: concat(
			`/**`,
			` * @param {number} arg`,
			` * @protected`,
			` * @abstract`,
			` * @return {void}`,
			` */`
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
			` */`
		),
		output: concat(
			`/**`,
			` * @template TYPE`,
			` * @abstract`,
			` */`
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
			` * @return {void} Returns's description`,
			` * @protected`,
			` * @abstract`,
			` * @param {number} arg Param's description `,
			` */`
		),
		output: concat(
			`/**`,
			` * @param {number} arg Param's description`,
			` * @protected`,
			` * @abstract`,
			` * @return {void} Returns's description`,
			` */`
		),
		errors: errors(
			`JSDoc tag "param" should be before "return".`
		)
	}]
};
