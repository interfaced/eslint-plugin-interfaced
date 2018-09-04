const {visitJSDocs} = require('../visitors');
const {KNOWN_JSDOC_TAGS} = require('../consts');
const {getJSDocTagContent} = require('../ast-utils');
const {fixTextInJSDocInterval} = require('../utils');

const DEFAULT_OPTIONS = {
	tagsOrder: []
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce the specified order for JSDoc tags'
		},
		schema: [{
			type: 'object',
			properties: {
				tagsOrder: {
					type: 'array',
					items: {
						enum: KNOWN_JSDOC_TAGS
					}
				}
			},
			additionalProperties: false
		}],
		fixable: 'code'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		/**
		 * @param {JSDoc} JSDoc
		 */
		function check(JSDoc) {
			JSDoc.tags.reduce((previousTag, tag) => {
				const tagTitle = tag.title.toLowerCase();

				const isTagListed = options.tagsOrder.indexOf(tagTitle) !== -1;
				if (!isTagListed) {
					return previousTag;
				}

				if (previousTag) {
					const previousTagTitle = previousTag.title.toLowerCase();

					const isTagWithHigherPriority = (
						options.tagsOrder.indexOf(tagTitle) <
						options.tagsOrder.indexOf(previousTagTitle)
					);

					if (isTagWithHigherPriority) {
						context.report({
							node: JSDoc.source,
							message: `JSDoc tag "${tagTitle}" should be before "${previousTagTitle}".`,
							fix(fixer) {
								const nonListedTagsBetween = JSDoc.tags.slice(
									JSDoc.tags.indexOf(previousTag) + 1,
									JSDoc.tags.indexOf(tag)
								);

								const fixedOrderTags = [tag, ...nonListedTagsBetween, previousTag];
								const fixedOrderText = fixedOrderTags.map((tag) => getJSDocTagContent(JSDoc, tag))
									.join('\n');

								return fixTextInJSDocInterval(
									JSDoc,
									previousTag.range[0],
									tag.range[1],
									fixedOrderText,
									fixer,
									sourceCode
								);
							}
						});
					}
				}

				return tag;
			}, null);
		}

		return visitJSDocs(check, sourceCode);
	}
};
