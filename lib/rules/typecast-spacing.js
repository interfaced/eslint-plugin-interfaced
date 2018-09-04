const {isTypecast, getJSDocComment} = require('../ast-utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce spacing for typecast (JSDoc + parenthesis)'
		},
		fixable: 'whitespace'
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} node
		 */
		function check(node) {
			if (!isTypecast(node, sourceCode)) {
				return;
			}

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

		return {
			'AssignmentExpression': (node) => check(node.right),
			'ArrowFunctionExpression': (node) => {
				// Inline body, e.g.: 'const func = () => 10;'
				if (node.body.type !== 'BlockStatement') {
					check(node.body);
				}
			},
			'ReturnStatement': (node) => {
				// Statement may be empty, e.g. 'return;'
				if (node.argument) {
					check(node.argument);
				}
			},
			'VariableDeclarator': (node) => {
				// Declarator may be empty, e.g.: 'let myVariable;'
				if (node.init) {
					check(node.init);
				}
			}
		};
	}
};
