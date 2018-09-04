const originalRule = require('eslint/lib/rules/valid-jsdoc');
const {hasJSDocTags} = require('../../jsdoc');
const {shallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = shallowCopy(context);

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

						const isInterfaceMethod = hasJSDocTags(classNode, ['interface'], sourceCode);
						const isRecordMethod = hasJSDocTags(classNode, ['record'], sourceCode);

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
