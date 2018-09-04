const {hasJSDocTags} = require('./jsdoc');

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

function resolvePropName(propExpression) {
	return propExpression.expression.type === 'MemberExpression' ?
		propExpression.expression.property.name :
		propExpression.expression.left.property.name;
}

function resolveClassName(classNode) {
	return classNode.expression && classNode.expression.type === 'AssignmentExpression' ?
		classNode.expression.left.type === 'MemberExpression' ?
			classNode.expression.left.property.name :
			classNode.expression.left.name :
		classNode.id.name;
}

function resolveParamNames(param) {
	switch (param.type) {
		case 'Identifier':
		case 'ObjectPattern':
			return extractParamNames(param);

		case 'AssignmentPattern':
			return extractParamNames(param.left);

		case 'RestElement':
			return extractParamNames(param.argument);

		default:
			return [];
	}
}

function extractParamNames(node) {
	switch (node.type) {
		case 'Identifier':
			return [node.name];

		case 'ObjectPattern':
			return node.properties.map((property) => property.key.name);

		default:
			return [];
	}
}

function getPropsFromClassConstructor(methodDefinition, sourceCode) {
	if (methodDefinition.kind !== 'constructor') {
		return [];
	}

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

module.exports = {
	isEnumExpression,
	isTypedefExpression,
	isConstantExpression,
	resolvePropName,
	resolveClassName,
	resolveParamNames,
	getPropsFromClassConstructor,
	groupStaticExpressions
};
