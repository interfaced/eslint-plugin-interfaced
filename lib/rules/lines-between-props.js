const {visitPropExpressionPairs} = require('../visitors');
const {getJSDocComment} = require('../ast-utils');
const {fixNewlinesBetweenNodes} = require('../utils');

const DEFAULT_OPTIONS = {
	amount: 1
};

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'enforce newlines between properties'
		},

		fixable: 'whitespace',

		schema: [{
			type: 'object',
			properties: {
				amount: {
					type: 'number'
				}
			},
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} propAExpression
		 * @param {ASTNode} propBExpression
		 */
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
					fix(fixer) {
						return fixNewlinesBetweenNodes(
							propAExpression,
							propBJSDocComment || propBExpression,
							requiredNewlinesBetweenProps,
							fixer,
							sourceCode
						);
					}
				});
			}
		}

		return visitPropExpressionPairs(check, sourceCode);
	}
};
