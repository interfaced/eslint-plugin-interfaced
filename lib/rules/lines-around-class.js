const {visitClassNodes} = require('../visitors');
const {getScopeBody, getScopeRange, getJSDocComment, isClassNode} = require('../ast-utils');
const {fixNewlinesBetweenNodes} = require('../utils');

const DEFAULT_OPTIONS = {
	before: 1,
	after: 1,
	collisionPriority: 'before'
};

module.exports = {
	meta: {
		type: 'layout',

		docs: {
			description: 'enforce newlines before and after class'
		},

		fixable: 'whitespace',

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
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		/**
		 * @param {Scope} upperScope
		 * @param {ASTNode} classNode
		 * @return {boolean}
		 */
		function isCollisionBefore(upperScope, classNode) {
			const upperScopeBody = getScopeBody(upperScope);
			const classIndexInScope = upperScopeBody.indexOf(classNode);
			const classJSDocComment = getJSDocComment(classNode, sourceCode);

			const nodeBeforeClass = upperScopeBody[classIndexInScope - 1] || null;
			const tokenBeforeClass = sourceCode.getTokenBefore((classJSDocComment || classNode), {
				includeComments: true
			});

			return (
				tokenBeforeClass &&
				nodeBeforeClass && isClassNode(nodeBeforeClass) &&
				nodeBeforeClass.loc.end.line === tokenBeforeClass.loc.end.line
			);
		}

		/**
		 * @param {Scope} upperScope
		 * @param {ASTNode} classNode
		 * @return {boolean}
		 */
		function isCollisionAfter(upperScope, classNode) {
			const upperScopeBody = getScopeBody(upperScope);
			const classIndexInScope = upperScopeBody.indexOf(classNode);

			const nodeAfterClass = upperScopeBody[classIndexInScope + 1] || null;
			const tokenAfterClass = sourceCode.getTokenAfter((classNode), {
				includeComments: true
			});

			const nodeAfterClassJSDocComment = nodeAfterClass && getJSDocComment(nodeAfterClass, sourceCode);

			return (
				tokenAfterClass &&
				nodeAfterClass && isClassNode(nodeAfterClass) &&
				(nodeAfterClassJSDocComment || nodeAfterClass).loc.start.line === tokenAfterClass.loc.start.line
			);
		}

		/**
		 * @param {ASTNode} classNode
		 */
		function check(classNode) {
			const upperScope = context.getScope().upper;
			const upperScopeStart = getScopeRange(upperScope)[0];
			const classJSDocComment = getJSDocComment(classNode, sourceCode);

			const tokenBeforeClass = sourceCode.getTokenBefore((classJSDocComment || classNode), {
				includeComments: true,
				filter(token) {
					return token.start > upperScopeStart;
				}
			});

			const tokenAfterClass = sourceCode.getTokenAfter((classNode), {
				includeComments: true,
				filter(token) {
					return token.start > upperScopeStart;
				}
			});

			if (tokenBeforeClass) {
				if (isCollisionBefore(upperScope, classNode) && options.collisionPriority !== 'before') {
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
				if (isCollisionAfter(upperScope, classNode) && options.collisionPriority !== 'after') {
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
