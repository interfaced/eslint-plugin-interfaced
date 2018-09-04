module.exports = {
	errors: (...args) => args.map((msg) => ({message: msg})),

	concat: (...args) => args.join('\n'),

	extendToClassExpression: (test) => {
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
	}
};
