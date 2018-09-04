const originalRule = require('eslint/lib/rules/require-jsdoc');
const {getJSDocComment} = require('../../jsdoc');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();

		return Object.assign(originalRule.create(context), {
			'ClassExpression': (node) => {
				if (context.options[0] && context.options[0].require.ClassDeclaration) {
					if (!getJSDocComment(node, sourceCode)) {
						context.report({
							node,
							message: 'Missing JSDoc comment.'
						});
					}
				}
			}
		});
	}
};
