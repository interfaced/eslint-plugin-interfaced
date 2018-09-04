const {combineVisitors, visitMethodDefinitions, visitPropExpressions} = require('../visitors');
const {hasJSDocTags} = require('../jsdoc');
const {resolvePropName} = require('../ast');

module.exports = {
	meta: {
		docs: {
			description: (
				'disallow methods and properties with name that starts from "_" ' +
				'without private/protected access modifier'
			)
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function checkMethod(methodDefinition) {
			if (methodDefinition.key.name.startsWith('_') &&
				!hasJSDocTags(methodDefinition, ['protected', 'private', 'override', 'inheritdoc'], sourceCode)
			) {
				context.report({
					node: methodDefinition,
					message: (
						`Method "${methodDefinition.key.name}" starts with "_" ` +
						`but not marked by @protected or @private.`
					)
				});
			}
		}

		function checkProp(propertyExpression) {
			if (resolvePropName(propertyExpression).startsWith('_') &&
				!hasJSDocTags(propertyExpression, ['protected', 'private', 'override', 'inheritdoc'], sourceCode)
			) {
				context.report({
					node: propertyExpression,
					message: (
						`Property "${resolvePropName(propertyExpression)}" starts with "_" ` +
						`but not marked by @protected or @private.`
					)
				});
			}
		}

		return combineVisitors(
			visitMethodDefinitions(checkMethod),
			visitPropExpressions(checkProp, context)
		);
	}
};
