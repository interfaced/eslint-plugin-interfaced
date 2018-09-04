const {visitConstantExpressions} = require('../visitors');
const {getJSDocDescription} = require('../jsdoc');

module.exports = {
	meta: {
		docs: {
			description: 'enforce event description ("Fired with: ...") for event constant'
		}
	},
	create: (context) => {
		const sourceCode = context.getSourceCode();

		function check(constantExpression) {
			const constantName = constantExpression.expression.left.property.name;

			if (constantName.startsWith('EVENT_')) {
				const description = getJSDocDescription(constantExpression, sourceCode);

				if (!description.split('\n').some((line) => line.startsWith('Fired with:'))) {
					context.report({
						node: constantExpression,
						message: `Event constant "${constantName}" has no "Fired with: ..." description.`
					});
				}
			}
		}

		return visitConstantExpressions(check, context);
	}
};
