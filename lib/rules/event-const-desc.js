const {visitConstantExpressions} = require('../visitors');
const {getJSDocDescription, resolveConstantName} = require('../ast-utils');
const {LINE_BREAK_MATCHER} = require('../utils');

module.exports = {
	meta: {
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
			const constantName = resolveConstantName(constantExpression);

			if (constantName.startsWith('EVENT_')) {
				const description = getJSDocDescription(constantExpression, sourceCode);

				if (!description.split(LINE_BREAK_MATCHER).some((line) => line.startsWith('Fired with:'))) {
					context.report({
						node: constantExpression,
						message: `Event constant "${constantName}" has no "Fired with: ..." description.`
					});
				}
			}
		}

		return visitConstantExpressions(check, sourceCode);
	}
};
