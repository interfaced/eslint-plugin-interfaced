const {iterateOverJSDocs} = require('../iterators');
const {KNOWN_JSDOC_TAGS} = require('../consts');

const DEFAULT_OPTIONS = {
	tagsOrder: []
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce specified JSDoc tags order'
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
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function check(JSDoc) {
			JSDoc.tags.reduce((previousTag, tag) => {
				const tagTitle = tag.title.toLowerCase();
				const isTagRestricted = options.tagsOrder.indexOf(tagTitle) !== -1;

				if (!isTagRestricted) {
					return previousTag;
				}

				if (previousTag) {
					const previousTagTitle = previousTag.title.toLowerCase();

					const isPreviousTagRestricted = options.tagsOrder.indexOf(previousTagTitle) !== -1;
					const tagHasHigherPriority =
						options.tagsOrder.indexOf(tagTitle) < options.tagsOrder.indexOf(previousTagTitle);

					if (isPreviousTagRestricted && tagHasHigherPriority) {
						context.report({
							node: JSDoc.source,
							message: `JSDoc tag "${tagTitle}" should be before "${previousTagTitle}".`
						});
					}
				}

				return tag;
			}, null);
		}

		return iterateOverJSDocs(check, context);
	}
};
