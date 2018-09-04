const {getStartLineIncludingComments, getFirstComment, fixNewlinesBetween} = require('../utils');

const DEFAULT_OPTIONS = {
	newlinesCountBefore: 2,
	newlinesCountAfter: 2,
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
				newlinesCountBefore: {
					type: 'number'
				},
				newlinesCountAfter: {
					type: 'number'
				},
				collisionPriority: {
					enum: ['before', 'after']
				}
			},
			additionalProperties: false
		}],
		fixable: 'code'
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);

		function reportNewlinesViolationIfNeeded(classDeclarationOrAssignment) {
			const scopeBody = context.getScope().block.body;
			const classScopeIndex = scopeBody.indexOf(classDeclarationOrAssignment);

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

				// Collision detected and priority says stay away
				if (nodeBeforeClassIsAnotherClass && options.collisionPriority !== 'before') {
					return;
				}

				const nodeBeforeClassEndLine = nodeBeforeClass.loc.end.line;

				const classStartLine = getStartLineIncludingComments(classDeclarationOrAssignment);
				const classFirstComment = getFirstComment(classDeclarationOrAssignment);

				const requiredNewlinesCountBeforeClass = options.newlinesCountBefore;
				const givenNewlinesCountBeforeClass = Math.max(classStartLine - nodeBeforeClassEndLine - 1, 0);

				if (givenNewlinesCountBeforeClass !== requiredNewlinesCountBeforeClass) {
					context.report({
						node: classDeclarationOrAssignment,
						message: (
							`Count of newlines before class should be ${requiredNewlinesCountBeforeClass}, ` +
							`but ${givenNewlinesCountBeforeClass} given.`
						),
						fix: (fixer) => fixNewlinesBetween(
							nodeBeforeClass,
							classFirstComment || classDeclarationOrAssignment,
							requiredNewlinesCountBeforeClass,
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

				// Collision detected and priority says stay away
				if (nodeAfterClassIsAnotherClass && options.collisionPriority !== 'after') {
					return;
				}

				const nodeAfterClassStartLine = getStartLineIncludingComments(nodeAfterClass);
				const nodeAfterClassFirstComment = getFirstComment(nodeAfterClass);

				const classEndLine = classDeclarationOrAssignment.loc.end.line;

				const requiredNewlinesCountAfterClass = options.newlinesCountAfter;
				const givenNewlinesCountAfterClass = Math.max(nodeAfterClassStartLine - classEndLine - 1, 0);

				if (givenNewlinesCountAfterClass !== requiredNewlinesCountAfterClass) {
					context.report({
						node: classDeclarationOrAssignment,
						message: (
							`Count of newlines after class should be ${requiredNewlinesCountAfterClass}, ` +
							`but ${givenNewlinesCountAfterClass} given.`
						),
						fix: (fixer) => fixNewlinesBetween(
							classDeclarationOrAssignment,
							nodeAfterClassFirstComment || nodeAfterClass,
							requiredNewlinesCountAfterClass,
							fixer,
							context
						)
					});
				}
			}
		}

		return {
			'ClassDeclaration': (node) => reportNewlinesViolationIfNeeded(node),
			'ClassExpression': (node) => reportNewlinesViolationIfNeeded(node.parent.parent)
		};
	}
};
