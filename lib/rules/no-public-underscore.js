const {hasJSDocTags, getPropertiesFromConstructor, getMethodName, getPropertyName} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: (
				'disallow methods and properties that have name which starts from "_" ' +
				'without private/protected access modifier'
			)
		}
	},
	create: (context) => {
		function reportRuleViolationForMethodIfNeeded(methodDefinition) {
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

		function reportRuleViolationForPropertyIfNeeded(propertyExpression) {
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

		return {
			'MethodDefinition': (node) => {
				reportRuleViolationForMethodIfNeeded(node);

				getPropertiesFromConstructor(node, context)
					.forEach((property) => reportRuleViolationForPropertyIfNeeded(property));
			}
		};
	}
};
