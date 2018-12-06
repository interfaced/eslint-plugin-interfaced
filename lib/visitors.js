const {
	isClassNode,
	isEnumExpression,
	isTypedefExpression,
	isConstantExpression,
	isTypecast,
	resolveConstantName,
	getPropsFromClassConstructor,
	parseJSDoc,
	hasJSDocWithTags
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
function visitConstantExpressions(visitor, sourceCode) {
	function visit(node) {
		if (isConstantExpression(node, sourceCode)) {
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
function visitEventConstantExpressions(visitor, sourceCode) {
	return visitConstantExpressions((constantExpression) => {
		const name = resolveConstantName(constantExpression);

		if (name.startsWith('EVENT_')) {
			visitor(constantExpression);
		}
	}, sourceCode);
}

/**
 * @param {function(ASTNode)} visitor
 * @return {Visitor}
 */
function visitClassNodes(visitor) {
	function visit(node) {
		if (isClassNode(node)) {
			visitor(node);
		}
	}

	return {
		'ClassDeclaration': (node) => visit(node),
		'ClassExpression': (node) => visit(node.parent.parent)
	};
}

/**
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitAbstractClassNodes(visitor, sourceCode) {
	return visitClassNodes((node) => {
		if (hasJSDocWithTags(node, ['abstract'], sourceCode)) {
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
		if (hasJSDocWithTags(node, ['interface'], sourceCode)) {
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
 * @param {function(ASTNode)} visitor
 * @param {SourceCode} sourceCode
 * @return {Visitor}
 */
function visitTypecastNodes(visitor, sourceCode) {
	function visit(node) {
		if (isTypecast(node, sourceCode)) {
			visitor(node);
		}
	}

	return {
		'AssignmentExpression': (node) => visit(node.right),
		'ArrowFunctionExpression': (node) => {
			// Inline body, e.g.: 'const func = () => 10;'
			if (node.body.type !== 'BlockStatement') {
				visit(node.body);
			}
		},
		'ReturnStatement': (node) => {
			// Statement may be empty, e.g. 'return;'
			if (node.argument) {
				visit(node.argument);
			}
		},
		'VariableDeclarator': (node) => {
			// Declarator may be empty, e.g.: 'let myVariable;'
			if (node.init) {
				visit(node.init);
			}
		}
	};
}

module.exports = {
	combineVisitors,
	visitJSDocs,
	visitEnumExpressions,
	visitTypedefExpressions,
	visitConstantExpressions,
	visitEventConstantExpressions,
	visitClassNodes,
	visitAbstractClassNodes,
	visitInterfaceNodes,
	visitMethodDefinitions,
	visitMethodDefinitionPairs,
	visitPropExpressions,
	visitPropExpressionPairs,
	visitTypecastNodes
};
