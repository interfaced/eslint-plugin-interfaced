const {visitJSDocs} = require('../visitors');
const {
	traverseJSDocType,
	tokenizeJSDocTag,
	getJSDocTypeTokens,
	getJSDocTokenBefore,
	getJSDocTokenAfter,
	findFirstJSDocToken,
	findLastJSDocToken,
	findNonWhitespaceSiblingJSDocToken
} = require('../ast-utils');
const {fixTextBetweenJSDocTokens} = require('../utils');

// Places where space may be
const BEFORE = Symbol('before');
const AFTER = Symbol('after');

const DEFAULT_OPTIONS = {
	topBraces: 'never',
	parens: 'never',
	unaryOperator: 'never',

	unionPipe: {
		before: 'never',
		after: 'never'
	},

	typeApplicationBrackets: 'never',
	typeApplicationComma: {
		before: 'never',
		after: 'never'
	},

	recordBraces: 'never',
	recordFieldComma: {
		before: 'never',
		after: 'never'
	},
	recordFieldColon: {
		before: 'never',
		after: 'never'
	},

	functionKeyword: 'never',
	functionParens: 'never',
	functionParamComma: {
		before: 'never',
		after: 'never'
	},
	functionParamColon: {
		before: 'never',
		after: 'never'
	},
	functionResultColon: {
		before: 'never',
		after: 'never'
	}
};

const optionsSchema = {};
Object.keys(DEFAULT_OPTIONS)
	.forEach((key) => {
		const value = DEFAULT_OPTIONS[key];

		if (typeof value === 'string') {
			optionsSchema[key] = {
				enum: ['always', 'never']
			};
		} else {
			optionsSchema[key] = {
				type: 'object',
				properties: {
					before: {
						enum: ['always', 'never']
					},
					after: {
						enum: ['always', 'never']
					}
				}
			};
		}
	});

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'enforce consistent spacing in JSDoc type'
		},

		fixable: 'whitespace',

		schema: [{
			type: 'object',
			properties: optionsSchema,
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		/**
		 * @param {Array<JSDocTokenWithRange>} typeTokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} option
		 * @param {symbol} place
		 * @return {boolean}
		 */
		function checkSpacing(typeTokens, token, option, place) {
			const siblingNonWhitespaceToken = findNonWhitespaceSiblingJSDocToken(typeTokens, token, {
				moveForward: place === AFTER
			});

			// Skip when the token is last or a line break follows him
			if (!siblingNonWhitespaceToken || siblingNonWhitespaceToken.type === 'LineBreak') {
				return true;
			}

			const nextToken = place === AFTER ?
				getJSDocTokenAfter(typeTokens, token) :
				getJSDocTokenBefore(typeTokens, token);

			return (
				option === 'always' && nextToken.type === 'Whitespace' ||
				option === 'never' && nextToken.type !== 'Whitespace'
			);
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {string} typeName
		 * @param {Array<JSDocTokenWithRange>} typeTokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} option
		 * @param {symbol} place
		 */
		function reportWrongSpacing(JSDoc, typeName, typeTokens, token, option, place) {
			const shouldHaveSpace = option === 'always';

			const fixSpacing = shouldHaveSpace ? ' ' : '';
			const fixBetween = place === BEFORE ?
				[findPreviousNonWhitespaceSiblingToken(typeTokens, token), token] :
				[token, findNextNonWhitespaceSiblingToken(typeTokens, token)];

			context.report({
				node: JSDoc.source,
				message: (
					`${typeName.charAt(0).toUpperCase() + typeName.slice(1)} should` +
					`${shouldHaveSpace ? ' have' : 'n\'t have'} space ` +
					`${place === BEFORE ? 'before' : 'after'} "${token.value}".`
				),
				fix(fixer) {
					return fixTextBetweenJSDocTokens(JSDoc, ...fixBetween, fixSpacing, fixer, sourceCode);
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {string} typeName
		 * @param {Array<JSDocTokenWithRange>} typeTokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} option
		 * @param {symbol} place
		 */
		function reportSpacingIfWrong(JSDoc, typeName, typeTokens, token, option, place) {
			if (!checkSpacing(typeTokens, token, option, place)) {
				reportWrongSpacing(JSDoc, typeName, typeTokens, token, option, place);
			}
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findFirstKeyword(tokens, value) {
			return findFirstJSDocToken(tokens, {type: 'Keyword', value});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findFirstPunctuator(tokens, value) {
			return findFirstJSDocToken(tokens, {type: 'Punctuator', value});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findLastPunctuator(tokens, value) {
			return findLastJSDocToken(tokens, {type: 'Punctuator', value});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {{
		 *     type: (string|undefined),
		 *     value: (string|undefined)
		 * }=} options
		 * @return {?JSDocTokenWithRange}
		 */
		function findNextNonWhitespaceSiblingToken(tokens, token, {type, value} = {}) {
			return findNonWhitespaceSiblingJSDocToken(tokens, token, {type, value, moveForward: true});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {{
		 *     type: (string|undefined),
		 *     value: (string|undefined)
		 * }=} options
		 * @return {?JSDocTokenWithRange}
		 */
		function findPreviousNonWhitespaceSiblingToken(tokens, token, {type, value} = {}) {
			return findNonWhitespaceSiblingJSDocToken(tokens, token, {type, value, moveForward: false});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findNextSiblingPunctuator(tokens, token, value) {
			return findNextNonWhitespaceSiblingToken(tokens, token, {type: 'Punctuator', value});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findPreviousSiblingPunctuator(tokens, token, value) {
			return findPreviousNonWhitespaceSiblingToken(tokens, token, {type: 'Punctuator', value});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 */
		function checkTopBraces(JSDoc, tokens) {
			const reportIfWrong = reportSpacingIfWrong.bind(null, JSDoc, 'top type', tokens);

			const openBrace = findFirstPunctuator(tokens, '{');
			const closeBrace = findLastPunctuator(tokens, '}');

			reportIfWrong(openBrace, options.topBraces, AFTER);
			reportIfWrong(closeBrace, options.topBraces, BEFORE);
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 */
		function checkParens(JSDoc, tokens) {
			const reportIfWrong = reportSpacingIfWrong.bind(null, JSDoc, 'type', tokens);

			const firstToken = tokens[0];
			const lastToken = tokens[tokens.length - 1];

			if (firstToken.type === 'Punctuator' && firstToken.value === '(') {
				reportIfWrong(firstToken, options.parens, AFTER);

				if (lastToken.type === 'Punctuator' && lastToken.value === ')') {
					reportIfWrong(lastToken, options.parens, BEFORE);
				}
			}
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkUnaryOperator(JSDoc, tokens, type) {
			let operatorName;
			let operatorToken;
			let shouldValidateAfter = true;

			switch (type.type) {
				case 'NullableType':
					operatorName = 'nullable type';
					operatorToken = findFirstPunctuator(tokens, '?');
					break;

				case 'NonNullableType':
					operatorName = 'non nullable type';
					operatorToken = findFirstPunctuator(tokens, '!');
					break;

				case 'OptionalType':
					operatorName = 'optional type';
					operatorToken = findLastPunctuator(tokens, '=');
					shouldValidateAfter = false;
					break;

				case 'RestType':
					operatorName = 'rest type';
					operatorToken = findFirstPunctuator(tokens, '...');
					break;
			}

			reportSpacingIfWrong(
				JSDoc,
				operatorName,
				tokens,
				operatorToken,
				options.unaryOperator,
				shouldValidateAfter ? AFTER : BEFORE
			);
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkUnion(JSDoc, tokens, type) {
			const reportIfWrong = reportSpacingIfWrong.bind(null, JSDoc, 'union', tokens);

			type.elements.forEach((element) => {
				const elementTokens = getJSDocTypeTokens(tokens, element);

				const pipe = findNextSiblingPunctuator(tokens, elementTokens[elementTokens.length - 1], '|');
				if (!pipe) {
					return;
				}

				reportIfWrong(pipe, options.unionPipe.before, BEFORE);
				reportIfWrong(pipe, options.unionPipe.after, AFTER);
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkTypeApplication(JSDoc, tokens, type) {
			const reportIfWrong = reportSpacingIfWrong.bind(null, JSDoc, 'type application', tokens);

			const openBracket = findFirstPunctuator(tokens, '<');
			const closeBracket = findLastPunctuator(tokens, '>');

			reportIfWrong(openBracket, options.typeApplicationBrackets, AFTER);
			reportIfWrong(closeBracket, options.typeApplicationBrackets, BEFORE);

			type.applications.forEach((application) => {
				const applicationTokens = getJSDocTypeTokens(tokens, application);

				const comma = findNextSiblingPunctuator(tokens, applicationTokens[applicationTokens.length - 1], ',');
				if (!comma) {
					return;
				}

				reportIfWrong(comma, options.typeApplicationComma.before, BEFORE);
				reportIfWrong(comma, options.typeApplicationComma.after, AFTER);
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkRecord(JSDoc, tokens, type) {
			const reportIfWrong = reportSpacingIfWrong.bind(null, JSDoc, 'record', tokens);

			const openBrace = findFirstPunctuator(tokens, '{');
			const closeBrace = findLastPunctuator(tokens, '}');

			reportIfWrong(openBrace, options.recordBraces, AFTER);
			reportIfWrong(closeBrace, options.recordBraces, BEFORE);

			type.fields.forEach((field) => {
				const fieldTokens = getJSDocTypeTokens(tokens, field);
				const colon = findFirstPunctuator(fieldTokens, ':');

				reportIfWrong(colon, options.recordFieldColon.before, BEFORE);
				reportIfWrong(colon, options.recordFieldColon.after, AFTER);

				const comma = findNextSiblingPunctuator(tokens, fieldTokens[fieldTokens.length - 1], ',');
				if (!comma) {
					return;
				}

				reportIfWrong(comma, options.recordFieldComma.before, BEFORE);
				reportIfWrong(comma, options.recordFieldComma.after, AFTER);
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkFunction(JSDoc, tokens, type) {
			const reportIfWrong = reportSpacingIfWrong.bind(null, JSDoc, 'function', tokens);

			const thisTokens = type.this && getJSDocTypeTokens(tokens, type.this);
			const resultTokens = type.result && getJSDocTypeTokens(tokens, type.result);

			const keyword = findFirstKeyword(tokens, 'function');
			const openParen = findFirstPunctuator(tokens, '(');
			const closeParen = findLastPunctuator(
				resultTokens ?
					tokens.filter(((token) => token.range[1] < resultTokens[0].range[0])) :
					tokens,
				')'
			);

			reportIfWrong(keyword, options.functionKeyword, AFTER);
			reportIfWrong(openParen, options.functionParens, AFTER);
			reportIfWrong(closeParen, options.functionParens, BEFORE);

			type.params.forEach((param) => {
				const paramTokens = getJSDocTypeTokens(tokens, param);

				if (param.type === 'ParameterType') {
					const colon = findFirstPunctuator(paramTokens, ':');

					reportIfWrong(colon, options.functionParamColon.before, BEFORE);
					reportIfWrong(colon, options.functionParamColon.after, AFTER);
				}

				const comma = findNextSiblingPunctuator(tokens, paramTokens[paramTokens.length - 1], ',');
				if (!comma) {
					return;
				}

				reportIfWrong(comma, options.functionParamComma.before, BEFORE);
				reportIfWrong(comma, options.functionParamComma.after, AFTER);
			});

			if (thisTokens) {
				const colon = findPreviousSiblingPunctuator(tokens, thisTokens[0], ':');

				reportIfWrong(colon, options.functionParamColon.before, BEFORE);
				reportIfWrong(colon, options.functionParamColon.after, AFTER);

				const comma = findNextSiblingPunctuator(tokens, thisTokens[thisTokens.length - 1], ',');
				if (!comma) {
					return;
				}

				reportIfWrong(comma, options.functionParamComma.before, BEFORE);
				reportIfWrong(comma, options.functionParamComma.after, AFTER);
			}

			if (resultTokens) {
				const colon = findPreviousSiblingPunctuator(tokens, resultTokens[0], ':');

				reportIfWrong(colon, options.functionResultColon.before, BEFORE);
				reportIfWrong(colon, options.functionResultColon.after, AFTER);
			}
		}

		/**
		 * @param {JSDoc} JSDoc
		 */
		function check(JSDoc) {
			JSDoc.tags.forEach((tag) => {
				if (!tag.type) {
					return;
				}

				const tagTokens = tokenizeJSDocTag(JSDoc, tag);

				checkTopBraces(JSDoc, tagTokens);

				traverseJSDocType(tag.type, (type) => {
					const tokens = getJSDocTypeTokens(tagTokens, type);

					checkParens(JSDoc, tokens);

					switch (type.type) {
						case 'NullableType':
						case 'NonNullableType':
						case 'OptionalType':
						case 'RestType':
							checkUnaryOperator(JSDoc, tokens, type);
							break;

						case 'UnionType':
							checkUnion(JSDoc, tokens, type);
							break;

						case 'TypeApplication':
							checkTypeApplication(JSDoc, tokens, type);
							break;

						case 'RecordType':
							checkRecord(JSDoc, tokens, type);
							break;

						case 'FunctionType':
							checkFunction(JSDoc, tokens, type);
							break;
					}
				});
			});
		}

		return visitJSDocs(check, sourceCode);
	}
};
