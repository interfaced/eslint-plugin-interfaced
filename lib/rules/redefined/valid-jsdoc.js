const originalRule = require('eslint/lib/rules/valid-jsdoc');

const {hasJSDocWithTags} = require('../../ast-utils');
const {deepShallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = deepShallowCopy(context);

		const originalRuleVisitor = originalRule.create(contextCopy);
		const originalFunctionExpressionExitHandler = originalRuleVisitor['FunctionExpression:exit'];

		return Object.assign(originalRuleVisitor, {
			'FunctionExpression:exit': (node) => {
				contextCopy.report = (error) => {
					if (node.parent.type === 'MethodDefinition' && detectReturnTagViolation(error)) {
						const classNode = node.parent.parent.parent;

						const isInterfaceMethod = hasJSDocWithTags(classNode, ['interface'], sourceCode);
						const isRecordMethod = hasJSDocWithTags(classNode, ['record'], sourceCode);

						if (isInterfaceMethod || isRecordMethod) {
							return;
						}
					}

					context.report(error);
				};

				originalFunctionExpressionExitHandler.call(originalRuleVisitor, node);
			}
		});
	}
};

/**
 * @param {Object} error
 * @return {boolean}
 */
function detectReturnTagViolation(error) {
	return (
		error.message === 'Unexpected @{{title}} tag; function has no return statement.' ||
		error.messageId === 'unexpectedTag' // Since eslint@5.12
	);
}
