const {hasJSDocTags, parseJSDoc} = require('./jsdoc');
const {
	isEnumExpression,
	isTypedefExpression,
	isConstantExpression,
	getPropsFromClassConstructor,
	groupStaticExpressions
} = require('./ast');

function combineVisitors(...visitors) {
	const result = {};

	const caller = (key) => (node) => {
		visitors.forEach((visitor) => {
			if (visitor[key]) {
				visitor[key](node);
			}
		});
	};

	visitors.forEach((visitor) => {
		Object.keys(visitor)
			.forEach((key) => {
				if (result[key]) {
					return;
				}

				result[key] = caller(key);
			});
	});

	return result;
}

function visitJSDocs(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'Program:exit': (node) => {
			sourceCode.getAllComments()
				.forEach((comment) => {
					if (comment.type === 'Block') {
						const JSDoc = parseJSDoc(comment);
						if (!JSDoc) {
							return;
						}

						visitor(JSDoc);
					}
				});
		}
	};
}

function visitEnumExpressions(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'ExpressionStatement': (node) => {
			if (isEnumExpression(node, sourceCode)) {
				visitor(node);
			}
		}
	};
}

function visitTypedefExpressions(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'ExpressionStatement': (node) => {
			if (isTypedefExpression(node, sourceCode)) {
				visitor(node);
			}
		}
	};
}

function visitTypedefVariables(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'VariableDeclaration': (node) => {
			if (['let', 'var'].includes(node.kind) && hasJSDocTags(node, ['typedef'], sourceCode)) {
				visitor(node);
			}
		}
	};
}

function visitConstantExpressions(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'MethodDefinition': (node) => {
			getPropsFromClassConstructor(node, sourceCode)
				.forEach((propExpression) => {
					if (isConstantExpression(propExpression, sourceCode, false)) {
						visitor(propExpression);
					}
				});
		},
		'ExpressionStatement': (node) => {
			if (isConstantExpression(node, sourceCode)) {
				visitor(node);
			}
		}
	};
}

function visitClassNodes(visitor) {
	return {
		'ClassDeclaration': (node) => visitor(node),
		'ClassExpression': (node) => visitor(node.parent.parent)
	};
}

function visitAbstractClassNodes(visitor, context) {
	const sourceCode = context.getSourceCode();

	return visitClassNodes((node) => {
		if (hasJSDocTags(node, ['abstract'], sourceCode)) {
			visitor(node);
		}
	});
}

function visitInterfaceNodes(visitor, context) {
	const sourceCode = context.getSourceCode();

	return visitClassNodes((node) => {
		if (hasJSDocTags(node, ['interface'], sourceCode)) {
			visitor(node);
		}
	});
}

function visitMethodDefinitions(visitor) {
	return {
		'MethodDefinition': visitor
	};
}

function visitMethodDefinitionPairs(visitor) {
	function handle(node) {
		node.body.body.reduce((previousMethodDefinition, methodDefinition) => {
			if (previousMethodDefinition) {
				visitor(previousMethodDefinition, methodDefinition);
			}

			return methodDefinition;
		}, null);
	}

	return {
		'ClassDeclaration': handle,
		'ClassExpression': handle
	};
}

function visitPropExpressions(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'MethodDefinition': (node) => {
			getPropsFromClassConstructor(node, sourceCode)
				.forEach((property) => visitor(property));
		}
	};
}

function visitPropExpressionPairs(visitor, context) {
	const sourceCode = context.getSourceCode();

	return {
		'MethodDefinition': (node) => {
			getPropsFromClassConstructor(node, sourceCode)
				.reduce((previousPropExpression, propExpression) => {
					if (previousPropExpression) {
						visitor(previousPropExpression, propExpression);
					}

					return propExpression;
				}, null);
		}
	};
}

function visitStaticExpressionPairs(visitor, context) {
	const sourceCode = context.getSourceCode();
	const staticExpressions = [];

	return {
		'ExpressionStatement': (node) => {
			if (
				isEnumExpression(node, sourceCode) ||
				isTypedefExpression(node, sourceCode) ||
				isConstantExpression(node, sourceCode)
			) {
				staticExpressions.push(node);
			}
		},
		'Program:exit': () => {
			groupStaticExpressions(staticExpressions)
				.forEach((group) => {
					group.reduce((previousStaticExpression, staticExpression) => {
						if (previousStaticExpression) {
							visitor(previousStaticExpression, staticExpression);
						}

						return staticExpression;
					}, null);
				});
		}
	};
}

module.exports = {
	combineVisitors,
	visitJSDocs,
	visitEnumExpressions,
	visitTypedefExpressions,
	visitTypedefVariables,
	visitConstantExpressions,
	visitClassNodes,
	visitAbstractClassNodes,
	visitInterfaceNodes,
	visitMethodDefinitions,
	visitMethodDefinitionPairs,
	visitPropExpressions,
	visitPropExpressionPairs,
	visitStaticExpressionPairs
};
