const {iterateOverMethodDefinitions} = require('../iterators');
const {hasJSDocTags} = require('../jsdoc');

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

			const isAbstractMethod = hasJSDocTags(methodDefinition, ['abstract'], sourceCode);
			const isInterfaceMethod = hasJSDocTags(ambientClassNode, ['interface'], sourceCode);
			const isRecordMethod = hasJSDocTags(ambientClassNode, ['record'], sourceCode);

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
