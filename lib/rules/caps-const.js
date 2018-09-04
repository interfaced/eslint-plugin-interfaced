const {combineIterators, iterateOverEnumExpressions, iterateOverConstantExpressions} = require('../iterators');
const {toSnakeCaps} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce caps notation for constant name and enum properties'
		}
	},
	create: (context) => {
		function checkEnum(enumExpression) {
			const properties = enumExpression.expression.right.properties;

			properties.forEach((property) => {
				const propertyName = property.key.type === 'Literal' ?
					property.key.raw :
					property.key.name;

				if (toSnakeCaps(propertyName) !== propertyName) {
					context.report({
						node: property.key,
						message: `Enum property "${propertyName.replace(/'/g, '')}" is not in caps notation.`
					});
				}
			});
		}

		function checkConstant(constantExpression) {
			const property = constantExpression.expression.left.property;
			const propertyName = property.name;

			if (toSnakeCaps(propertyName) !== propertyName) {
				context.report({
					node: property,
					message: `Constant "${propertyName}" is not in caps notation.`
				});
			}
		}

		return combineIterators(
			iterateOverEnumExpressions(checkEnum, context),
			iterateOverConstantExpressions(checkConstant, context)
		);
	}
};
