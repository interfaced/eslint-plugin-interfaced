const {iterateOverEnumExpressions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'enforce capitalization of the first letter of an enum'
		}
	},
	create: (context) => {
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

		return iterateOverEnumExpressions(check, context);
	}
};
