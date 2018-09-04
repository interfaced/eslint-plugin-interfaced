const {hasJSDocTags, getPropertiesFromConstructor} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce caps notation for constant name and enum properties'
		},
		fixable: 'code'
	},
	create: (context) => {
		// Based on "morph" (https://github.com/cmoncrief/morph) source code
		function toSnakeCaps(input) {
			let output;

			output = input.replace(/([A-Z])([A-Z][a-z])/g, '$1_$2');
			output = output.replace(/([a-z])([A-Z])/g, '$1_$2');
			output = output.replace(/[-. ]/g, '_');
			output = output.toUpperCase();

			return output;
		}

		function reportRuleViolationForEnumIfNeeded(enumExpression) {
			const isObjectAssignmentExpression = (
				enumExpression.expression.type === 'AssignmentExpression' &&
				enumExpression.expression.right.type === 'ObjectExpression'
			);

			if (isObjectAssignmentExpression) {
				const properties = enumExpression.expression.right.properties;

				properties.forEach((property) => {
					if (toSnakeCaps(property.key.name) !== property.key.name) {
						context.report({
							node: property.key,
							message: `Enum property "${property.key.name}" is not in caps notation.`,
							fix: (fixer) =>
								fixer.replaceText(property.key, `${toSnakeCaps(property.key.name)}`)
						});
					}
				});
			}
		}

		function reportRuleViolationForConstantIfNeeded(constantExpression) {
			const isAssignmentToIdentifier = (
				constantExpression.expression.type === 'AssignmentExpression' &&
				constantExpression.expression.left.property.type === 'Identifier'
			);

			if (isAssignmentToIdentifier) {
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
		}

		return {
			'MethodDefinition': (node) => {
				getPropertiesFromConstructor(node, context)
					.forEach((propertyExpression) => {
						if (hasJSDocTags(propertyExpression, ['const'], context)) {
							reportRuleViolationForConstantIfNeeded(propertyExpression);
						}
					});
			},
			'ExpressionStatement': (node) => {
				if (node.parent.type === 'Program' && hasJSDocTags(node, ['enum'], context)) {
					reportRuleViolationForEnumIfNeeded(node);
				}

				if (node.parent.type === 'Program' && hasJSDocTags(node, ['const'], context)) {
					reportRuleViolationForConstantIfNeeded(node);
				}
			}
		};
	}
};
