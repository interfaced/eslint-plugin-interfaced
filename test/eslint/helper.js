module.exports = {
	/**
	 * @param {...string} args
	 * @return {Array<{message: string}>}
	 */
	errors: (...args) => args.map((msg) => ({message: msg})),

	/**
	 * @param {...string} args
	 * @return {string}
	 */
	concat: (...args) => args.join('\n'),

	/**
	 * @param {{valid: Array, invalid: Array}} test
	 * @return {{valid: Array, invalid: Array}}
	 */
	extendToClassExpression: (test) => {
		/**
		 * @param {Array} testCases
		 */
		function extendToClassExpressionIfPossible(testCases) {
			testCases.slice()
				.forEach((testCase) => {
					const extendedTestCase = {};

					const classDeclarationRegExp = /^class (?:.*) {/;
					const classDeclarationReplaceRegExp = /class ([^ ]*)/;
					const classDeclarationReplaceString = '$1 = class';

					if (testCase.code && classDeclarationRegExp.test(testCase.code)) {
						extendedTestCase.code = testCase.code.replace(
							classDeclarationReplaceRegExp,
							classDeclarationReplaceString
						);
					}

					if (testCase.output && classDeclarationRegExp.test(testCase.output)) {
						extendedTestCase.output = testCase.output.replace(
							classDeclarationReplaceRegExp,
							classDeclarationReplaceString
						);
					}

					if (Object.keys(extendedTestCase).length) {
						testCases.push(Object.assign({}, testCase, extendedTestCase));
					}
				});
		}

		extendToClassExpressionIfPossible(test.valid);
		extendToClassExpressionIfPossible(test.invalid);

		return test;
	},

	/**
	 * @param {string} text
	 * @param {{valid: Array, invalid: Array}} test
	 * @return {{valid: Array, invalid: Array}}
	 */
	prependText: (text, test) => {
		/**
		 * @param {Array} testCases
		 */
		function prepend(testCases) {
			testCases.slice()
				.forEach((testCase) => {
					if (testCase.code) {
						testCase.code = text + testCase.code;
					}

					if (testCase.output) {
						testCase.output = text + testCase.output;
					}
				});
		}

		prepend(test.valid);
		prepend(test.invalid);

		return test;
	}
};
