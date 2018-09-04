const {visitJSDocs} = require('../visitors');
const {getJSDocTagContent} = require('../jsdoc');

module.exports = {
	meta: {
		docs: {
			description: 'disallow tab characters in JSDoc type'
		}
	},
	create: (context) => {
		function check(JSDoc) {
			JSDoc.tags.forEach((tag) => {
				if (tag.type && /\t/.test(getJSDocTagContent(JSDoc, tag))) {
					context.report({
						node: JSDoc.source,
						message: `Unexpected tab character in type of @${tag.title}.`
					});
				}
			});
		}

		return visitJSDocs(check, context);
	}
};
