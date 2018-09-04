const {
	getStartLineIncludingComments,
	getFirstComment,
	getPropertiesFromConstructor,
	fixNewlinesBetween
} = require('../utils');

const DEFAULT_OPTIONS = {
	newlinesCount: 1
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newlines between properties'
		},
		schema: [{
			type: 'object',
			properties: {
				newlinesCount: {
					type: 'number'
				}
			},
			additionalProperties: false
		}],
		fixable: 'code'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const propertyExpressions = [];

		function reportNewlinesViolationIfNeeded(propAExpression, propBExpression) {
			const propAEndLine = propAExpression.loc.end.line;
			const propBStartLine = getStartLineIncludingComments(propBExpression);
			const propBFirstComment = getFirstComment(propBExpression);

			const requiredNewlinesCountBetweenProps = options.newlinesCount;
			const givenNewlinesCountBetweenProps = Math.max(propBStartLine - propAEndLine - 1, 0);

			if (givenNewlinesCountBetweenProps !== requiredNewlinesCountBetweenProps) {
				context.report({
					node: propBExpression,
					message: (
						`Count of newlines between props should be ${requiredNewlinesCountBetweenProps}, ` +
						`but ${givenNewlinesCountBetweenProps} given.`
					),
					fix: (fixer) => fixNewlinesBetween(
						propAExpression,
						propBFirstComment || propBExpression,
						requiredNewlinesCountBetweenProps,
						fixer,
						context
					)
				});
			}
		}

		return {
			'MethodDefinition': (node) => {
				propertyExpressions.push(...getPropertiesFromConstructor(node, context));
			},
			'Program:exit': () => {
				propertyExpressions.reduce((previousPropExpression, propertyExpression) => {
					if (previousPropExpression) {
						reportNewlinesViolationIfNeeded(previousPropExpression, propertyExpression);
					}

					return propertyExpression;
				}, null);
			}
		};
	}
};
