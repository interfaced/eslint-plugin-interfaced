const {
	getStartLineIncludingComments,
	getFirstComment,
	hasJSDocTags,
	fixNewlinesBetween,
	groupExpressions
} = require('../utils');

const DEFAULT_OPTIONS = {
	newlinesCount: 1
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newline between static expressions (const, enum, typedef)'
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
		const staticExpressions = [];

		function reportNewlinesViolationIfNeeded(staticExpressionA, staticExpressionB) {
			const staticExpressionAEndLine = staticExpressionA.loc.end.line;
			const staticExpressionBStartLine = getStartLineIncludingComments(staticExpressionB);
			const staticExpressionBFirstComment = getFirstComment(staticExpressionB);

			const requiredNewlinesCountBetweenStaticExpressions = options.newlinesCount;
			const givenNewlinesCountBetweenStaticExpressions =
				Math.max(staticExpressionBStartLine - staticExpressionAEndLine - 1, 0);

			if (givenNewlinesCountBetweenStaticExpressions !== requiredNewlinesCountBetweenStaticExpressions) {
				context.report({
					node: staticExpressionB,
					message: (
						`Count of newlines between static expressions ` +
						`should be ${requiredNewlinesCountBetweenStaticExpressions}, ` +
						`but ${givenNewlinesCountBetweenStaticExpressions} given.`
					),
					fix: (fixer) => fixNewlinesBetween(
						staticExpressionA,
						staticExpressionBFirstComment || staticExpressionB,
						requiredNewlinesCountBetweenStaticExpressions,
						fixer,
						context
					)
				});
			}
		}

		return {
			'ExpressionStatement': (node) => {
				if (node.parent.type === 'Program' && hasJSDocTags(node, ['const', 'enum', 'typedef'], context)) {
					staticExpressions.push(node);
				}
			},
			'Program:exit': () => {
				groupExpressions(staticExpressions)
					.forEach((group) => {
						group.reduce((previousStaticExpression, staticExpression) => {
							if (previousStaticExpression) {
								reportNewlinesViolationIfNeeded(previousStaticExpression, staticExpression);
							}

							return staticExpression;
						}, null);
					});
			}
		};
	}
};
