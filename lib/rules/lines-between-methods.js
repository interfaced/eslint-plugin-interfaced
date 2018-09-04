const {visitMethodDefinitionPairs} = require('../visitors');
const {getJSDocComment} = require('../ast-utils');
const {fixNewlinesBetweenNodes} = require('../utils');

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
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} methodADefinition
		 * @param {ASTNode} methodBDefinition
		 */
		function check(methodADefinition, methodBDefinition) {
			const methodBJSDoc = getJSDocComment(methodBDefinition, sourceCode);

			if (sourceCode.getCommentsBefore((methodBJSDoc || methodBDefinition)).length) {
				context.report({
					node: methodBDefinition,
					message: 'Unexpected comments between methods.'
				});

				return;
			}

			const methodAEndLine = methodADefinition.loc.end.line;
			const methodBStartLine = (methodBJSDoc || methodBDefinition).loc.start.line;

			const requiredNewlinesBetweenMethods = options.amount;
			const givenNewlinesBetweenMethods = Math.max(methodBStartLine - methodAEndLine - 1, 0);

			if (givenNewlinesBetweenMethods !== requiredNewlinesBetweenMethods) {
				context.report({
					node: methodBDefinition,
					message: (
						`Amount of newlines between methods should be ${requiredNewlinesBetweenMethods}, ` +
						`but ${givenNewlinesBetweenMethods} given.`
					),
					fix(fixer) {
						return fixNewlinesBetweenNodes(
							methodADefinition,
							methodBJSDoc || methodBDefinition,
							requiredNewlinesBetweenMethods,
							fixer,
							sourceCode
						);
					}
				});
			}
		}

		return visitMethodDefinitionPairs(check);
	}
};
