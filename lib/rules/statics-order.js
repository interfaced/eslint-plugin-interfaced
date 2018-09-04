const {visitStaticExpressionPairs} = require('../visitors');
const {getStaticTypeFromJSDoc} = require('../ast-utils');

const DEFAULT_OPTIONS = {
	order: ['const', 'enum', 'typedef']
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce the specified order for static expressions (const, enum, typedef) '
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
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} staticExpressionA
		 * @param {ASTNode} staticExpressionB
		 */
		function check(staticExpressionA, staticExpressionB) {
			const expressionAType = getStaticTypeFromJSDoc(staticExpressionA, sourceCode);
			const expressionBType = getStaticTypeFromJSDoc(staticExpressionB, sourceCode);

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

		return visitStaticExpressionPairs(check, sourceCode);
	}
};
