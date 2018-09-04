const {iterateOverPropExpressionPairs} = require('../iterators');
const {getJSDocComment} = require('../jsdoc');
const {fixNewlinesBetween} = require('../utils');

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
		fixable: 'whitespace'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		function check(propAExpression, propBExpression) {
			if (sourceCode.getTokensBetween(propAExpression, propBExpression).length) {
				context.report({
					node: propBExpression,
					message: 'Unexpected code between props.'
				});

				return;
			}

			const propBJSDocComment = getJSDocComment(propBExpression, sourceCode);

			if (sourceCode.getCommentsBefore(((propBJSDocComment || propBExpression))).length) {
				context.report({
					node: propBExpression,
					message: 'Unexpected comments between props.'
				});

				return;
			}

			const propAEndLine = propAExpression.loc.end.line;
			const propBStartLine = (propBJSDocComment || propBExpression).loc.start.line;

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
						propBJSDocComment || propBExpression,
						requiredNewlinesBetweenProps,
						fixer,
						sourceCode
					)
				});
			}
		}

		return iterateOverPropExpressionPairs(check, context);
	}
};
