const {iterateOverTypedefExpressions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'enforce capitalization of the first letter of a typedef'
		}
	},
	create: (context) => {
		function check(typedefExpression) {
			const property = typedefExpression.expression.property;
			const propertyName = property.name;
			const propertyNameFirstChar = propertyName[0];

			if (propertyNameFirstChar !== propertyNameFirstChar.toUpperCase()) {
				context.report({
					node: property,
					message: `Typedef "${propertyName}" is not capitalized.`
				});
			}
		}

		return iterateOverTypedefExpressions(check, context);
	}
};
