const {visitJSDocs} = require('../visitors');
const {KNOWN_JSDOC_TAGS, KNOWN_JSDOC_TYPES} = require('../consts');

const DEFAULT_OPTIONS = {
	tags: []
};

module.exports = {
	meta: {
		docs: {
			description: 'disallow specified JSDoc tags'
		},
		schema: [{
			type: 'object',
			properties: {
				tags: {
					type: 'array',
					items: {
						anyOf: [{
							enum: KNOWN_JSDOC_TAGS
						}, {
							type: 'object',
							properties: {
								tag: {
									type: 'string'
								},
								allowWithTags: {
									type: 'array',
									items: {
										enum: KNOWN_JSDOC_TAGS
									}
								},
								allowWithTypes: {
									type: 'array',
									items: {
										enum: KNOWN_JSDOC_TYPES
									}
								}
							},
							additionalProperties: false
						}]
					}
				}
			},
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function check(JSDoc) {
			const tagTitles = JSDoc.tags.map((tag) => tag.title.toLowerCase());

			JSDoc.tags.forEach((tag) => {
				const tagTitle = tag.title.toLowerCase();
				const tagType = tag.type;

				if (options.tags.indexOf(tagTitle) !== -1) {
					context.report({
						node: JSDoc.source,
						message: `JSDoc tag "${tagTitle}" is not allowed.`
					});

					return;
				}

				const tagOptionObjects = options.tags.filter((tagItem) =>
					typeof tagItem === 'object' && tagItem.tag === tagTitle
				);

				if (tagOptionObjects.length) {
					const allowWithTagTitles = tagOptionObjects.reduce(
						(acc, tagOptionObject) => acc.concat(tagOptionObject.allowWithTags || []), []
					);

					const allowWithTagTypes = tagOptionObjects.reduce(
						(acc, tagOptionObject) => acc.concat(tagOptionObject.allowWithTypes || []), []
					);

					const isTagAllowedByTagsPresence = allowWithTagTitles.some(
						(someTagTitle) => tagTitles.indexOf(someTagTitle) !== -1
					);

					const isTagAllowedByTypePresence = allowWithTagTypes.some(
						(someTagType) => someTagType === tagType.type
					);

					if (!isTagAllowedByTagsPresence && !isTagAllowedByTypePresence) {
						const explainingTextParts = [];

						if (allowWithTagTitles.length) {
							explainingTextParts.push(
								`tag${allowWithTagTitles.length > 1 ? 's' : ''} "${allowWithTagTitles.join('", "')}"`
							);
						}

						if (allowWithTagTypes.length) {
							explainingTextParts.push(
								`type${allowWithTagTypes.length > 1 ? 's' : ''} "${allowWithTagTypes.join(', "')}"`
							);
						}

						let explainingText = '';
						if (explainingTextParts.length) {
							explainingText = `This tags allowed only with ${explainingTextParts.join(' and ')}.`;
						}

						context.report({
							node: JSDoc.source,
							message: `JSDoc tag "${tagTitle}" is not allowed. ${explainingText}`
						});
					}
				}
			});
		}

		return visitJSDocs(check, context);
	}
};
