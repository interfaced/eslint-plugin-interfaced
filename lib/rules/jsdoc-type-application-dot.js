const {visitJSDocs} = require('../visitors');
const {traverseJSDocType, tokenizeJSDocType, getJSDocTokenBefore} = require('../ast-utils');
const {fixTextBetweenJSDocTokens} = require('../utils');

const DEFAULT_OPTION = 'always';

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce dot before "<" symbol in JSDoc type application'
		},

		fixable: 'code',

		schema: [{
			enum: ['always', 'never']
		}]
	},
	create: (context) => {
		const option = context.options[0] || DEFAULT_OPTION;
		const sourceCode = context.getSourceCode();

		/**
		 * @param {JSDoc} JSDoc
		 */
		function check(JSDoc) {
			JSDoc.tags.forEach((tag) => {
				if (!tag.type) {
					return;
				}

				traverseJSDocType(tag.type, (type) => {
					if (type.type !== 'TypeApplication') {
						return;
					}

					const tokens = tokenizeJSDocType(JSDoc, type);
					const openBracket = tokens.find((token) => token.type === 'Punctuator' && token.value === '<');
					const tokenBeforeOpenBracket = getJSDocTokenBefore(tokens, openBracket);

					const hasDotBeforeOpenBracket = (
						tokenBeforeOpenBracket.type === 'Punctuator' &&
						tokenBeforeOpenBracket.value === '.'
					);

					if (option === 'always' && !hasDotBeforeOpenBracket) {
						context.report({
							node: JSDoc.source,
							message: 'Type application should have dot before "<"".',
							fix(fixer) {
								return fixTextBetweenJSDocTokens(
									JSDoc,
									getJSDocTokenBefore(tokens, openBracket),
									openBracket,
									'.',
									fixer,
									sourceCode
								);
							}
						});
					}

					if (option === 'never' && hasDotBeforeOpenBracket) {
						context.report({
							node: JSDoc.source,
							message: 'Type application shouldn\'t have dot before "<"".',
							fix(fixer) {
								return fixTextBetweenJSDocTokens(
									JSDoc,
									getJSDocTokenBefore(tokens, tokenBeforeOpenBracket),
									openBracket,
									'',
									fixer,
									sourceCode
								);
							}
						});
					}
				});
			});
		}

		return visitJSDocs(check, sourceCode);
	}
};
