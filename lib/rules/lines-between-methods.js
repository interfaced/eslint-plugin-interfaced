const {getStartLineIncludingComments, getFirstComment, fixNewlinesBetween} = require('../utils');
const {iterateOverMethodDefinitionPairs} = require('../iterators');

const DEFAULT_OPTIONS = {
	amount: 1
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newlines between methods'
		},
		schema: [{
			type: 'object',
			properties: {
				amount: {
					type: 'number'
				}
			},
			additionalProperties: false
		}],
		fixable: 'whitespace'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function check(methodADefinition, methodBDefinition) {
			const methodAEndLine = methodADefinition.loc.end.line;
			const methodBStartLine = getStartLineIncludingComments(methodBDefinition, context);
			const methodBFirstComment = getFirstComment(methodBDefinition, context);

			const requiredNewlinesBetweenMethods = options.amount;
			const givenNewlinesBetweenMethods = Math.max(methodBStartLine - methodAEndLine - 1, 0);

			if (givenNewlinesBetweenMethods !== requiredNewlinesBetweenMethods) {
				context.report({
					node: methodBDefinition,
					message: (
						`Amount of newlines between methods should be ${requiredNewlinesBetweenMethods}, ` +
						`but ${givenNewlinesBetweenMethods} given.`
					),
					fix: (fixer) => fixNewlinesBetween(
						methodADefinition,
						methodBFirstComment || methodBDefinition,
						requiredNewlinesBetweenMethods,
						fixer,
						context
					)
				});
			}
		}

		return iterateOverMethodDefinitionPairs(check);
	}
};
