const {getJSDocDescription} = require('../utils');
const {iterateOverConstantExpressions} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'enforce event description ("Fired with: ...") for event constant'
		}
	},
	create: (context) => {
		function check(constantExpression) {
			const constantName = constantExpression.expression.left.property.name;

			if (constantName.startsWith('EVENT_')) {
				const description = getJSDocDescription(constantExpression, context);

				if (!description.split('\n').some((line) => line.startsWith('Fired with:'))) {
					context.report({
						node: constantExpression,
						message: `Event constant "${constantName}" has no "Fired with: ..." description.`
					});
				}
			}
		}

		return iterateOverConstantExpressions(check, context);
	}
};
