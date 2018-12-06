const {visitPropExpressionPairs} = require('../visitors');
const {resolvePropName, getAnnotatedScope, hasJSDocWithTags} = require('../ast-utils');

const DEFAULT_OPTIONS = {
	scopesOrder: ['public', 'protected', 'private'],
	constInTheEnd: true
};

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'enforce the specified order for properties'
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

		/**
		 * @param {ASTNode} propAExpression
		 * @param {ASTNode} propBExpression
		 */
		function check(propAExpression, propBExpression) {
			const propAName = resolvePropName(propAExpression);
			const propBName = resolvePropName(propBExpression);

			const propAScope = getAnnotatedScope(propAExpression, sourceCode) || 'public';
			const propBScope = getAnnotatedScope(propBExpression, sourceCode) || 'public';

			const isPropAConstant = hasJSDocWithTags(propAExpression, ['const'], sourceCode);
			const isPropBConstant = hasJSDocWithTags(propBExpression, ['const'], sourceCode);

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
						`Prop "${propAName}" is constant and should be in the end of props declaration section.`
					)
				});
			}
		}

		return visitPropExpressionPairs(check, sourceCode);
	}
};
