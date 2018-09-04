const {visitClassNodes} = require('../visitors');
const {getJSDocComment, isClass} = require('../ast-utils');
const {fixNewlinesBetweenNodes} = require('../utils');

const DEFAULT_OPTIONS = {
	before: 1,
	after: 1,
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
		const sourceCode = context.getSourceCode();

		/**
		 * @param {ASTNode} classNode
		 * @return {boolean}
		 */
		function isCollisionWithAnotherClassBefore(classNode) {
			const upperScopeBody = context.getScope().upper.block.body;
			const classIndexInScope = upperScopeBody.indexOf(classNode);
			const classJSDocComment = getJSDocComment(classNode, sourceCode);

			const nodeBeforeClass = upperScopeBody[classIndexInScope - 1] || null;
			const tokenBeforeClass = sourceCode.getTokenBefore((classJSDocComment || classNode), {
				includeComments: true
			});

			return (
				tokenBeforeClass &&
				nodeBeforeClass && isClass(nodeBeforeClass) &&
				nodeBeforeClass.loc.end.line === tokenBeforeClass.loc.end.line
			);
		}

		/**
		 * @param {ASTNode} classNode
		 * @return {boolean}
		 */
		function isCollisionWithAnotherClassAfter(classNode) {
			const upperScopeBody = context.getScope().upper.block.body;
			const classIndexInScope = upperScopeBody.indexOf(classNode);

			const nodeAfterClass = upperScopeBody[classIndexInScope + 1] || null;
			const tokenAfterClass = sourceCode.getTokenAfter((classNode), {
				includeComments: true
			});

			const nodeAfterClassJSDocComment = nodeAfterClass && getJSDocComment(nodeAfterClass, sourceCode);

			return (
				tokenAfterClass &&
				nodeAfterClass && isClass(nodeAfterClass) &&
				(nodeAfterClassJSDocComment || nodeAfterClass).loc.start.line === tokenAfterClass.loc.start.line
			);
		}

		/**
		 * @param {ASTNode} classNode
		 */
		function check(classNode) {
			const classJSDocComment = getJSDocComment(classNode, sourceCode);

			const tokenBeforeClass = sourceCode.getTokenBefore((classJSDocComment || classNode), {
				includeComments: true
			});

			const tokenAfterClass = sourceCode.getTokenAfter((classNode), {
				includeComments: true
			});

			if (tokenBeforeClass) {
				if (isCollisionWithAnotherClassBefore(classNode) && options.collisionPriority !== 'before') {
					return;
				}

				const classStartLine = (classJSDocComment || classNode).loc.start.line;
				const tokenBeforeClassEndLine = tokenBeforeClass.loc.end.line;

				const newlinesAmountBeforeClass = Math.max(classStartLine - tokenBeforeClassEndLine - 1, 0);

				if (newlinesAmountBeforeClass !== options.before) {
					context.report({
						node: classNode,
						message: (
							`Amount of newlines before class should be ${options.before}, ` +
							`but ${newlinesAmountBeforeClass} given.`
						),
						fix(fixer) {
							return fixNewlinesBetweenNodes(
								tokenBeforeClass,
								classJSDocComment || classNode,
								options.before,
								fixer,
								sourceCode
							);
						}
					});
				}
			}

			if (tokenAfterClass) {
				if (isCollisionWithAnotherClassAfter(classNode) && options.collisionPriority !== 'after') {
					return;
				}

				const classEndLine = classNode.loc.end.line;
				const tokenAfterClassStartLine = tokenAfterClass.loc.start.line;

				const newlinesAmountAfterClass = Math.max(tokenAfterClassStartLine - classEndLine - 1, 0);

				if (newlinesAmountAfterClass !== options.after) {
					context.report({
						node: classNode,
						message: (
							`Amount of newlines after class should be ${options.after}, ` +
							`but ${newlinesAmountAfterClass} given.`
						),
						fix(fixer) {
							return fixNewlinesBetweenNodes(
								classNode,
								tokenAfterClass,
								options.after,
								fixer,
								sourceCode
							);
						}
					});
				}
			}
		}

		return visitClassNodes(check);
	}
};
