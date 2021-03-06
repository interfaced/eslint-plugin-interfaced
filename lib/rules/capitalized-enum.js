const {visitEnumExpressions} = require('../visitors');
const {resolveEnumName} = require('../ast-utils');

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce capitalization of the first letter of an enum'
		}
	},
	create: (context) => {
		/**
		 * @param {ASTNode} enumExpression
		 */
		function check(enumExpression) {
			const enumName = resolveEnumName(enumExpression);
			const enumNameFirstChar = enumName[0];

			if (enumNameFirstChar !== enumNameFirstChar.toUpperCase()) {
				context.report({
					node: enumExpression,
					message: `Enum "${enumName}" isn't capitalized.`
				});
			}
		}

		return visitEnumExpressions(check, context.getSourceCode());
	}
};
