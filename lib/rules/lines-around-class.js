const {getStartLineIncludingComments, getFirstComment, fixNewlinesBetween} = require('../utils');
const {iterateOverClassNodes} = require('../iterators');

const DEFAULT_OPTIONS = {
	before: 2,
	after: 2,
	collisionPriority: 'before'
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce newlines before and after class'
		},
		schema: [{
			type: 'object',
			properties: {
				before: {
					type: 'number'
				},
				after: {
					type: 'number'
				},
				collisionPriority: {
					enum: ['before', 'after']
				}
			},
			additionalProperties: false
		}],
		fixable: 'whitespace'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function check(classNode) {
			const scopeBody = context.getScope().block.body;
			const classScopeIndex = scopeBody.indexOf(classNode);

			const nodeBeforeClass = classScopeIndex ? scopeBody[classScopeIndex - 1] : null;
			const nodeAfterClass = classScopeIndex !== scopeBody.length - 1 ? scopeBody[classScopeIndex + 1] : null;

			if (nodeBeforeClass) {
				const nodeBeforeClassIsAnotherClass = (
					nodeBeforeClass.type === 'ClassDeclaration' ||
					(
						nodeBeforeClass.type === 'ExpressionStatement' &&
						nodeBeforeClass.expression.type === 'AssignmentExpression' &&
						nodeBeforeClass.expression.right.type === 'ClassExpression'
					)
				);

				// Collision detected and priority says to stay away
				if (nodeBeforeClassIsAnotherClass && options.collisionPriority !== 'before') {
					return;
				}

				const nodeBeforeClassEndLine = nodeBeforeClass.loc.end.line;

				const classStartLine = getStartLineIncludingComments(classNode, context);
				const classFirstComment = getFirstComment(classNode, context);

				const requiredNewlinesBeforeClass = options.before;
				const givenNewlinesBeforeClass = Math.max(classStartLine - nodeBeforeClassEndLine - 1, 0);

				if (givenNewlinesBeforeClass !== requiredNewlinesBeforeClass) {
					context.report({
						node: classNode,
						message: (
							`Amount of newlines before class should be ${requiredNewlinesBeforeClass}, ` +
							`but ${givenNewlinesBeforeClass} given.`
						),
						fix: (fixer) => fixNewlinesBetween(
							nodeBeforeClass,
							classFirstComment || classNode,
							requiredNewlinesBeforeClass,
							fixer,
							context
						)
					});
				}
			}

			if (nodeAfterClass) {
				const nodeAfterClassIsAnotherClass = (
					nodeAfterClass.type === 'ClassDeclaration' ||
					(
						nodeAfterClass.type === 'ExpressionStatement' &&
						nodeAfterClass.expression.type === 'AssignmentExpression' &&
						nodeAfterClass.expression.right.type === 'ClassExpression'
					)
				);

				// Collision detected and priority says to stay away
				if (nodeAfterClassIsAnotherClass && options.collisionPriority !== 'after') {
					return;
				}

				const nodeAfterClassStartLine = getStartLineIncludingComments(nodeAfterClass, context);
				const nodeAfterClassFirstComment = getFirstComment(nodeAfterClass, context);

				const classEndLine = classNode.loc.end.line;

				const requiredNewlinesAfterClass = options.after;
				const givenNewlinesAfterClass = Math.max(nodeAfterClassStartLine - classEndLine - 1, 0);

				if (givenNewlinesAfterClass !== requiredNewlinesAfterClass) {
					context.report({
						node: classNode,
						message: (
							`Amount of newlines after class should be ${requiredNewlinesAfterClass}, ` +
							`but ${givenNewlinesAfterClass} given.`
						),
						fix: (fixer) => fixNewlinesBetween(
							classNode,
							nodeAfterClassFirstComment || nodeAfterClass,
							requiredNewlinesAfterClass,
							fixer,
							context
						)
					});
				}
			}
		}

		return iterateOverClassNodes(check);
	}
};
