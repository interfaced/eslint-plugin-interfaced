const {combineIterators, iterateOverEnumExpressions, iterateOverConstantExpressions} = require('../iterators');
const {toSnakeCaps} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce caps notation for constant name and enum properties'
		},
		fixable: 'code'
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
						message: `Enum property "${propertyName.replace(/'/g, '')}" is not in caps notation.`,
						fix: (fixer) =>
							fixer.replaceText(property.key, `${toSnakeCaps(propertyName)}`)
					});
				}
			});
		}

		function checkConstant(constantExpression) {
			const property = constantExpression.expression.left.property;

			if (toSnakeCaps(property.name) !== property.name) {
				context.report({
					node: property,
					message: `Constant "${property.name}" is not in caps notation.`,
					fix: (fixer) =>
						fixer.replaceText(property, `${toSnakeCaps(property.name)}`)
				});
			}
		}

		return combineIterators(
			iterateOverEnumExpressions(checkEnum, context),
			iterateOverConstantExpressions(checkConstant, context)
		);
	}
};
