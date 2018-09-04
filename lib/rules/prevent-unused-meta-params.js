const {hasJSDocTags} = require('../jsdoc');
const {resolveParamNames} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'prevent interface, record, abstract or override method params to be marked as unused'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function check(functionExpression) {
			if (functionExpression.parent.type !== 'MethodDefinition') {
				return;
			}

			const methodDefinition = functionExpression.parent;
			const classNode = methodDefinition.parent.parent;

			const isAbstractMethod = hasJSDocTags(methodDefinition, ['abstract'], sourceCode);
			const isOverrideMethod = hasJSDocTags(methodDefinition, ['override'], sourceCode);
			const isInterfaceMethod = hasJSDocTags(classNode, ['interface'], sourceCode);
			const isRecordMethod = hasJSDocTags(classNode, ['record'], sourceCode);

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
