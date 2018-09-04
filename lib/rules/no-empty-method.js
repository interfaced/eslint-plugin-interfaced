const {hasJSDocTags} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'disallow empty methods except abstract and interface methods'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function reportNoEmptyMethodViolationIfNeeded(methodDefinition) {
			const ambientClassNode = methodDefinition.parent.parent;

			const isInterfaceMethod = hasJSDocTags(ambientClassNode, ['interface'], context);
			const isAbstractMethod = hasJSDocTags(methodDefinition, ['abstract'], context);

			if (isInterfaceMethod || isAbstractMethod) {
				return;
			}

			if (methodDefinition.value.body.type === 'BlockStatement' &&
				methodDefinition.value.body.body.length === 0 &&
				sourceCode.getComments(methodDefinition.value.body).trailing.length === 0
			) {
				context.report({
					node: methodDefinition,
					message: 'Unexpected empty method.'
				});
			}
		}

		return {
			'MethodDefinition': (node) => reportNoEmptyMethodViolationIfNeeded(node)
		};
	}
};
