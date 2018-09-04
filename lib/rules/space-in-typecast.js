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

		function handleTypecast(node) {
			const tokenBefore = sourceCode.getTokenBefore(node, {includeComments: true});
			const tokenAfter = sourceCode.getTokenAfter(node, {includeComments: true});

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
			'Identifier': handleTypecast,
			'MemberExpression': handleTypecast
		};
	}
};
