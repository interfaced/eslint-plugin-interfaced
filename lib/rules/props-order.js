const {visitPropExpressionPairs} = require('../visitors');
const {getScopeFromJSDoc, hasJSDocTags} = require('../jsdoc');
const {resolvePropName} = require('../ast');

const DEFAULT_OPTIONS = {
	scopesOrder: ['public', 'protected', 'private'],
	constInTheEnd: true
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce specified order for properties'
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
		const sourceCode = context.getSourceCode();

		function check(propAExpression, propBExpression) {
			const propAName = resolvePropName(propAExpression);
			const propBName = resolvePropName(propBExpression);

			const propAScope = getScopeFromJSDoc(propAExpression, sourceCode) || 'public';
			const propBScope = getScopeFromJSDoc(propBExpression, sourceCode) || 'public';

			const isPropAConstant = hasJSDocTags(propAExpression, ['const'], sourceCode);
			const isPropBConstant = hasJSDocTags(propBExpression, ['const'], sourceCode);

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

		return visitPropExpressionPairs(check, context);
	}
};
