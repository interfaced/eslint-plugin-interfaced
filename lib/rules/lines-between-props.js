const {
	getStartLineIncludingComments,
	getFirstComment,
	getPropertiesFromConstructor,
	fixNewlinesBetween
} = require('../utils');

const DEFAULT_OPTIONS = {
	amount: 1
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newlines between properties'
		},
		schema: [{
			type: 'object',
			properties: {
				amount: {
					type: 'number'
				}
			},
			additionalProperties: false
		}],
		fixable: 'code'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function reportNewlinesViolationIfNeeded(propAExpression, propBExpression) {
			const propAEndLine = propAExpression.loc.end.line;
			const propBStartLine = getStartLineIncludingComments(propBExpression, context);
			const propBFirstComment = getFirstComment(propBExpression, context);

			const requiredNewlinesBetweenProps = options.amount;
			const givenNewlinesBetweenProps = Math.max(propBStartLine - propAEndLine - 1, 0);

			if (givenNewlinesBetweenProps !== requiredNewlinesBetweenProps) {
				context.report({
					node: propBExpression,
					message: (
						`Amount of newlines between props should be ${requiredNewlinesBetweenProps}, ` +
						`but ${givenNewlinesBetweenProps} given.`
					),
					fix: (fixer) => fixNewlinesBetween(
						propAExpression,
						propBFirstComment || propBExpression,
						requiredNewlinesBetweenProps,
						fixer,
						context
					)
				});
			}
		}

		return {
			'MethodDefinition': (node) => {
				getPropertiesFromConstructor(node, context)
					.reduce((previousPropExpression, propertyExpression) => {
						if (previousPropExpression) {
							reportNewlinesViolationIfNeeded(previousPropExpression, propertyExpression);
						}

						return propertyExpression;
					}, null);
			}
		};
	}
};
