const doctrine = require('doctrine');

function getJSDocComment(node, context) {
	const sourceCode = context.getSourceCode();

	if (node.type === 'MethodDefinition') {
		// Parent may be not defined if "node.value" is not traversed yet
		node.value.parent = node;
		node = node.value; // eslint-disable-line no-param-reassign
	}

	const getBySourceCode = (node) => sourceCode.getJSDocComment(node);
	const getByFallback = (node) => sourceCode.getCommentsBefore(node)
		.find((comment) => comment.type === 'Block');

	return getBySourceCode(node) || getByFallback(node) || null;
}

function parseJSDoc(comment, context) {
	if (comment.type !== 'Block') {
		return null;
	}

	let JSDoc = null;
	try {
		JSDoc = doctrine.parse(comment.value, {
			strict: true,
			unwrap: true,
			sloppy: true,
			lineNumbers: true
		});
	} catch (e) {
		// Can't parse JSDoc
		if (e instanceof doctrine.Error) {
			return null;
		}

		throw e;
	}

	// Keep source comment
	JSDoc.source = comment;

	return JSDoc;
}

function hasJSDocTags(node, tags, context) {
	const JSDocComment = getJSDocComment(node, context);
	if (!JSDocComment) {
		return false;
	}

	const JSDoc = parseJSDoc(JSDocComment, context);
	if (!JSDoc) {
		return false;
	}

	return JSDoc.tags.some((tag) => tags.includes(tag.title.toLowerCase()));
}

function getJSDocDescription(node, context) {
	const JSDocComment = getJSDocComment(node, context);
	if (!JSDocComment) {
		return '';
	}

	const JSDoc = parseJSDoc(JSDocComment, context);
	if (!JSDoc) {
		return '';
	}

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

function getStartLineIncludingComments(node, context) {
	const sourceCode = context.getSourceCode();
	const commentsBefore = sourceCode.getCommentsBefore(node);

	let nodeStartLine = node.loc.start.line;
	commentsBefore.forEach((comment) => {
		if (comment.loc.start.line < nodeStartLine) {
			nodeStartLine = comment.loc.start.line;
		}
	});

	return nodeStartLine;
}

function getFirstComment(node, context) {
	const sourceCode = context.getSourceCode();
	const commentsBefore = sourceCode.getCommentsBefore(node);

	return commentsBefore[0] || null;
}

function getMethodName(methodADefinition) {
	return methodADefinition.key.name;
}

function getPropertyName(propExpression) {
	return propExpression.expression.type === 'MemberExpression' ?
		propExpression.expression.property.name :
		propExpression.expression.left.property.name;
}

function fixNewlinesBetween(nodeA, nodeB, newlinesAmount, fixer, context) {
	const sourceCode = context.getSourceCode();

	const newlines = new Array(newlinesAmount + 1);
	const newlinesContent = newlines.fill('\n').join('');

	// Preserve all whitespace characters before "nodeB"
	const nodeBStartLineContent = sourceCode.lines[nodeB.loc.start.line - 1];
	const whitespacesMatch = nodeBStartLineContent.match(/(\s)*/g);
	const whitespacesContent = whitespacesMatch ? whitespacesMatch[0] : '';

	return fixer.replaceTextRange([nodeA.range[1], nodeB.range[0]], newlinesContent + whitespacesContent);
}

function traverseJSDocType(type, traverseCallback) {
	traverseCallback(type);

	switch (type.type) {
		case 'NullableType':
		case 'NonNullableType':
		case 'OptionalType':
		case 'RestType':
			traverseJSDocType(type.expression, traverseCallback);

			break;

		case 'TypeApplication':
			type.applications.forEach((application) =>
				traverseJSDocType(application, traverseCallback)
			);

			traverseJSDocType(type.expression, traverseCallback);

			break;

		case 'FunctionType':
			type.params.forEach((param, index) => {
				traverseJSDocType(param, traverseCallback);
			});

			if (type.result) {
				traverseJSDocType(type.result, traverseCallback);
			}

			if (type.this) {
				traverseJSDocType(type.this, traverseCallback);
			}

			break;

		case 'RecordType':
			type.fields.forEach((field) =>
				traverseJSDocType(field.value, traverseCallback)
			);

			break;

		case 'UnionType':
			type.elements.forEach((element) =>
				traverseJSDocType(element, traverseCallback)
			);

			break;
	}
}

// Based on "morph" (https://github.com/cmoncrief/morph) source code
function toSnakeCaps(input) {
	let output;

	output = input.replace(/([A-Z])([A-Z][a-z])/g, '$1_$2');
	output = output.replace(/([a-z])([A-Z])/g, '$1_$2');
	output = output.replace(/[-. ]/g, '_');
	output = output.toUpperCase();

	return output;
}

function shallowCopy(object) {
	const copy = {};

	// eslint-disable-next-line guard-for-in
	for (const key in object) {
		copy[key] = object[key];
	}

	return copy;
}

module.exports = {
	getJSDocComment,
	parseJSDoc,
	hasJSDocTags,
	getJSDocDescription,
	getScopeFromJSDoc,
	getStaticTypeFromJSDoc,
	getStartLineIncludingComments,
	getFirstComment,
	getMethodName,
	getPropertyName,
	fixNewlinesBetween,
	traverseJSDocType,
	toSnakeCaps,
	shallowCopy
};
