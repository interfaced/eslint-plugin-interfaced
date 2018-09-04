const {visitJSDocs} = require('../visitors');
const {
	traverseJSDocType,
	getJSDocTagTokens,
	getJSDocTypeTokens,
	getJSDocSubtypeTokens,
	getJSDocTokenBefore,
	getJSDocTokenAfter,
	findFirstNonWhitespaceSiblingToken
} = require('../ast-utils');
const {fixTextBetweenJSDocTokens} = require('../utils');

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
		docs: {
			description: 'enforce consistent spacing in JSDoc type'
		},
		schema: [{
			type: 'object',
			properties: optionsSchema,
			additionalProperties: false
		}],
		fixable: 'whitespace'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocTokenWithRange} tokenA
		 * @param {JSDocTokenWithRange} tokenB
		 * @param {number} whitespacesAmount
		 * @param {SourceCodeFixer} fixer
		 * @return {Object}
		 */
		function fixWhitespacesBetweenJSDocTokens(JSDoc, tokenA, tokenB, whitespacesAmount, fixer) {
			const whitespaces = new Array(whitespacesAmount)
				.fill(' ')
				.join('');

			return fixTextBetweenJSDocTokens(JSDoc, tokenA, tokenB, whitespaces, fixer, sourceCode);
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {string} typeName
		 * @param {Array<JSDocTokenWithRange>} typeTokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} option
		 * @param {string} place
		 */
		function reportWrongSpacing(JSDoc, typeName, typeTokens, token, option, place) {
			const shouldHaveSpace = option === 'always';

			const report = {
				node: JSDoc.source,
				message: (
					`${typeName.charAt(0).toUpperCase() + typeName.slice(1)} should ` +
					`${shouldHaveSpace ? 'have' : 'not have'} space ${place} "${token.value}".`
				)
			};

			const fixBetween = place === 'before' ?
				[findPreviousNonWhitespaceSiblingToken(typeTokens, token), token] :
				[token, findNextNonWhitespaceSiblingToken(typeTokens, token)];

			/**
			 * @param {SourceCodeFixer} fixer
			 * @return {Object}
			 */
			report.fix = (fixer) => fixWhitespacesBetweenJSDocTokens(
				JSDoc,
				...fixBetween,
				shouldHaveSpace ? 1 : 0,
				fixer
			);

			context.report(report);
		}

		/**
		 * @param {JSDocTokenWithRange} token
		 * @param {string} option
		 * @return {boolean}
		 */
		function validateToken(token, option) {
			if (token.type === 'LineBreak') {
				return true;
			}

			return (
				option === 'always' && token.type === 'Whitespace' ||
				option === 'never' && token.type !== 'Whitespace'
			);
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} keywordValue
		 * @return {?JSDocTokenWithRange}
		 */
		function findFirstKeyword(tokens, keywordValue) {
			return tokens.find((token) =>
				token.type === 'Keyword' &&
				token.value === keywordValue
			) || null;
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findFirstPunctuator(tokens, value) {
			return tokens.find((token) =>
				token.type === 'Punctuator' &&
				token.value === value
			) || null;
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findLastPunctuator(tokens, value) {
			return findFirstPunctuator(tokens.slice().reverse(), value);
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {{
		 *     requiredType: (string|undefined),
		 *     requiredValue: (string|undefined)
		 * }=} options
		 * @return {?JSDocTokenWithRange}
		 */
		function findNextNonWhitespaceSiblingToken(tokens, token, {requiredType, requiredValue} = {}) {
			return findFirstNonWhitespaceSiblingToken(tokens, token, {requiredType, requiredValue});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {{
		 *     requiredType: (string|undefined),
		 *     requiredValue: (string|undefined)
		 * }=} options
		 * @return {?JSDocTokenWithRange}
		 */
		function findPreviousNonWhitespaceSiblingToken(tokens, token, {requiredType, requiredValue} = {}) {
			return findFirstNonWhitespaceSiblingToken(tokens, token, {
				requiredType,
				requiredValue,
				moveForward: false
			});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findNextSiblingPunctuator(tokens, token, value) {
			return findNextNonWhitespaceSiblingToken(tokens, token, {
				requiredType: 'Punctuator',
				requiredValue: value
			});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findPreviousSiblingPunctuator(tokens, token, value) {
			return findPreviousNonWhitespaceSiblingToken(tokens, token, {
				requiredType: 'Punctuator',
				requiredValue: value
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 */
		function checkTopBraces(JSDoc, tokens) {
			const report = reportWrongSpacing.bind(null, JSDoc, 'top type', tokens);

			const openBrace = findFirstPunctuator(tokens, '{');
			const closeBrace = findLastPunctuator(tokens, '}');

			if (!validateToken(getJSDocTokenAfter(tokens, openBrace), options.topBraces)) {
				report(openBrace, options.topBraces, 'after');
			}

			if (!validateToken(getJSDocTokenBefore(tokens, closeBrace), options.topBraces)) {
				report(closeBrace, options.topBraces, 'before');
			}
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 */
		function checkParens(JSDoc, tokens) {
			const report = reportWrongSpacing.bind(null, JSDoc, 'type', tokens);

			const firstToken = tokens[0];

			let lastToken = tokens[tokens.length - 1];
			if (lastToken.type === 'EOF') {
				lastToken = tokens[tokens.length - 2];
			}

			if (firstToken.type === 'Punctuator' && firstToken.value === '(') {
				if (!validateToken(getJSDocTokenAfter(tokens, firstToken), options.parens)) {
					report(firstToken, options.parens, 'after');
				}

				if (lastToken.type === 'Punctuator' && lastToken.value === ')') {
					if (!validateToken(getJSDocTokenBefore(tokens, lastToken), options.parens)) {
						report(lastToken, options.parens, 'before');
					}
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

			const report = reportWrongSpacing.bind(null, JSDoc, operatorName, tokens);

			const tokenToValidate = shouldValidateAfter ?
				getJSDocTokenAfter(tokens, operatorToken) :
				getJSDocTokenBefore(tokens, operatorToken);

			if (!validateToken(tokenToValidate, options.unaryOperator)) {
				report(operatorToken, options.unaryOperator, shouldValidateAfter ? 'after' : 'before');
			}
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkUnion(JSDoc, tokens, type) {
			const report = reportWrongSpacing.bind(null, JSDoc, 'union', tokens);

			type.elements.forEach((element) => {
				const elementTokens = getJSDocSubtypeTokens(tokens, element);

				const pipe = findNextSiblingPunctuator(tokens, elementTokens.pop(), '|');
				if (!pipe) {
					return;
				}

				if (!validateToken(getJSDocTokenBefore(tokens, pipe), options.unionPipe.before)) {
					report(pipe, options.unionPipe.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, pipe), options.unionPipe.after)) {
					report(pipe, options.unionPipe.after, 'after');
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkTypeApplication(JSDoc, tokens, type) {
			const report = reportWrongSpacing.bind(null, JSDoc, 'type application', tokens);

			const openBracket = findFirstPunctuator(tokens, '<');
			const closeBracket = findLastPunctuator(tokens, '>');

			if (!validateToken(getJSDocTokenAfter(tokens, openBracket), options.typeApplicationBrackets)) {
				report(openBracket, options.typeApplicationBrackets, 'after');
			}

			if (!validateToken(getJSDocTokenBefore(tokens, closeBracket), options.typeApplicationBrackets)) {
				report(closeBracket, options.typeApplicationBrackets, 'before');
			}

			type.applications.forEach((application) => {
				const applicationTokens = getJSDocSubtypeTokens(tokens, application);

				const comma = findNextSiblingPunctuator(tokens, applicationTokens.pop(), ',');
				if (!comma) {
					return;
				}

				if (!validateToken(getJSDocTokenBefore(tokens, comma), options.typeApplicationComma.before)) {
					report(comma, options.typeApplicationComma.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, comma), options.typeApplicationComma.after)) {
					report(comma, options.typeApplicationComma.after, 'after');
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkRecord(JSDoc, tokens, type) {
			const report = reportWrongSpacing.bind(null, JSDoc, 'record', tokens);

			const openBrace = findFirstPunctuator(tokens, '{');
			const closeBrace = findLastPunctuator(tokens, '}');

			if (!validateToken(getJSDocTokenAfter(tokens, openBrace), options.recordBraces)) {
				report(openBrace, options.recordBraces, 'after');
			}

			if (!validateToken(getJSDocTokenBefore(tokens, closeBrace), options.recordBraces)) {
				report(closeBrace, options.recordBraces, 'before');
			}

			type.fields.forEach((field) => {
				const fieldTokens = getJSDocSubtypeTokens(tokens, field);
				const colon = findFirstPunctuator(fieldTokens, ':');

				if (!validateToken(getJSDocTokenBefore(tokens, colon), options.recordFieldColon.before)) {
					report(colon, options.recordFieldColon.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, colon), options.recordFieldColon.after)) {
					report(colon, options.recordFieldColon.after, 'after');
				}

				const comma = findNextSiblingPunctuator(tokens, fieldTokens.pop(), ',');
				if (!comma) {
					return;
				}

				if (!validateToken(getJSDocTokenBefore(tokens, comma), options.recordFieldComma.before)) {
					report(comma, options.recordFieldComma.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, comma), options.recordFieldComma.after)) {
					report(comma, options.recordFieldComma.after, 'after');
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 */
		function checkFunction(JSDoc, tokens, type) {
			const report = reportWrongSpacing.bind(null, JSDoc, 'function', tokens);

			const thisTokens = type.this && getJSDocSubtypeTokens(tokens, type.this);
			const resultTokens = type.result && getJSDocSubtypeTokens(tokens, type.result);

			const keyword = findFirstKeyword(tokens, 'function');
			const openParen = findFirstPunctuator(tokens, '(');
			const closeParen = findLastPunctuator(
				resultTokens ?
					tokens.filter(((token) => token.range[1] < resultTokens[0].range[0])) :
					tokens,
				')'
			);

			if (!validateToken(getJSDocTokenAfter(tokens, keyword), options.functionKeyword)) {
				report(keyword, options.functionKeyword, 'after');
			}

			if (!validateToken(getJSDocTokenAfter(tokens, openParen), options.functionParens)) {
				report(openParen, options.functionParens, 'after');
			}

			if (!validateToken(getJSDocTokenBefore(tokens, closeParen), options.functionParens)) {
				report(closeParen, options.functionParens, 'before');
			}

			type.params.forEach((param) => {
				const paramTokens = getJSDocSubtypeTokens(tokens, param);

				if (param.type === 'ParameterType') {
					const colon = findFirstPunctuator(paramTokens, ':');

					if (!validateToken(getJSDocTokenBefore(tokens, colon), options.functionParamColon.before)) {
						report(colon, options.functionParamColon.before, 'before');
					}

					if (!validateToken(getJSDocTokenAfter(tokens, colon), options.functionParamColon.after)) {
						report(colon, options.functionParamColon.after, 'after');
					}
				}

				const comma = findNextSiblingPunctuator(tokens, paramTokens.pop(), ',');
				if (!comma) {
					return;
				}

				if (!validateToken(getJSDocTokenBefore(tokens, comma), options.functionParamComma.before)) {
					report(comma, options.functionParamComma.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, comma), options.functionParamComma.after)) {
					report(comma, options.functionParamComma.after, 'after');
				}
			});

			if (thisTokens) {
				const colon = findPreviousSiblingPunctuator(tokens, thisTokens[0], ':');

				if (!validateToken(getJSDocTokenBefore(tokens, colon), options.functionParamColon.before)) {
					report(colon, options.functionParamColon.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, colon), options.functionParamColon.after)) {
					report(colon, options.functionParamColon.after, 'after');
				}

				const comma = findNextSiblingPunctuator(tokens, thisTokens.pop(), ',');
				if (!comma) {
					return;
				}

				if (!validateToken(getJSDocTokenBefore(tokens, comma), options.functionParamComma.before)) {
					report(comma, options.functionParamComma.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, comma), options.functionParamComma.after)) {
					report(comma, options.functionParamComma.after, 'after');
				}
			}

			if (resultTokens) {
				const colon = findPreviousSiblingPunctuator(tokens, resultTokens[0], ':');

				if (!validateToken(getJSDocTokenBefore(tokens, colon), options.functionResultColon.before)) {
					report(colon, options.functionResultColon.before, 'before');
				}

				if (!validateToken(getJSDocTokenAfter(tokens, colon), options.functionResultColon.after)) {
					report(colon, options.functionResultColon.after, 'after');
				}
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

				const tagType = tag.type;
				const tagTokens = getJSDocTagTokens(JSDoc, tag);
				const tagTypeTokens = getJSDocTypeTokens(JSDoc, tagType);

				checkTopBraces(JSDoc, tagTokens);

				traverseJSDocType(tag.type, (type) => {
					const tokens = getJSDocSubtypeTokens(tagTypeTokens, type);

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
