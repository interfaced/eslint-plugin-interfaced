const {visitJSDocs} = require('../visitors');
const {traverseJSDocType, getJSDocTagContent} = require('../jsdoc');

const DOT_BEFORE_LT_REGEXP = /\.</;
const NO_DOT_BEFORE_LT_REGEXP = /[^.]</;

module.exports = {
	meta: {
		docs: {
			description: 'enforce dot before "<" symbol in JSDoc type application'
		},
		schema: [{
			enum: ['always', 'never', 'consistent']
		}]
	},
	create: (context) => {
		const option = context.options[0] || 'always';

		function check(JSDoc) {
			JSDoc.tags.forEach((tag) => {
				if (!tag.type) {
					return;
				}

				const tagContent = getJSDocTagContent(JSDoc, tag);

				traverseJSDocType(tag.type, (type) => {
					if (type.type !== 'TypeApplication') {
						return;
					}

					switch (option) {
						case 'always':
							if (NO_DOT_BEFORE_LT_REGEXP.test(tagContent)) {
								context.report({
									node: JSDoc.source,
									message: 'Type application should have dot before "<"".'
								});
							}

							break;

						case 'never':
							if (DOT_BEFORE_LT_REGEXP.test(tagContent)) {
								context.report({
									node: JSDoc.source,
									message: 'Type application should not have dot before "<"".'
								});
							}

							break;

						case 'consistent':
							if (
								DOT_BEFORE_LT_REGEXP.test(tagContent) &&
								NO_DOT_BEFORE_LT_REGEXP.test(tagContent)
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

		return visitJSDocs(check, context);
	}
};
