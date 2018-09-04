const {hasJSDocTags, parseJSDoc} = require('./utils');

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

function getPropertiesFromClassConstructor(methodDefinition, context) {
	if (methodDefinition.kind === 'constructor') {
		return methodDefinition.value.body.body.filter((bodyChildNode) => {
			// Have to set parent here cuz ESLint interlaces nodes during AST traverse
			// But at the current moment "node.value.body.body" may be not traversed yet
			bodyChildNode.parent = methodDefinition.value.body.body;

			if (bodyChildNode.type !== 'ExpressionStatement') {
				return false;
			}

			const leftPart = bodyChildNode.expression.type === 'AssignmentExpression' ?
				bodyChildNode.expression.left.object :
				bodyChildNode.expression.object;

			return (
				leftPart &&
				leftPart.type === 'ThisExpression' &&
				hasJSDocTags(bodyChildNode, ['type', 'const'], context)
			);
		});
	}

	return [];
}

function isEnumExpression(node, context) {
	return (
		hasJSDocTags(node, ['enum'], context) &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.right.type === 'ObjectExpression' &&
		node.parent.type === 'Program'
	);
}

function isTypedefExpression(node, context) {
	return (
		hasJSDocTags(node, ['typedef'], context) &&
		node.expression.type === 'MemberExpression' &&
		node.parent.type === 'Program'
	);
}

function isConstantExpression(node, context, isStatic = true) {
	return (
		hasJSDocTags(node, ['const'], context) &&
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
	return {
		'ExpressionStatement': (node) => {
			if (isEnumExpression(node, context)) {
				iterator(node);
			}
		}
	};
}

function iterateOverTypedefExpressions(iterator, context) {
	return {
		'ExpressionStatement': (node) => {
			if (isTypedefExpression(node, context)) {
				iterator(node);
			}
		}
	};
}

function iterateOverConstantExpressions(iterator, context) {
	return {
		'MethodDefinition': (node) => {
			getPropertiesFromClassConstructor(node, context)
				.forEach((propExpression) => {
					if (isConstantExpression(propExpression, context, false)) {
						iterator(propExpression);
					}
				});
		},
		'ExpressionStatement': (node) => {
			if (isConstantExpression(node, context)) {
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
						const JSDoc = parseJSDoc(comment, context);
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
	return {
		'MethodDefinition': (node) => {
			getPropertiesFromClassConstructor(node, context)
				.forEach((property) => iterator(property));
		}
	};
}

function iterateOverMethodDefinitionPairs(iterator) {
	function handleClass(node) {
		node.body.body.reduce((previousMethodDefinition, methodDefinition) => {
			if (previousMethodDefinition) {
				iterator(previousMethodDefinition, methodDefinition);
			}

			return methodDefinition;
		}, null);
	}

	return {
		'ClassDeclaration': handleClass,
		'ClassExpression': handleClass
	};
}

function iterateOverPropExpressionPairs(iterator, context) {
	return {
		'MethodDefinition': (node) => {
			getPropertiesFromClassConstructor(node, context)
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
	const staticExpressions = [];

	return {
		'ExpressionStatement': (node) => {
			if (
				isEnumExpression(node, context) ||
				isTypedefExpression(node, context) ||
				isConstantExpression(node, context)
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
	iterateOverStaticExpressionPairs
};
