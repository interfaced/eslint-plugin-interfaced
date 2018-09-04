const {hasJSDocTags, getStaticTypeFromJSDoc, groupExpressions} = require('../utils');

const DEFAULT_OPTIONS = {
	order: ['const', 'enum', 'typedef']
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce specified static expressions (const, enum, typedef) order'
		},
		schema: [{
			type: 'object',
			properties: {
				order: {
					type: 'array',
					minItems: 3,
					maxItems: 3,
					items: [{
						enum: ['const', 'enum', 'typedef']
					}, {
						enum: ['const', 'enum', 'typedef']
					}, {
						enum: ['const', 'enum', 'typedef']
					}]
				}
			},
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const staticExpressions = [];

		function reportOrderViolationIfNeeded(staticExpressionA, staticExpressionB) {
			const expressionAType = getStaticTypeFromJSDoc(staticExpressionA, context);
			const expressionBType = getStaticTypeFromJSDoc(staticExpressionB, context);

			if (options.order.indexOf(expressionBType) < options.order.indexOf(expressionAType)) {
				context.report({
					node: staticExpressionB,
					message: (
						`This static expression (${expressionBType}) should be before ` +
						`previous static expression (${expressionAType}) due to its priority.`
					)
				});
			}
		}

		return {
			'ExpressionStatement': (node) => {
				if (node.parent.type === 'Program' && hasJSDocTags(node, ['const', 'enum', 'typedef'], context)) {
					staticExpressions.push(node);
				}
			},
			'Program:exit': () => {
				groupExpressions(staticExpressions)
					.forEach((group) => {
						group.reduce((previousStaticExpression, staticExpression) => {
							if (previousStaticExpression) {
								reportOrderViolationIfNeeded(previousStaticExpression, staticExpression);
							}

							return staticExpression;
						}, null);
					});
			}
		};
	}
};
