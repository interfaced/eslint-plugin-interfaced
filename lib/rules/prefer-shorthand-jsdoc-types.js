const {visitJSDocs} = require('../visitors');
const {
	traverseJSDocType,
	getJSDocTypeContent,
	getJSDocTypeTokens,
	getJSDocSubtypeTokens,
	findFirstNonWhitespaceSiblingToken
} = require('../ast-utils');
const {insertIntoText, fixTextInJSDocInterval} = require('../utils');

const DEFAULT_OPTIONS = {
	optionalParam: 'always',
	nullableType: 'always'
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce usage of a shorthand notation for some JSDoc types when possible'
		},
		schema: [{
			type: 'object',
			properties: {
				optionalParam: {
					enum: ['always', 'never']
				},
				nullableType: {
					enum: ['always', 'never']
				}
			}
		}],
		fixable: 'code'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocType} union
		 * @param {string} requiredType
		 * @return {Array<number>}
		 */
		function findUnionElementRange(JSDoc, union, requiredType) {
			const tokens = getJSDocTypeTokens(JSDoc, union);

			const elementIndex = union.elements.findIndex((element) => element.type === requiredType);
			const element = union.elements[elementIndex];
			const elementTokens = getJSDocSubtypeTokens(tokens, element);

			const pipe = findFirstNonWhitespaceSiblingToken(tokens, elementTokens[0], {
				requiredType: 'Punctuator',
				requiredValue: '|',
				moveForward: elementIndex === 0
			});

			return elementIndex === 0 ?
				[element.range[0], pipe.range[1]] :
				[pipe.range[0], element.range[1]];
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocTag} tag
		 * @param {JSDocType} type
		 */
		function reportNullableOperator(JSDoc, tag, type) {
			context.report({
				node: JSDoc.source,
				message: `Use "|null" instead of "?" to describe nullable in @${tag.title}.`,
				fix(fixer) {
					const typeContent = getJSDocTypeContent(JSDoc, type);
					const typeTokens = getJSDocTypeTokens(JSDoc, type);

					let question = typeTokens[0];
					if (question.type !== 'Punctuator') {
						question = findFirstNonWhitespaceSiblingToken(typeTokens, typeTokens[0], {
							requiredType: 'Punctuator',
							requiredValue: '?'
						});
					}

					let fixed = insertIntoText(
						typeContent,
						'',
						...question.range.map((index) => index - type.range[0])
					);
					fixed = `${fixed}|null`;

					return fixTextInJSDocInterval(
						JSDoc,
						type.range[0],
						type.range[1],
						fixed,
						fixer,
						sourceCode
					);
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocTag} tag
		 * @param {JSDocType} type
		 */
		function reportNullableUnion(JSDoc, tag, type) {
			context.report({
				node: JSDoc.source,
				message: `Use "?" instead of "|null" to describe nullable in @${tag.title}.`,
				fix(fixer) {
					const unionRange = type.range;
					const unionContent = getJSDocTypeContent(JSDoc, type);

					const nullRange = findUnionElementRange(JSDoc, type, 'NullLiteral');

					let fixed = insertIntoText(
						unionContent,
						'',
						...nullRange.map((index) => index - unionRange[0])
					);
					fixed = `?${fixed}`;

					return fixTextInJSDocInterval(
						JSDoc,
						unionRange[0],
						unionRange[1],
						fixed,
						fixer,
						sourceCode
					);
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocTag} tag
		 * @param {JSDocType} type
		 */
		function reportOptionalOperator(JSDoc, tag, type) {
			context.report({
				node: JSDoc.source,
				message: `Use "|undefined" instead of "=" to describe optional param ${tag.name}.`,
				fix(fixer) {
					const typeContent = getJSDocTypeContent(JSDoc, type);
					const typeTokens = getJSDocTypeTokens(JSDoc, type);

					const equal = findFirstNonWhitespaceSiblingToken(typeTokens, typeTokens.pop(), {
						requiredType: 'Punctuator',
						requiredValue: '=',
						moveForward: false
					});

					const fixed = insertIntoText(
						typeContent,
						'|undefined',
						...equal.range.map((index) => index - type.range[0])
					);

					return fixTextInJSDocInterval(
						JSDoc,
						type.range[0],
						type.range[1],
						fixed,
						fixer,
						sourceCode
					);
				}
			});
		}

		/**
		 * @param {JSDoc} JSDoc
		 * @param {JSDocTag} tag
		 * @param {JSDocType} type
		 */
		function reportOptionalUnion(JSDoc, tag, type) {
			context.report({
				node: JSDoc.source,
				message: `Use "=" instead of "|undefined" to describe optional param ${tag.name}.`,
				fix(fixer) {
					const unionRange = type.range;
					const unionContent = getJSDocTypeContent(JSDoc, type);

					const undefinedIndex = type.elements.findIndex((element) => element.type === 'UndefinedLiteral');
					const undefinedRange = findUnionElementRange(JSDoc, type, 'UndefinedLiteral');

					let fixed;
					if (undefinedIndex === 0) {
						fixed = insertIntoText(
							unionContent,
							'',
							...undefinedRange.map((index) => index - unionRange[0])
						);

						fixed = `${fixed}=`;
					} else {
						fixed = insertIntoText(
							unionContent,
							'=',
							...undefinedRange.map((index) => index - unionRange[0])
						);
					}

					return fixTextInJSDocInterval(
						JSDoc,
						unionRange[0],
						unionRange[1],
						fixed,
						fixer,
						sourceCode
					);
				}
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

				const isOptionalParamTag = (
					tag.title === 'param' &&
					tag.type.type === 'OptionalType'
				);

				if (isOptionalParamTag && options.optionalParam === 'never') {
					reportOptionalOperator(JSDoc, tag, tag.type);
				}

				traverseJSDocType(tag.type, (type) => {
					const isNullable = type.type === 'NullableType';
					const isDualUnionWithNullLiteral = (
						type.type === 'UnionType' &&
						type.elements.length === 2 &&
						type.elements.some((element) => element.type === 'NullLiteral')
					);

					if (isNullable && options.nullableType === 'never') {
						reportNullableOperator(JSDoc, tag, type);
					}

					if (isDualUnionWithNullLiteral && options.nullableType === 'always') {
						reportNullableUnion(JSDoc, tag, type);
					}
				});
			});

			if (options.optionalParam === 'always') {
				const reversedParams = JSDoc.tags.reverse()
					.filter((tag) => tag.title === 'param');

				const firstNonOptionalParamIndex = reversedParams.findIndex((tag) =>
					!tag.type || (
						tag.type.type !== 'OptionalType' && !(
							tag.type.type === 'UnionType' &&
							tag.type.elements.some((element) => element.type === 'UndefinedLiteral')
						)
					)
				);

				const lastOptionalParams = firstNonOptionalParamIndex === -1 ?
					reversedParams :
					reversedParams.slice(0, firstNonOptionalParamIndex);

				lastOptionalParams.forEach((param) => {
					if (param.type.type === 'UnionType') {
						reportOptionalUnion(JSDoc, param, param.type);
					}
				});
			}
		}

		return visitJSDocs(check, sourceCode);
	}
};
