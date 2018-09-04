const {hasJSDocTags, getJSDocComment} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce space between jsdoc and parenthesis (typecast)'
		},
		fixable: 'whitespace'
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function check(node, parentNode) {
			const tokenBefore = sourceCode.getTokenBefore(node, {
				includeComments: true
			});

			const tokenAfter = sourceCode.getTokenAfter(node, {
				includeComments: true
			});

			// Node may be not traversed yet and doesn't have parent
			node.parent = parentNode;

			const hasTypecasting = (
				tokenBefore &&
				tokenBefore.type === 'Punctuator' &&
				tokenBefore.value === '(' &&
				hasJSDocTags(tokenBefore, ['type'], context) &&

				tokenAfter &&
				tokenAfter.type === 'Punctuator' &&
				tokenAfter.value === ')'
			);

			if (!hasTypecasting) {
				return;
			}

			const JSDocComment = getJSDocComment(tokenBefore, context);

			if (!sourceCode.isSpaceBetweenTokens(JSDocComment, tokenBefore)) {
				context.report({
					node,
					message: 'There is no space between type block and opening parenthesis in typecast.',
					fix: (fixer) =>
						fixer.replaceTextRange([JSDocComment.range[1], tokenBefore.range[0]], ' ')
				});
			}
		}

		return {
			'AssignmentExpression': (node) => check(node.right, node),
			'ArrowFunctionExpression': (node) => {
				// Inline body, e.g.: 'const func = () => 10;'
				if (node.body.type !== 'BlockStatement') {
					check(node.body, node);
				}
			},
			'ReturnStatement': (node) => {
				// Statement may be empty, e.g. 'return;'
				if (node.argument) {
					check(node.argument, node);
				}
			},
			'VariableDeclarator': (node) => {
				// Declarator may be empty, e.g.: 'let myVariable;'
				if (node.init) {
					check(node.init, node);
				}
			}
		};
	}
};
