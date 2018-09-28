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
	},

	/**
	 * @param {{valid: Array, invalid: Array}} test
	 * @return {{valid: Array, invalid: Array}}
	 */
	extendClassDeclarations: (test) => {
		/**
		 * @param {Array} testCases
		 */
		function extend(testCases) {
			testCases.slice()
				.forEach((testCase) => {
					const replacers = [
						assignmentReplacer,
						assignmentToMemberExpressionReplacer,
						variableDeclarationReplacer
					];

					const declarationRegExp = /class (.*?) /g;
					const extendedTestCases = Array.from(Array(replacers.length)).map(() => ({}));

					let execResult;

					// eslint-disable-next-line no-cond-assign
					while (execResult = declarationRegExp.exec(testCase.code)) {
						// eslint-disable-next-line no-loop-func
						replacers.forEach((replacer, index) => {
							extendedTestCases[index].code = (
								replacer(extendedTestCases[index].code || testCase.code, execResult[1])
							);
						});
					}

					declarationRegExp.lastIndex = 0;

					// eslint-disable-next-line no-cond-assign
					while (execResult = declarationRegExp.exec(testCase.output)) {
						// eslint-disable-next-line no-loop-func
						replacers.forEach((replacer, index) => {
							extendedTestCases[index].output = (
								replacer(extendedTestCases[index].output || testCase.output, execResult[1])
							);
						});
					}

					extendedTestCases.forEach((extendedTestCase) => {
						if (Object.keys(extendedTestCase).length) {
							testCases.push(Object.assign({}, testCase, extendedTestCase));
						}
					});
				});
		}

		function assignmentReplacer(code, className) {
			return code.replace(new RegExp(`class ${className}`), `${className} = class`);
		}

		function assignmentToMemberExpressionReplacer(code, className) {
			return assignmentReplacer(code, className)
				.replace(new RegExp(className, 'g'), `ns.${className}`);
		}

		function variableDeclarationReplacer(code, className) {
			return code.replace(new RegExp(`class ${className}`), `const ${className} = class`);
		}

		extend(test.valid);
		extend(test.invalid);

		return test;
	}
};
