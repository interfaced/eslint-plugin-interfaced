const {errors, concat} = require(`../helper`);

module.exports = extendSpaces({
	valid: [{
		options: [2],
		code: concat(
			`/**`,
			` * @type {`,
			` *   Object`,
			` * }`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {`,
			` *   Object?`,
			` * }`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {(`,
			` *   Object`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {(`,
			` *   Object |`,
			` *   Array`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {(Object |`,
			` *   Array`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {Object |`,
			` * Array`,
			` * }`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {Array<`,
			` *   Object,`,
			` *   Array`,
			` * >}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {Array<Object,`,
			` *   Array`,
			` * >}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {{`,
			` *   field1: {`,
			` *     field2: number`,
			` *   }`,
			` * }}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {{ field1: number,`,
			` *   field2: number`,
			` * }}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {{`,
			` *   field1:`,
			` *     number,`,
			` *   field2:`,
			` *     number`,
			` * }}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` *   Array,`,
			` *   Object`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(Array,`,
			` *   Object`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` *   this:`,
			` *     Object,`,
			` *   new:`,
			` *     Object,`,
			` *   Array`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function():`,
			` *   Array`,
			` * }`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` *   Object=`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` *   ...Object`,
			` * )}`,
			` */`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {`,
			` *   function(`,
			` *     this:`,
			` *       {`,
			` *         field:`,
			` *           number`,
			` *       },`,
			` *     new:,`,
			` *       Object<,`,
			` *         string, string`,
			` *       >,`,
			` *     number`,
			` *   ):`,
			` *   (`,
			` *     Array | {`,
			` *       field: number`,
			` *     } |`,
			` *     Object`,
			` *   )`,
			` * }`,
			` */`
		)
	}],
	invalid: [{
		options: [2],
		code: concat(
			`/**`,
			` * @type {`,
			` * Object`,
			` * }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {`,
			` *   Object`,
			` * }`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {`,
			` * Object?`,
			` * }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {`,
			` *   Object?`,
			` * }`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {(`,
			` * Object`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {(`,
			` *   Object`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {(`,
			` * Object | Array`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {(`,
			` *   Object | Array`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {(Object |`,
			` * Array`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {(Object |`,
			` *   Array`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Array" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {Object |`,
			` *   Array`,
			` * }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {Object |`,
			` * Array`,
			` * }`,
			` */`
		),
		errors: errors(
			`Expected indentation of 0 space(s) before "Array" but found 2 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {Array<`,
			` * Object`,
			` * >}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {Array<`,
			` *   Object`,
			` * >}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {Array<Object,`,
			` * Array`,
			` * >}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {Array<Object,`,
			` *   Array`,
			` * >}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Array" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {{`,
			` * field1: number`,
			` * }}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {{`,
			` *   field1: number`,
			` * }}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "field1" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {{ field1: number,`,
			` * field2: number`,
			` * }}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {{ field1: number,`,
			` *   field2: number`,
			` * }}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "field2" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {{`,
			` *   field1:`,
			` *   number`,
			` * }}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {{`,
			` *   field1:`,
			` *     number`,
			` * }}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 4 space(s) before "number" but found 2 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` * Object`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {function(`,
			` *   Object`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(Array,`,
			` * Object`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {function(Array,`,
			` *   Object`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` * this: Object`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {function(`,
			` *   this: Object`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "this" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function():`,
			` * Array`,
			` * }`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {function():`,
			` *   Array`,
			` * }`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Array" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` * Object=`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {function(`,
			` *   Object=`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "Object" but found 0 space(s).`
		)
	}, {
		options: [2],
		code: concat(
			`/**`,
			` * @type {function(`,
			` * ...Object`,
			` * )}`,
			` */`
		),
		output: concat(
			`/**`,
			` * @type {function(`,
			` *   ...Object`,
			` * )}`,
			` */`
		),
		errors: errors(
			`Expected indentation of 2 space(s) before "..." but found 0 space(s).`
		)
	}]
});

/**
 * @param {{valid: Array, invalid: Array}} test
 * @return {{valid: Array, invalid: Array}}
 */
function extendSpaces(test) {
	/**
	 * @param {string} code
	 * @return {string}
	 */
	function spacesToTabs(code) {
		return code.replace(/(\* )( {2,})/g, (match, star, indent) =>
			star + (
				Array(indent.length / 2)
					.fill('\t')
					.join('')
			)
		);
	}

	test.valid.slice()
		.forEach((testCase) => {
			test.valid.push({
				options: ['tab'],
				code: spacesToTabs(testCase.code)
			});
		});

	test.invalid.slice()
		.forEach((testCase) => {
			test.invalid.push({
				options: ['tab'],
				code: spacesToTabs(testCase.code),
				output: spacesToTabs(testCase.output),
				errors: testCase.errors.map((error) => ({
					message: error.message.replace(/(\d) space/g, (match, count) => `${count / 2} tab`)
				}))
			});
		});

	return test;
}
