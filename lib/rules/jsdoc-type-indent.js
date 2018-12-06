const {visitJSDocs} = require('../visitors');
const {
	traverseJSDocType,
	tokenizeJSDocTag,
	getJSDocTypeTokens,
	getJSDocTokensBetween,
	findFirstJSDocToken,
	findNonWhitespaceSiblingJSDocToken
} = require('../ast-utils');
const {fixTextBetweenJSDocTokens} = require('../utils');

const DEFAULT_INDENT_VALUE = 2;

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'enforce consistent indentation in JSDoc type'
		},

		fixable: 'whitespace',

		schema: [{
			oneOf: [{
				enum: ['tab']
			}, {
				type: 'integer',
				minimum: 0
			}]
		}]
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		const indentValue = context.options[0] || DEFAULT_INDENT_VALUE;
		const isIndentTab = indentValue === 'tab';

		/**
		 * @param {Array<JSDocTokenWithRange>} whitespaces
		 * @param {number} expectedIndent
		 * @return {boolean}
		 */
		function checkIndent(whitespaces, expectedIndent) {
			const expectedWhitespaceValue = isIndentTab ? '\t' : ' ';
			const expectedWhitespacesCount = isIndentTab ? expectedIndent : expectedIndent * indentValue;

			if (whitespaces.length !== expectedWhitespacesCount) {
				return false;
			}

			return whitespaces.every((whitespace) => whitespace.value === expectedWhitespaceValue);
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocTokenWithRange} lineBreak
		 * @param {JSDocTokenWithRange} token
		 * @param {Array<JSDocTokenWithRange>} whitespaces
		 * @param {number} expectedIndent
		 */
		function reportWrongIndent(JSDoc, lineBreak, token, whitespaces, expectedIndent) {
			const expectedWhitespaceValue = isIndentTab ? '\t' : ' ';
			const expectedWhitespacesCount = isIndentTab ? expectedIndent : expectedIndent * indentValue;
			const expectedWhitespacesDescription = isIndentTab ? 'tab(s)' : 'space(s)';

			const foundWhitespaceCounts = whitespaces.length;
			const foundWhitespacesDescription = !foundWhitespaceCounts ?
				expectedWhitespacesDescription : (
					whitespaces.every((whitespace) => whitespace.value === ' ') ? 'space(s)' :
						whitespaces.every((whitespace) => whitespace.value === '\t') ? 'tab(s)' :
							'space(s) and tab(s)'
				);

			context.report({
				node: JSDoc.source,
				message: (
					`Expected indentation of ${expectedWhitespacesCount} ${expectedWhitespacesDescription} ` +
					`before "${token.value}" but found ${foundWhitespaceCounts} ${foundWhitespacesDescription}.`
				),
				fix(fixer) {
					const fixedIndent = Array(expectedWhitespacesCount)
						.fill(expectedWhitespaceValue)
						.join('');

					return fixTextBetweenJSDocTokens(JSDoc, lineBreak, token, fixedIndent, fixer, sourceCode);
				}
			});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {string} value
		 * @return {?JSDocTokenWithRange}
		 */
		function findFirstIdentifier(tokens, value) {
			return findFirstJSDocToken(tokens, {type: 'Identifier', value});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocTokenWithRange} token
		 * @return {boolean}
		 */
		function isLineBreakBefore(tokens, token) {
			const siblingBefore = findNonWhitespaceSiblingJSDocToken(tokens, token, {moveForward: false});

			return siblingBefore && siblingBefore.type === 'LineBreak';
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 * @param {Array<Array<number>>} indentRanges
		 */
		function addTopBracesIndent(tokens, type, indentRanges) {
			const typeTokens = getJSDocTypeTokens(tokens, type);

			if (isLineBreakBefore(tokens, typeTokens[0])) {
				indentRanges.push([
					typeTokens[0].range[0],
					typeTokens[typeTokens.length - 1].range[1]
				]);
			}
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 * @param {Array<Array<number>>} indentRanges
		 */
		function addUnionIndent(tokens, type, indentRanges) {
			// Don't add indent when the union has no parens
			if (tokens[0].type !== 'Punctuator' || tokens[0].value !== '(') {
				return;
			}

			type.elements.forEach((element) => {
				const elementTokens = getJSDocTypeTokens(tokens, element);

				if (isLineBreakBefore(tokens, elementTokens[0])) {
					indentRanges.push([
						elementTokens[0].range[0],
						elementTokens[elementTokens.length - 1].range[1]
					]);
				}
			});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 * @param {Array<Array<number>>} indentRanges
		 */
		function addTypeApplicationIndent(tokens, type, indentRanges) {
			type.applications.forEach((application) => {
				const applicationTokens = getJSDocTypeTokens(tokens, application);

				if (isLineBreakBefore(tokens, applicationTokens[0])) {
					indentRanges.push([
						applicationTokens[0].range[0],
						applicationTokens[applicationTokens.length - 1].range[1]
					]);
				}
			});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 * @param {Array<Array<number>>} indentRanges
		 */
		function addRecordIndent(tokens, type, indentRanges) {
			type.fields.forEach((field) => {
				const fieldTokens = getJSDocTypeTokens(tokens, field);
				const valueTokens = getJSDocTypeTokens(tokens, field.value);

				if (isLineBreakBefore(tokens, fieldTokens[0])) {
					indentRanges.push([
						fieldTokens[0].range[0],
						fieldTokens[fieldTokens.length - 1].range[1]
					]);
				}

				if (isLineBreakBefore(tokens, valueTokens[0])) {
					indentRanges.push([
						valueTokens[0].range[0],
						valueTokens[valueTokens.length - 1].range[1]
					]);
				}
			});
		}

		/**
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {JSDocType} type
		 * @param {Array<Array<number>>} indentRanges
		 */
		function addFunctionIndent(tokens, type, indentRanges) {
			type.params.forEach((param) => {
				const paramTokens = getJSDocTypeTokens(tokens, param);

				if (param.type === 'ParameterType') {
					const expressionTokens = getJSDocTypeTokens(paramTokens, param.expression);

					if (isLineBreakBefore(tokens, expressionTokens[0])) {
						indentRanges.push([
							expressionTokens[0].range[0],
							expressionTokens[expressionTokens.length - 1].range[1]
						]);
					}
				}

				if (isLineBreakBefore(tokens, paramTokens[0])) {
					indentRanges.push([
						paramTokens[0].range[0],
						paramTokens[paramTokens.length - 1].range[1]
					]);
				}
			});

			if (type.this) {
				const thisTokens = getJSDocTypeTokens(tokens, type.this);
				const thisKey = findFirstIdentifier(tokens, 'this');

				if (isLineBreakBefore(tokens, thisKey)) {
					indentRanges.push([
						thisKey.range[0],
						thisTokens[thisTokens.length - 1].range[1]
					]);
				}

				if (isLineBreakBefore(tokens, thisTokens[0])) {
					indentRanges.push([
						thisTokens[0].range[0],
						thisTokens[thisTokens.length - 1].range[1]
					]);
				}
			}

			if (type.result) {
				const resultTokens = getJSDocTypeTokens(tokens, type.result);

				if (isLineBreakBefore(tokens, resultTokens[0])) {
					indentRanges.push([
						resultTokens[0].range[0],
						resultTokens[resultTokens.length - 1].range[1]
					]);
				}
			}
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {Array<JSDocTokenWithRange>} tokens
		 * @param {Array<Array<number>>} expectedIndentRanges
		 */
		function compareIndent(JSDoc, tokens, expectedIndentRanges) {
			let indent = 0;
			let lineBreak = null;

			tokens.forEach((token) => {
				const indentIncrement = expectedIndentRanges.filter((range) => range[0] === token.range[0]).length;
				const indentDecrement = expectedIndentRanges.filter((range) => range[1] === token.range[1]).length;

				indent = indent + indentIncrement;

				if (lineBreak && token.type !== 'Whitespace') {
					const whitespaces = getJSDocTokensBetween(tokens, lineBreak, token);

					if (!checkIndent(whitespaces, indent)) {
						reportWrongIndent(JSDoc, lineBreak, token, whitespaces, indent);
					}

					lineBreak = null;
				}

				if (token.type === 'LineBreak') {
					lineBreak = token;
				}

				indent = indent - indentDecrement;
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 */
		function check(JSDoc) {
			JSDoc.tags.forEach((tag) => {
				if (!tag.type) {
					return;
				}

				const indentRanges = [];
				const tagTokens = tokenizeJSDocTag(JSDoc, tag);

				addTopBracesIndent(tagTokens, tag.type, indentRanges);

				traverseJSDocType(tag.type, (type) => {
					const tokens = getJSDocTypeTokens(tagTokens, type);

					switch (type.type) {
						case 'UnionType':
							addUnionIndent(tokens, type, indentRanges);
							break;

						case 'TypeApplication':
							addTypeApplicationIndent(tokens, type, indentRanges);
							break;

						case 'RecordType':
							addRecordIndent(tokens, type, indentRanges);
							break;

						case 'FunctionType':
							addFunctionIndent(tokens, type, indentRanges);
							break;
					}
				});

				compareIndent(JSDoc, tagTokens, indentRanges);
			});
		}

		return visitJSDocs(check, sourceCode);
	}
};
