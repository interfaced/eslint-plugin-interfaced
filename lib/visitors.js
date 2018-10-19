const {
	isEnumExpression,
	isTypedefExpression,
	isConstantExpression,
	getPropsFromClassConstructor,
	parseJSDoc,
	hasJSDocTags
} = require('./ast-utils');

/**
 * @typedef {Object<string, function(ASTNode)>}
 */
let Visitor;

/**
 * @param {...Visitor} visitors
 * @return {Visitor}
 */
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

/**
 * @param {function(JSDoc)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitJSDocs(visitor, sourceCode) {
	return {
		'Program': () => {
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

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitEnumExpressions(visitor, sourceCode) {
	function visit(node) {
		if (isEnumExpression(node, sourceCode)) {
			visitor(node);
		}
	}

	return {
		'ExpressionStatement': visit,
		'VariableDeclaration': visit
	};
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitTypedefExpressions(visitor, sourceCode) {
	function visit(node) {
		if (isTypedefExpression(node, sourceCode)) {
			visitor(node);
		}
	}

	return {
		'ExpressionStatement': visit,
		'VariableDeclaration': visit
	};
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitTypedefVariables(visitor, sourceCode) {
	return {
		'VariableDeclaration': (node) => {
			if (isTypedefExpression(node, sourceCode)) {
				visitor(node);
			}
		}
	};
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitConstantExpressions(visitor, sourceCode) {
	return {
		'MethodDefinition': (node) => {
			getPropsFromClassConstructor(node, sourceCode)
				.forEach((propExpression) => {
					if (isConstantExpression(propExpression, sourceCode, {isStatic: false})) {
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

/**
 * @param {function(ASTNode)} visitor
 * @return {Visitor}
 */
function visitClassNodes(visitor) {
	return {
		'ClassDeclaration': (node) => visitor(node),
		'ClassExpression': (node) => visitor(node.parent.parent)
	};
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitAbstractClassNodes(visitor, sourceCode) {
	return visitClassNodes((node) => {
		if (hasJSDocTags(node, ['abstract'], sourceCode)) {
			visitor(node);
		}
	});
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitInterfaceNodes(visitor, sourceCode) {
	return visitClassNodes((node) => {
		if (hasJSDocTags(node, ['interface'], sourceCode)) {
			visitor(node);
		}
	});
}

/**
 * @param {function(ASTNode)} visitor
 * @return {Visitor}
 */
function visitMethodDefinitions(visitor) {
	return {
		'MethodDefinition': visitor
	};
}

/**
 * @param {function(ASTNode, ASTNode)} visitor
 * @return {Visitor}
 */
function visitMethodDefinitionPairs(visitor) {
	function visit(node) {
		node.body.body.reduce((previousMethodDefinition, methodDefinition) => {
			if (previousMethodDefinition) {
				visitor(previousMethodDefinition, methodDefinition);
			}

			return methodDefinition;
		}, null);
	}

	return {
		'ClassDeclaration': visit,
		'ClassExpression': visit
	};
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitPropExpressions(visitor, sourceCode) {
	return {
		'MethodDefinition': (node) => {
			getPropsFromClassConstructor(node, sourceCode)
				.forEach((property) => visitor(property));
		}
	};
}

/**
 * @param {function(ASTNode, ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitPropExpressionPairs(visitor, sourceCode) {
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

/**
 * @param {function(ASTNode, ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitStaticExpressionPairs(visitor, sourceCode) {
	const staticExpressions = [];

	function visit(node) {
		if (
			isEnumExpression(node, sourceCode) ||
			isTypedefExpression(node, sourceCode) ||
			isConstantExpression(node, sourceCode)
		) {
			staticExpressions.push(node);
		}
	}

	return {
		'ExpressionStatement': visit,
		'VariableDeclaration': visit,

		'Program:exit': () => {
			staticExpressions.reduce((previousStaticExpression, staticExpression) => {
				if (previousStaticExpression) {
					visitor(previousStaticExpression, staticExpression);
				}

				return staticExpression;
			}, null);
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
