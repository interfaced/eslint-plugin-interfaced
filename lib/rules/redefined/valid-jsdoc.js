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
					if (
						error.message === 'Unexpected @{{title}} tag; function has no return statement.' &&
						node.parent.type === 'MethodDefinition'
					) {
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
