const {visitTypedefExpressions} = require('../visitors');
const {resolveTypedefName} = require('../ast-utils');

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce capitalization of the first letter of a typedef'
		}
	},
	create: (context) => {
		/**
		 * @param {ASTNode} typedefExpression
		 */
		function check(typedefExpression) {
			const typedefName = resolveTypedefName(typedefExpression);
			const typedefNameFirstChar = typedefName[0];

			if (typedefNameFirstChar !== typedefNameFirstChar.toUpperCase()) {
				context.report({
					node: typedefExpression,
					message: `Typedef "${typedefName}" isn't capitalized.`
				});
			}
		}

		return visitTypedefExpressions(check, context.getSourceCode());
	}
};
