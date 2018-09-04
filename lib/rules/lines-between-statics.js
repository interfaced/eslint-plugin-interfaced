const {iterateOverStaticExpressionPairs} = require('../iterators');
const {getJSDocComment} = require('../jsdoc');
const {fixNewlinesBetween} = require('../utils');

const DEFAULT_OPTIONS = {
	amount: 1
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newline between static expressions (const, enum, typedef)'
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

		function check(staticExpressionA, staticExpressionB) {
			if (sourceCode.getTokensBetween(staticExpressionA, staticExpressionB).length) {
				context.report({
					node: staticExpressionB,
					message: 'Unexpected code between static expressions.'
				});

				return;
			}

			const staticExpressionBJSDocComment = getJSDocComment(staticExpressionB, sourceCode);

			if (sourceCode.getCommentsBefore(((staticExpressionBJSDocComment || staticExpressionB))).length) {
				context.report({
					node: staticExpressionB,
					message: 'Unexpected comments between static expressions.'
				});

				return;
			}

			const staticExpressionAEndLine = staticExpressionA.loc.end.line;
			const staticExpressionBStartLine = (staticExpressionBJSDocComment || staticExpressionB).loc.start.line;

			const requiredNewlinesBetweenStaticExpressions = options.amount;
			const givenNewlinesBetweenStaticExpressions =
				Math.max(staticExpressionBStartLine - staticExpressionAEndLine - 1, 0);

			if (givenNewlinesBetweenStaticExpressions !== requiredNewlinesBetweenStaticExpressions) {
				context.report({
					node: staticExpressionB,
					message: (
						`Amount of newlines between static expressions ` +
						`should be ${requiredNewlinesBetweenStaticExpressions}, ` +
						`but ${givenNewlinesBetweenStaticExpressions} given.`
					),
					fix: (fixer) => fixNewlinesBetween(
						staticExpressionA,
						staticExpressionBJSDocComment || staticExpressionB,
						requiredNewlinesBetweenStaticExpressions,
						fixer,
						sourceCode
					)
				});
			}
		}

		return iterateOverStaticExpressionPairs(check, context);
	}
};
