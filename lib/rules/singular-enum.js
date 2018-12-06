const pluralize = require('pluralize');

const {visitEnumExpressions} = require('../visitors');
const {resolveEnumName} = require('../ast-utils');

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce enum name to be singular'
		}
	},
	create: (context) => {
		/**
		 * @param {ASTNode} enumExpression
		 */
		function check(enumExpression) {
			const enumName = resolveEnumName(enumExpression);

			if (pluralize.isPlural(enumName)) {
				context.report({
					node: enumExpression,
					message: `Enum "${enumName}" isn't singular.`
				});
			}
		}

		return visitEnumExpressions(check, context.getSourceCode());
	}
};
