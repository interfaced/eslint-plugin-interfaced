const {visitEventConstantExpressions} = require('../visitors');
const {getAnnotatedDescription, resolveConstantName} = require('../ast-utils');
const {LINE_BREAK_MATCHER} = require('../utils');

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce event description ("Fired with: ...") for event constant'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} constantExpression
		 */
		function check(constantExpression) {
			const name = resolveConstantName(constantExpression);
			const description = getAnnotatedDescription(constantExpression, sourceCode);

			if (!description || !description.split(LINE_BREAK_MATCHER).some((line) => line.startsWith('Fired with:'))) {
				context.report({
					node: constantExpression,
					message: `Event constant "${name}" has no "Fired with: ..." description.`
				});
			}
		}

		return visitEventConstantExpressions(check, sourceCode);
	}
};
