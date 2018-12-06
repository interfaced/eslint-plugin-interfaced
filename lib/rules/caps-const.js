const {combineVisitors, visitEnumExpressions, visitConstantExpressions} = require('../visitors');
const {resolveConstantName, resolveEnumProperties} = require('../ast-utils');
const {toSnakeCaps} = require('../utils');

module.exports = {
	meta: {
		type: 'suggestion',

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
			resolveEnumProperties(enumExpression)
				.forEach((property) => {
					if (property.computed) {
						return;
					}

					const propertyName = property.key.type === 'Literal' ?
						property.key.raw :
						property.key.name;

					if (toSnakeCaps(propertyName) !== propertyName) {
						context.report({
							node: property.key,
							message: `Enum property "${propertyName.replace(/'/g, '')}" isn't in caps notation.`
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
					message: `Constant "${constantName}" isn't in caps notation.`
				});
			}
		}

		return combineVisitors(
			visitEnumExpressions(checkEnum, sourceCode),
			visitConstantExpressions(checkConstant, sourceCode)
		);
	}
};
