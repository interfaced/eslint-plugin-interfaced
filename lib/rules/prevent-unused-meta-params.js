const {resolveParamNames, hasJSDocWithTags} = require('../ast-utils');

module.exports = {
	meta: {
		docs: {
			type: 'suggestion',

			description: 'prevent interface, record, abstract or overriding method params to be marked as unused'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} functionExpression
		 */
		function check(functionExpression) {
			if (functionExpression.parent.type !== 'MethodDefinition') {
				return;
			}

			const methodDefinition = functionExpression.parent;
			const classNode = methodDefinition.parent.parent;

			const isAbstractMethod = hasJSDocWithTags(methodDefinition, ['abstract'], sourceCode);
			const isOverrideMethod = hasJSDocWithTags(methodDefinition, ['override'], sourceCode);
			const isInterfaceMethod = hasJSDocWithTags(classNode, ['interface'], sourceCode);
			const isRecordMethod = hasJSDocWithTags(classNode, ['record'], sourceCode);

			if (isAbstractMethod || isOverrideMethod || isInterfaceMethod || isRecordMethod) {
				methodDefinition.value.params.forEach((param) => {
					resolveParamNames(param)
						.forEach((name) => {
							context.markVariableAsUsed(name);
						});
				});
			}
		}

		return {
			'FunctionExpression': check
		};
	}
};
