const {getScopeFromJSDoc, getPropertiesFromConstructor, getPropertyName, hasJSDocTags} = require('../utils');

const DEFAULT_OPTIONS = {
	scopesOrder: ['public', 'protected', 'private'],
	constInTheEnd: true
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce specified properties order'
		},
		schema: [{
			type: 'object',
			properties: {
				scopesOrder: {
					type: 'array',
					minItems: 3,
					maxItems: 3,
					items: [{
						enum: ['public', 'protected', 'private']
					}, {
						enum: ['public', 'protected', 'private']
					}, {
						enum: ['public', 'protected', 'private']
					}]
				},
				constInTheEnd: {
					type: 'boolean'
				}
			},
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const propertyExpressions = [];

		function reportOrderViolationIfNeeded(propAExpression, propBExpression) {
			const propAName = getPropertyName(propAExpression);
			const propBName = getPropertyName(propBExpression);

			const propAScope = getScopeFromJSDoc(propAExpression, context) || 'public';
			const propBScope = getScopeFromJSDoc(propBExpression, context) || 'public';

			const isPropAConstant = hasJSDocTags(propAExpression, ['const'], context);
			const isPropBConstant = hasJSDocTags(propBExpression, ['const'], context);

			const isPropBScopeHigher =
				options.scopesOrder.indexOf(propBScope) < options.scopesOrder.indexOf(propAScope);

			if (!isPropBConstant && isPropBScopeHigher) {
				context.report({
					node: propBExpression,
					message: (
						`Prop "${propBName}" (${propBScope}) should be before ` +
						`prop "${propAName}" (${propAScope}) due to its priority.`
					)
				});
			}

			if (options.constInTheEnd && isPropAConstant && !isPropBConstant) {
				context.report({
					node: propAExpression,
					message: (
						`Prop "${propAName}" is constant and should be in the end of property declarations section.`
					)
				});
			}
		}

		return {
			'MethodDefinition': (node) => {
				propertyExpressions.push(...getPropertiesFromConstructor(node, context));
			},
			'Program:exit': () => {
				propertyExpressions.reduce((previousPropExpression, propertyExpression) => {
					if (previousPropExpression) {
						reportOrderViolationIfNeeded(previousPropExpression, propertyExpression);
					}

					return propertyExpression;
				}, null);
			}
		};
	}
};
