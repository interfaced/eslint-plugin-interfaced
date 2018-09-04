const {traverseJSDocType} = require('../utils');
const {iterateOverJSDocs} = require('../iterators');

const DOT_BEFORE_LT_REGEXP = /\.</;
const NO_DOT_BEFORE_LT_REGEXP = /[^.]</;

module.exports = {
	meta: {
		docs: {
			description: 'enforce dot before "<" symbol in JSDoc type application'
		},
		schema: [{
			type: {
				enum: ['always', 'never', 'consistent']
			}
		}]
	},
	create: (context) => {
		const option = context.options[0] || 'always';

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
					if (type.type !== 'TypeApplication') {
						return;
					}

					switch (option) {
						case 'always':
							if (NO_DOT_BEFORE_LT_REGEXP.test(commentText)) {
								context.report({
									node: JSDoc.source,
									message: 'Type application should have dot before "<"".'
								});
							}

							break;

						case 'never':
							if (DOT_BEFORE_LT_REGEXP.test(commentText)) {
								context.report({
									node: JSDoc.source,
									message: 'Type application should not have dot before "<"".'
								});
							}

							break;

						case 'consistent':
							if (
								DOT_BEFORE_LT_REGEXP.test(commentText) &&
								NO_DOT_BEFORE_LT_REGEXP.test(commentText)
							) {
								context.report({
									node: JSDoc.source,
									message: 'Type application has inconsistent dots before "<"".'
								});
							}

							break;
					}
				});
			});
		}

		return iterateOverJSDocs(check, context);
	}
};
