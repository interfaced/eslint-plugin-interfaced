const {visitMethodDefinitions} = require('../visitors');
const {hasJSDocTags} = require('../ast-utils');

module.exports = {
	meta: {
		docs: {
			description: 'disallow empty methods when class is neither abstract, interface nor record'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} methodDefinition
		 */
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

		return visitMethodDefinitions(check);
	}
};
