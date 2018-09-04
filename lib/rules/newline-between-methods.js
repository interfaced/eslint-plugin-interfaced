const {getStartLineIncludingComments, getFirstComment, fixNewlinesBetween} = require('../utils');

const DEFAULT_OPTIONS = {
	newlinesCount: 1
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newlines between methods'
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

		function reportNewlinesViolationIfNeeded(methodADefinition, methodBDefinition) {
			const methodAEndLine = methodADefinition.loc.end.line;
			const methodBStartLine = getStartLineIncludingComments(methodBDefinition);
			const methodBFirstComment = getFirstComment(methodBDefinition);

			const requiredNewlinesCountBetweenMethods = options.newlinesCount;
			const givenNewlinesCountBetweenMethods = Math.max(methodBStartLine - methodAEndLine - 1, 0);

			if (givenNewlinesCountBetweenMethods !== requiredNewlinesCountBetweenMethods) {
				context.report({
					node: methodBDefinition,
					message: (
						`Count of newlines between methods should be ${requiredNewlinesCountBetweenMethods}, ` +
						`but ${givenNewlinesCountBetweenMethods} given.`
					),
					fix: (fixer) => fixNewlinesBetween(
						methodADefinition,
						methodBFirstComment || methodBDefinition,
						requiredNewlinesCountBetweenMethods,
						fixer,
						context
					)
				});
			}
		}

		function handleClassNode(node) {
			node.body.body.reduce((previousMethodDefinition, methodDefinition) => {
				if (previousMethodDefinition) {
					reportNewlinesViolationIfNeeded(previousMethodDefinition, methodDefinition);
				}

				return methodDefinition;
			}, null);
		}

		return {
			'ClassDeclaration': handleClassNode,
			'ClassExpression': handleClassNode
		};
	}
};
