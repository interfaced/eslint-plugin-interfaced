const {visitEnumExpressions} = require('../visitors');
const {resolveEnumName} = require('../ast-utils');

module.exports = {
	meta: {
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
					message: `Enum "${enumName}" is not capitalized.`
				});
			}
		}

		return visitEnumExpressions(check, context.getSourceCode());
	}
};
