const {combineVisitors, visitEnumExpressions, visitConstantExpressions} = require('../visitors');
const {resolveConstantName} = require('../ast-utils');
const {toSnakeCaps} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce caps notation for constant name and enum properties'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} enumExpression
		 */
		function checkEnum(enumExpression) {
			const properties = enumExpression.expression.right.properties;

			properties.forEach((property) => {
				if (property.computed) {
					return;
				}

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

		/**
		 * @param {ASTNode} constantExpression
		 */
		function checkConstant(constantExpression) {
			const constantName = resolveConstantName(constantExpression);

			if (toSnakeCaps(constantName) !== constantName) {
				context.report({
					node: constantExpression,
					message: `Constant "${constantName}" is not in caps notation.`
				});
			}
		}

		return combineVisitors(
			visitEnumExpressions(checkEnum, sourceCode),
			visitConstantExpressions(checkConstant, sourceCode)
		);
	}
};
