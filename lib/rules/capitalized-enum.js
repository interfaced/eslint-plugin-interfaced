const {iterateOverEnumExpressions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'enforce capitalization of the first letter of an enum'
		},
		fixable: 'code'
	},
	create: (context) => {
		function check(enumExpression) {
			const property = enumExpression.expression.left.property;
			const propertyName = property.name;
			const propertyNameFirstChar = property.name[0];

			if (propertyNameFirstChar !== propertyNameFirstChar.toUpperCase()) {
				context.report({
					node: property,
					message: `Enum "${property.name}" is not capitalized.`,
					fix: (fixer) => fixer.replaceText(
						property,
						propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
					)
				});
			}
		}

		return iterateOverEnumExpressions(check, context);
	}
};
