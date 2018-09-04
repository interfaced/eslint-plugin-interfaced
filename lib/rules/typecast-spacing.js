const {hasJSDocTags, getJSDocComment} = require('../jsdoc');

module.exports = {
	meta: {
		docs: {
			description: 'enforce spacing for typecast (JSDoc + parenthesis)'
		},
		fixable: 'whitespace'
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function check(node) {
			const tokenBefore = sourceCode.getTokenBefore(node, {
				includeComments: true
			});

			const tokenAfter = sourceCode.getTokenAfter(node, {
				includeComments: true
			});

			const hasTypecasting = (
				tokenBefore &&
				tokenBefore.type === 'Punctuator' &&
				tokenBefore.value === '(' &&
				hasJSDocTags(tokenBefore, ['type'], sourceCode) &&

				tokenAfter &&
				tokenAfter.type === 'Punctuator' &&
				tokenAfter.value === ')'
			);

			if (!hasTypecasting) {
				return;
			}

			const JSDocComment = getJSDocComment(tokenBefore, sourceCode);

			if (!sourceCode.isSpaceBetweenTokens(JSDocComment, tokenBefore)) {
				context.report({
					node,
					message: 'There is no space between type block and opening parenthesis in typecast.',
					fix: (fixer) => fixer.replaceTextRange([JSDocComment.range[1], tokenBefore.range[0]], ' ')
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
