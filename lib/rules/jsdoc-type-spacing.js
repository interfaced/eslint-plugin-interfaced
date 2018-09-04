const {iterateOverJSDocs} = require('../iterators');
const {traverseJSDocType} = require('../jsdoc');

const DEFAULT_OPTIONS = {
	typeApplications: 'always',
	functionParams: 'always',
	functionResult: 'always',
	recordFields: 'always',
	unionElements: 'always'
};

const SPACE_AFTER_COMMA = /, /;
const NO_SPACE_AFTER_COMMA = /,[^\s]/;

const SPACE_AROUND_PIPE = / \| /;
const NO_SPACE_AROUND_PIPE = /[^\s]\|[^\s]/;

const SPACE_AFTER_COLON = /: /;
const NO_SPACE_AFTER_COLON = /:[^\s]/;

module.exports = {
	meta: {
		docs: {
			description: 'enforce consistent spacing in JSDoc type'
		},
		schema: [{
			type: 'object',
			properties: {
				typeApplications: {
					enum: ['always', 'never']
				},
				functionParams: {
					enum: ['always', 'never']
				},
				functionResult: {
					enum: ['always', 'never']
				},
				recordFields: {
					enum: ['always', 'never']
				},
				unionElements: {
					enum: ['always', 'never']
				}
			},
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function checkTokenSpacing(source, text, option, place, token) {
			let regexp;

			switch (true) {
				case token === 'comma' && option === 'always':
					regexp = NO_SPACE_AFTER_COMMA;
					break;

				case token === 'comma' && option === 'never':
					regexp = SPACE_AFTER_COMMA;
					break;

				case token === 'colon' && option === 'always':
					regexp = NO_SPACE_AFTER_COLON;
					break;

				case token === 'colon' && option === 'never':
					regexp = SPACE_AFTER_COLON;
					break;

				case token === 'pipe' && option === 'always':
					regexp = NO_SPACE_AROUND_PIPE;
					break;

				case token === 'pipe' && option === 'never':
					regexp = SPACE_AROUND_PIPE;
					break;
			}

			if (regexp && regexp.test(text)) {
				context.report({
					node: source,
					message: (
						`${place.charAt(0).toUpperCase() + place.slice(1)} should ` +
						`${option === 'always' ? 'have' : 'not have'} space ` +
						`${token === 'pipe' ? 'around' : 'after'} ${token}.`
					)
				});
			}
		}

		function check(JSDoc) {
			const commentLines = JSDoc.source.value.split('\n');

			JSDoc.tags.forEach((tag, tagIndex) => {
				if (!tag.type) {
					return;
				}

				const nextTag = JSDoc.tags[tagIndex + 1];
				const commentText = commentLines.slice(tag.lineNumber, nextTag && nextTag.lineNumber)
					.join('\n')
					.replace(tag.description || '', '');

				traverseJSDocType(tag.type, (type) => {
					switch (type.type) {
						case 'TypeApplication':
							checkTokenSpacing(
								JSDoc.source,
								commentText,
								options.typeApplications,
								'type applications',
								'comma'
							);

							break;

						case 'FunctionType':
							checkTokenSpacing(
								JSDoc.source,
								commentText,
								options.functionParams,
								'function params',
								'comma'
							);

							checkTokenSpacing(
								JSDoc.source,
								commentText,
								options.functionResult,
								'function result',
								'colon'
							);

							break;

						case 'RecordType':
							checkTokenSpacing(
								JSDoc.source,
								commentText,
								options.recordFields,
								'record fields',
								'colon'
							);

							checkTokenSpacing(
								JSDoc.source,
								commentText,
								options.recordFields,
								'record fields',
								'comma'
							);

							break;

						case 'UnionType':
							checkTokenSpacing(
								JSDoc.source,
								commentText,
								options.unionElements,
								'union elements',
								'pipe'
							);
					}
				});
			});
		}

		return iterateOverJSDocs(check, context);
	}
};
