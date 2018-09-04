const {hasJSDocTags, getJSDocDescription, getPropertiesFromConstructor} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce event description ("Fired with: ...") for event constant'
		}
	},
	create: (context) => {
		function reportRuleViolationIfNeeded(constantExpression) {
			const isAssignmentToIdentifier = (
				constantExpression.expression.type === 'AssignmentExpression' &&
				constantExpression.expression.left.property.type === 'Identifier'
			);

			if (isAssignmentToIdentifier) {
				const constantName = constantExpression.expression.left.property.name;

				if (constantName.startsWith('EVENT_')) {
					const description = getJSDocDescription(constantExpression, context);

					if (!description.split('\n').some((line) => line.startsWith('Fired with:'))) {
						context.report({
							node: constantExpression,
							message: `Event constant "${constantName}" has no "Fired with: ..." description.`
						});
					}
				}
			}
		}

		return {
			'MethodDefinition': (node) => {
				getPropertiesFromConstructor(node, context)
					.forEach((propertyExpression) => {
						if (hasJSDocTags(propertyExpression, ['const'], context)) {
							reportRuleViolationIfNeeded(propertyExpression);
						}
					});
			},
			'ExpressionStatement': (node) => {
				if (node.parent.type === 'Program' && hasJSDocTags(node, ['const'], context)) {
					reportRuleViolationIfNeeded(node);
				}
			}
		};
	}
};
