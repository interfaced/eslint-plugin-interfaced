const {combineIterators, iterateOverMethodDefinitions, iterateOverPropExpressions} = require('../iterators');
const {hasJSDocTags} = require('../jsdoc');
const {resolvePropertyName} = require('../utils');

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

		function checkProperty(propertyExpression) {
			if (resolvePropertyName(propertyExpression).startsWith('_') &&
				!hasJSDocTags(propertyExpression, ['protected', 'private', 'override', 'inheritdoc'], sourceCode)
			) {
				context.report({
					node: propertyExpression,
					message: (
						`Property "${resolvePropertyName(propertyExpression)}" starts with "_" ` +
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
