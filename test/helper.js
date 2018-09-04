module.exports = {
	errors: (...args) => args.map((msg) => ({message: msg})),

	concat: (...args) => args.join('\n'),

	extendToClassExpression: (test) => {
		function extendToClassExpressionIfPossible(testCases) {
			testCases.slice()
				.forEach((testCase) => {
					const extendedTestCase = {};

					if (testCase.code && testCase.code.indexOf('class Klass') !== -1) {
						extendedTestCase.code = testCase.code.replace(/class Klass(\d|)/g, 'Klass$1 = class');
					}

					if (testCase.output && testCase.output.indexOf('class Klass') !== -1) {
						extendedTestCase.output = testCase.output.replace(/class Klass(\d|)/g, 'Klass$1 = class');
					}

					if (Object.keys(testCase).length) {
						testCases.push(Object.assign({}, testCase, extendedTestCase));
					}
				});
		}

		extendToClassExpressionIfPossible(test.valid);
		extendToClassExpressionIfPossible(test.invalid);

		return test;
	}
};
