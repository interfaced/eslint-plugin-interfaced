const {visitJSDocs} = require('../visitors');
const {
	tokenizeJSDocTag,
	getJSDocTokensBetween,
	findFirstJSDocToken,
	findNonWhitespaceSiblingJSDocToken
} = require('../ast-utils');
const {fixTextBetweenJSDocTokens} = require('../utils');

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'disallow multiple spaces in JSDoc type'
		},

		fixable: 'code'
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		/**
		 * @param {JSDoc} JSDoc
		 */
		function check(JSDoc) {
			JSDoc.tags.forEach((tag) => {
				if (!tag.type) {
					return;
				}

				const tagTokens = tokenizeJSDocTag(JSDoc, tag);

				// Discard the tag and the spaces after it
				const tokens = tagTokens.slice(tagTokens.indexOf(
					findFirstJSDocToken(tagTokens, {type: 'Punctuator', value: '{'})
				));

				while (tokens[0].type !== 'EOF') {
					const currentToken = tokens[0];
					const siblingNonWhitespaceToken = findNonWhitespaceSiblingJSDocToken(tokens, currentToken);
					const whitespacesBetween = getJSDocTokensBetween(tokens, currentToken, siblingNonWhitespaceToken);

					// Skip trailing and indent spaces
					if (currentToken.type !== 'LineBreak' && siblingNonWhitespaceToken.type !== 'LineBreak') {
						if (whitespacesBetween.length > 1) {
							context.report({
								node: JSDoc.source,
								message: (
									`Unexpected multiple spaces (${whitespacesBetween.length}) ` +
									`before "${siblingNonWhitespaceToken.value}".`
								),
								fix(fixer) {
									return fixTextBetweenJSDocTokens(
										JSDoc,
										currentToken,
										siblingNonWhitespaceToken,
										' ',
										fixer,
										sourceCode
									);
								}
							});
						}
					}

					tokens.splice(tokens.indexOf(currentToken), tokens.indexOf(siblingNonWhitespaceToken));
				}
			});
		}

		return visitJSDocs(check, sourceCode);
	}
};
