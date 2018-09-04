const doctrine = require('doctrine');

function getJSDocComment(node, context) {
	const sourceCode = context.getSourceCode();

	switch (node.type) {
		case 'Identifier':
		case 'ExpressionStatement':
			if (node.leadingComments && node.leadingComments.length) {
				return node.leadingComments.find((comment) => comment.type === 'Block') || null;
			}
			break;

		case 'MethodDefinition':
			// Parent may be not defined if "node.value" is not traversed yet
			node.value.parent = node;

			return sourceCode.getJSDocComment(node.value);

		default:
			return sourceCode.getJSDocComment(node);
	}

	return null;
}

function hasJSDocTags(node, tags, context) {
	const JSDocComment = getJSDocComment(node, context);
	if (!JSDocComment) {
		return false;
	}

	const JSDoc = doctrine.parse(JSDocComment.value, {
		strict: true,
		unwrap: true,
		sloppy: true
	});

	return JSDoc.tags.some((tag) => tags.includes(tag.title.toLowerCase()));
}

function getJSDocDescription(node, context) {
	const JSDocComment = getJSDocComment(node, context);
	if (!JSDocComment) {
		return null;
	}

	const JSDoc = doctrine.parse(JSDocComment.value, {
		strict: true,
		unwrap: true,
		sloppy: true
	});

	return JSDoc.description;
}

function getScopeFromJSDoc(node, context) {
	if (hasJSDocTags(node, ['public'], context)) {
		return 'public';
	}

	if (hasJSDocTags(node, ['protected'], context)) {
		return 'protected';
	}

	if (hasJSDocTags(node, ['private'], context)) {
		return 'private';
	}

	return null;
}

function getStaticTypeFromJSDoc(node, context) {
	if (hasJSDocTags(node, ['const'], context)) {
		return 'const';
	}

	if (hasJSDocTags(node, ['enum'], context)) {
		return 'enum';
	}

	if (hasJSDocTags(node, ['typedef'], context)) {
		return 'typedef';
	}

	return null;
}

function getStartLineIncludingComments(node) {
	let nodeStartLine = node.loc.start.line;

	if (node.leadingComments && node.leadingComments.length) {
		node.leadingComments.forEach((comment) => {
			if (comment.loc.start.line < nodeStartLine) {
				nodeStartLine = comment.loc.start.line;
			}
		});
	}

	return nodeStartLine;
}

function getFirstComment(node) {
	if (node.leadingComments && node.leadingComments.length) {
		return node.leadingComments[0];
	}

	return null;
}

function getPropertiesFromConstructor(node, context) {
	if (node.kind === 'constructor') {
		return node.value.body.body.filter((bodyChildNode) => {
			// Have to set parent here cuz ESLint interlaces nodes during AST traverse
			// But at the current moment "node.value.body.body" may be not traversed yet
			bodyChildNode.parent = node.value.body.body;

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

function getMethodName(methodADefinition) {
	return methodADefinition.key.name;
}

function getPropertyName(propExpression) {
	return propExpression.expression.type === 'MemberExpression' ?
		propExpression.expression.property.name :
		propExpression.expression.left.property.name;
}

function getMemberExpressionRootIdentifier(memberExpression) {
	let object = memberExpression.object;
	while (object.type !== 'Identifier') {
		object = object.object;
	}

	return object;
}

function groupExpressions(expressions) {
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

function fixNewlinesBetween(nodeA, nodeB, newlinesCount, fixer, context) {
	const sourceCode = context.getSourceCode();

	const newlines = new Array(newlinesCount + 1);
	const newlinesContent = newlines.fill('\n').join('');

	// Preserve all whitespace characters before "nodeB"
	const nodeBStartLineContent = sourceCode.lines[nodeB.loc.start.line - 1];
	const whitespacesMatch = nodeBStartLineContent.match(/(\s)*/g);
	const whitespacesContent = whitespacesMatch ? whitespacesMatch[0] : '';

	return fixer.replaceTextRange([nodeA.range[1], nodeB.range[0]], newlinesContent + whitespacesContent);
}

module.exports = {
	getJSDocComment,
	hasJSDocTags,
	getJSDocDescription,
	getScopeFromJSDoc,
	getStaticTypeFromJSDoc,
	getStartLineIncludingComments,
	getFirstComment,
	getPropertiesFromConstructor,
	getMethodName,
	getPropertyName,
	getMemberExpressionRootIdentifier,
	groupExpressions,
	fixNewlinesBetween
};
