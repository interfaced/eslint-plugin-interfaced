const {hasJSDocTags, parseJSDoc} = require('./jsdoc');

function getMemberExpressionRootIdentifier(memberExpression) {
	let object = memberExpression.object;
	while (object.type !== 'Identifier') {
		object = object.object;
	}

	return object;
}

function groupStaticExpressions(expressions) {
	const noGroupKey = Symbol();
	const groupedStaticExpressions = expressions.reduce((groups, staticExpression) => {
		switch (staticExpression.expression.type) {
			case 'Identifier':
				groups[noGroupKey].push(staticExpression);

				break;

			case 'MemberExpression':
			case 'AssignmentExpression':
				const rootIdentifier = getMemberExpressionRootIdentifier(
					staticExpression.expression.type === 'AssignmentExpression' ?
						staticExpression.expression.left :
						staticExpression.expression
				);

				if (!groups[rootIdentifier.name]) {
					groups[rootIdentifier.name] = [];
				}

				groups[rootIdentifier.name].push(staticExpression);

				break;
		}

		return groups;
	}, {[noGroupKey]: []});

	return Object.keys(groupedStaticExpressions)
		.map((key) => groupedStaticExpressions[key]);
}

function getPropertiesFromClassConstructor(methodDefinition, sourceCode) {
	if (methodDefinition.kind === 'constructor') {
		return methodDefinition.value.body.body.filter((bodyChildNode) => {
			if (bodyChildNode.type !== 'ExpressionStatement') {
				return false;
			}

			const leftPart = bodyChildNode.expression.type === 'AssignmentExpression' ?
				bodyChildNode.expression.left.object :
				bodyChildNode.expression.object;

			return (
				leftPart &&
				leftPart.type === 'ThisExpression' &&
				hasJSDocTags(bodyChildNode, ['type', 'const'], sourceCode)
			);
		});
	}

	return [];
}

function isEnumExpression(node, sourceCode) {
	return (
		hasJSDocTags(node, ['enum'], sourceCode) &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.right.type === 'ObjectExpression' &&
		node.parent.type === 'Program'
	);
}

function isTypedefExpression(node, sourceCode) {
	return (
		hasJSDocTags(node, ['typedef'], sourceCode) &&
		node.expression.type === 'MemberExpression' &&
		node.parent.type === 'Program'
	);
}

function isConstantExpression(node, sourceCode, isStatic = true) {
	return (
		hasJSDocTags(node, ['const'], sourceCode) &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.left.property.type === 'Identifier' &&
		(isStatic ? node.parent.type === 'Program' : true)
	);
}

function combineIterators(...iterators) {
	const result = {};

	const caller = (key) => (node) => {
		iterators.forEach((iterator) => {
			if (iterator[key]) {
				iterator[key](node);
			}
		});
	};

	iterators.forEach((iterator) => {
		Object.keys(iterator)
			.forEach((key) => {
				if (result[key]) {
					return;
				}

				result[key] = caller(key);
			});
	});

	return result;
}

function iterateOverEnumExpressions(iterator, context) {
	const sourceCode = context.getSourceCode();

	return {
		'ExpressionStatement': (node) => {
			if (isEnumExpression(node, sourceCode)) {
				iterator(node);
			}
		}
	};
}

function iterateOverTypedefExpressions(iterator, context) {
	const sourceCode = context.getSourceCode();

	return {
		'ExpressionStatement': (node) => {
			if (isTypedefExpression(node, sourceCode)) {
				iterator(node);
			}
		}
	};
}

function iterateOverConstantExpressions(iterator, context) {
	const sourceCode = context.getSourceCode();

	return {
		'MethodDefinition': (node) => {
			getPropertiesFromClassConstructor(node, sourceCode)
				.forEach((propExpression) => {
					if (isConstantExpression(propExpression, sourceCode, false)) {
						iterator(propExpression);
					}
				});
		},
		'ExpressionStatement': (node) => {
			if (isConstantExpression(node, sourceCode)) {
				iterator(node);
			}
		}
	};
}

function iterateOverJSDocs(iterator, context) {
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

						iterator(JSDoc);
					}
				});
		}
	};
}

function iterateOverClassNodes(iterator) {
	return {
		'ClassDeclaration': (node) => iterator(node),
		'ClassExpression': (node) => iterator(node.parent.parent)
	};
}

function iterateOverMethodDefinitions(iterator) {
	return {
		'MethodDefinition': iterator
	};
}

function iterateOverPropExpressions(iterator, context) {
	const sourceCode = context.getSourceCode();

	return {
		'MethodDefinition': (node) => {
			getPropertiesFromClassConstructor(node, sourceCode)
				.forEach((property) => iterator(property));
		}
	};
}

function iterateOverMethodDefinitionPairs(iterator) {
	function handle(node) {
		node.body.body.reduce((previousMethodDefinition, methodDefinition) => {
			if (previousMethodDefinition) {
				iterator(previousMethodDefinition, methodDefinition);
			}

			return methodDefinition;
		}, null);
	}

	return {
		'ClassDeclaration': handle,
		'ClassExpression': handle
	};
}

function iterateOverPropExpressionPairs(iterator, context) {
	const sourceCode = context.getSourceCode();

	return {
		'MethodDefinition': (node) => {
			getPropertiesFromClassConstructor(node, sourceCode)
				.reduce((previousPropExpression, propExpression) => {
					if (previousPropExpression) {
						iterator(previousPropExpression, propExpression);
					}

					return propExpression;
				}, null);
		}
	};
}

function iterateOverStaticExpressionPairs(iterator, context) {
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
							iterator(previousStaticExpression, staticExpression);
						}

						return staticExpression;
					}, null);
				});
		}
	};
}

function iterateOverInterfaceNodes(iterator, context) {
	const sourceCode = context.getSourceCode();

	return iterateOverClassNodes((node) => {
		if (hasJSDocTags(node, ['interface'], sourceCode)) {
			iterator(node);
		}
	});
}

function iterateOverAbstractClassNodes(iterator, context) {
	const sourceCode = context.getSourceCode();

	return iterateOverClassNodes((node) => {
		if (hasJSDocTags(node, ['abstract'], sourceCode)) {
			iterator(node);
		}
	});
}

module.exports = {
	combineIterators,
	iterateOverEnumExpressions,
	iterateOverTypedefExpressions,
	iterateOverConstantExpressions,
	iterateOverJSDocs,
	iterateOverClassNodes,
	iterateOverMethodDefinitions,
	iterateOverPropExpressions,
	iterateOverMethodDefinitionPairs,
	iterateOverPropExpressionPairs,
	iterateOverStaticExpressionPairs,
	iterateOverInterfaceNodes,
	iterateOverAbstractClassNodes
};
