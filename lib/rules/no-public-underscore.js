const {combineVisitors, visitMethodDefinitions, visitPropExpressions} = require('../visitors');
const {resolvePropName, hasJSDocWithTags} = require('../ast-utils');

module.exports = {
	meta: {
		docs: {
			type: 'suggestion',

			description: (
				'disallow methods and properties with name that starts from "_" ' +
				'without private/protected access modifier'
			)
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} methodDefinition
		 */
		function checkMethod(methodDefinition) {
			const methodName = methodDefinition.key.name;

			const canHaveUnderscore =
				hasJSDocWithTags(methodDefinition, ['protected', 'private', 'override', 'inheritdoc'], sourceCode);

			if (methodName.startsWith('_') && !canHaveUnderscore) {
				context.report({
					node: methodDefinition,
					message: (
						`Method "${methodName}" starts with "_" ` +
						`but not annotated by @protected or @private.`
					)
				});
			}
		}

		/**
		 * @param {ASTNode} propertyExpression
		 */
		function checkProp(propertyExpression) {
			const propName = resolvePropName(propertyExpression);

			const canHaveUnderscore =
				hasJSDocWithTags(propertyExpression, ['protected', 'private', 'override', 'inheritdoc'], sourceCode);

			if (propName.startsWith('_') && !canHaveUnderscore) {
				context.report({
					node: propertyExpression,
					message: (
						`Property "${propName}" starts with "_" ` +
						`but not annotated by @protected or @private.`
					)
				});
			}
		}

		return combineVisitors(
			visitMethodDefinitions(checkMethod),
			visitPropExpressions(checkProp, sourceCode)
		);
	}
};
