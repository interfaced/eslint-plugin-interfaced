const {visitTypecastNodes} = require('../visitors');
const {getJSDocComment} = require('../ast-utils');

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'enforce spacing in typecast (JSDoc + parenthesis)'
		},

		fixable: 'whitespace'
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} node
		 */
		function check(node) {
			const tokenBefore = sourceCode.getTokenBefore(node, {
				includeComments: true
			});

			const JSDocComment = getJSDocComment(tokenBefore, sourceCode);

			if (!sourceCode.isSpaceBetweenTokens(JSDocComment, tokenBefore)) {
				context.report({
					node,
					message: 'There is no space between type block and opening parenthesis in typecast.',
					fix(fixer) {
						return fixer.replaceTextRange([JSDocComment.range[1], tokenBefore.range[0]], ' ');
					}
				});
			}
		}

		return visitTypecastNodes(check, sourceCode);
	}
};
