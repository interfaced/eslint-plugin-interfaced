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
			const classNode = methodDefinition.parent.parent;

			const isAbstractMethod = hasJSDocTags(methodDefinition, ['abstract'], sourceCode);
			const isInterfaceMethod = hasJSDocTags(classNode, ['interface'], sourceCode);
			const isRecordMethod = hasJSDocTags(classNode, ['record'], sourceCode);

			if (isAbstractMethod || isInterfaceMethod || isRecordMethod) {
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
