const {iterateOverTypedefExpressions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'enforce capitalization of the first letter of a typedef'
		},
		fixable: 'code'
	},
	create: (context) => {
		function check(typedefExpression) {
			const property = typedefExpression.expression.property;
			const propertyName = property.name;
			const propertyNameFirstChar = property.name[0];

			if (propertyNameFirstChar !== propertyNameFirstChar.toUpperCase()) {
				context.report({
					node: property,
					message: `Typedef "${property.name}" is not capitalized.`,
					fix: (fixer) => fixer.replaceText(
						property,
						propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
					)
				});
			}
		}

		return iterateOverTypedefExpressions(check, context);
	}
};
