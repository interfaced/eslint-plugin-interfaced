const {visitMethodDefinitions} = require('../visitors');
const {hasJSDocWithTags} = require('../ast-utils');

module.exports = {
	meta: {
		type: 'suggestion',

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

			const isAbstractMethod = hasJSDocWithTags(methodDefinition, ['abstract'], sourceCode);
			const isInterfaceMethod = hasJSDocWithTags(classNode, ['interface'], sourceCode);
			const isRecordMethod = hasJSDocWithTags(classNode, ['record'], sourceCode);

			if (isAbstractMethod || isInterfaceMethod || isRecordMethod) {
				return;
			}

			const isMethodHaveNoCodeInBody = (
				methodDefinition.value.body.type === 'BlockStatement' &&
				methodDefinition.value.body.body.length === 0
			);

			const isMethodHaveNoCommentsInBody = sourceCode.getCommentsInside(methodDefinition.value.body).length === 0;

			if (isMethodHaveNoCodeInBody && isMethodHaveNoCommentsInBody) {
				context.report({
					node: methodDefinition,
					message: 'Unexpected empty method.'
				});
			}
		}

		return visitMethodDefinitions(check);
	}
};
