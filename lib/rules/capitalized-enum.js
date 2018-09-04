const {visitEnumExpressions} = require('../visitors');

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
			const property = enumExpression.expression.left.property;
			const propertyName = property.name;
			const propertyNameFirstChar = propertyName[0];

			if (propertyNameFirstChar !== propertyNameFirstChar.toUpperCase()) {
				context.report({
					node: property,
					message: `Enum "${propertyName}" is not capitalized.`
				});
			}
		}

		return visitEnumExpressions(check, context.getSourceCode());
	}
};
