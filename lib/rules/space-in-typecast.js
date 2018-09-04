const {hasJSDocTags, getJSDocComment} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce whitespace between jsdoc and parenthesis (typecast)'
		},
		fixable: 'code'
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function reportSpaceInTypecastViolationIfNeeded(node) {
			const JSDocComment = getJSDocComment(node, context);
			const parenthesisToken = sourceCode.getTokenBefore(node);

			if (!sourceCode.isSpaceBetweenTokens(JSDocComment, parenthesisToken)) {
				context.report({
					node,
					message: `There is no space between type block and opening parenthesis in typecast.`,
					fix: (fixer) =>
						fixer.replaceTextRange([JSDocComment.range[1], parenthesisToken.range[0]], ' ')
				});
			}
		}

		function handleTypecast(node, parentNode) {
			const tokenBefore = sourceCode.getTokenBefore(node, {
				includeComments: true
			});

			const tokenAfter = sourceCode.getTokenAfter(node, {
				includeComments: true
			});

			// Node may be not traversed yet and doesn't have parent
			node.parent = parentNode;

			const hasTypecasting = (
				hasJSDocTags(node, ['type'], context) &&
				tokenBefore && tokenBefore.type === 'Punctuator' && tokenBefore.value === '(' &&
				tokenAfter && tokenAfter.type === 'Punctuator' && tokenAfter.value === ')'
			);

			if (hasTypecasting) {
				reportSpaceInTypecastViolationIfNeeded(node);
			}
		}

		return {
			'AssignmentExpression': (node) => handleTypecast(node.right, node),
			'ArrowFunctionExpression': (node) => {
				// Inline body, e.g.: 'const func = () => 10;'
				if (node.body.type !== 'BlockStatement') {
					handleTypecast(node.body, node);
				}
			},
			'ReturnStatement': (node) => {
				// Statement may be empty, e.g. 'return;'
				if (node.argument) {
					handleTypecast(node.argument, node);
				}
			},
			'VariableDeclarator': (node) => {
				// Declarator may be empty, e.g.: 'let myVariable;'
				if (node.init) {
					handleTypecast(node.init, node);
				}
			}
		};
	}
};
