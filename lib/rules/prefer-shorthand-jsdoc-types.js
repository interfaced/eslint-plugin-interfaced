const {iterateOverJSDocs} = require('../iterators');

const DEFAULT_OPTIONS = {
	optionalParam: 'always',
	nullableType: 'always'
};

module.exports = {
	meta: {
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
		docs: {
			description: 'require usage of shorthand notation for some JSDoc types when possible'
		}
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function check(JSDoc) {
			JSDoc.tags.forEach((tag, index) => {
				if (!tag.type) {
					return;
				}

				if (tag.type.type === 'NullableType' && options.nullableType === 'never') {
					context.report({
						node: JSDoc.source,
						message: `Use "|null" instead of "?" to describe nullable in @${tag.title}.`
					});
				}

				if (
					tag.type.type === 'UnionType' &&
					tag.type.elements.some((element) => element.type === 'NullLiteral') &&
					options.nullableType === 'always'
				) {
					context.report({
						node: JSDoc.source,
						message: `Use "?" instead of "|null" to describe nullable in @${tag.title}.`
					});
				}

				if (
					tag.title === 'param' &&
					tag.type.type === 'OptionalType' &&
					options.optionalParam === 'never'
				) {
					context.report({
						node: JSDoc.source,
						message: `Use "|undefined" instead of "=" to describe optional param ${tag.name}.`
					});
				}
			});

			if (options.optionalParam === 'always') {
				const reversedParams = JSDoc.tags.reverse()
					.filter((tag) => tag.title === 'param');

				const firstNonOptionalParamIndex = reversedParams.findIndex((tag) =>
					tag.type.type !== 'OptionalType' && !(
						tag.type.type === 'UnionType' &&
						tag.type.elements.some((element) => element.type === 'UndefinedLiteral')
					)
				);

				const lastOptionalParams = firstNonOptionalParamIndex === -1 ?
					reversedParams :
					reversedParams.slice(0, firstNonOptionalParamIndex);

				lastOptionalParams.forEach((param) => {
					if (param.type.type !== 'OptionalType') {
						context.report({
							node: JSDoc.source,
							message: `Use "=" instead of "|undefined" to describe optional param ${param.name}.`
						});
					}
				});
			}
		}

		return iterateOverJSDocs(check, context);
	}
};
