const {hasJSDocTags, getMethodName, getPropertyName} = require('../utils');
const {combineIterators, iterateOverMethodDefinitions, iterateOverPropExpressions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: (
				'disallow methods and properties with  name that starts from "_" ' +
				'without private/protected access modifier'
			)
		}
	},
	create: (context) => {
		function checkMethod(methodDefinition) {
			if (getMethodName(methodDefinition).startsWith('_') &&
				!hasJSDocTags(methodDefinition, ['protected', 'private', 'override', 'inheritdoc'], context)
			) {
				context.report({
					node: methodDefinition,
					message: (
						`Method "${getMethodName(methodDefinition)}" starts with "_" ` +
						`but not marked by @protected or @private.`
					)
				});
			}
		}

		function checkProperty(propertyExpression) {
			if (getPropertyName(propertyExpression).startsWith('_') &&
				!hasJSDocTags(propertyExpression, ['protected', 'private', 'override', 'inheritdoc'], context)
			) {
				context.report({
					node: propertyExpression,
					message: (
						`Property "${getPropertyName(propertyExpression)}" starts with "_" ` +
						`but not marked by @protected or @private.`
					)
				});
			}
		}

		return combineIterators(
			iterateOverMethodDefinitions(checkMethod),
			iterateOverPropExpressions(checkProperty, context)
		);
	}
};
