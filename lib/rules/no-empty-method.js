const {hasJSDocTags} = require('../utils');
const {iterateOverMethodDefinitions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'disallow empty methods except abstract, interface and record methods'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function check(methodDefinition) {
			const ambientClassNode = methodDefinition.parent.parent;

			const isAbstractMethod = hasJSDocTags(methodDefinition, ['abstract'], context);
			const isInterfaceMethod = hasJSDocTags(ambientClassNode, ['interface'], context);
			const isRecordMethod = hasJSDocTags(ambientClassNode, ['record'], context);

			if (isInterfaceMethod || isAbstractMethod || isRecordMethod) {
				return;
			}

			if (methodDefinition.value.body.type === 'BlockStatement' &&
				methodDefinition.value.body.body.length === 0 &&
				sourceCode.getCommentsInside(methodDefinition.value.body).length === 0
			) {
				context.report({
					node: methodDefinition,
					message: 'Unexpected empty method.'
				});
			}
		}

		return iterateOverMethodDefinitions(check);
	}
};
