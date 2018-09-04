const doctrine = require('doctrine');

function findJSDocComment(node, sourceCode) {
	const tokenBefore = sourceCode.getTokenBefore(node, {
		includeComments: true
	});

	if (
		tokenBefore &&
		tokenBefore.type === 'Block' &&
		node.loc.start.line - tokenBefore.loc.end.line <= 1
	) {
		return tokenBefore;
	}

	return null;
}

function getJSDocComment(node, sourceCode) {
	let parent = node.parent;

	switch (node.type) {
		case 'ClassExpression':
			return findJSDocComment(parent.parent, sourceCode);

		case 'ArrowFunctionExpression':
		case 'FunctionExpression':
			if (parent.type !== 'CallExpression' && parent.type !== 'NewExpression') {
				while (
					!sourceCode.getCommentsBefore(parent).length &&
					!/Function/.test(parent.type) &&
					parent.type !== 'MethodDefinition' &&
					parent.type !== 'Property'
				) {
					parent = parent.parent;

					if (!parent) {
						break;
					}
				}

				if (parent && parent.type !== 'FunctionDeclaration' && parent.type !== 'Program') {
					return findJSDocComment(parent, sourceCode);
				}
			}

			return findJSDocComment(node, sourceCode);

		default:
			return findJSDocComment(node, sourceCode);
	}
}

function parseJSDoc(comment) {
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

function hasJSDocTags(node, tags, sourceCode) {
	const JSDocComment = getJSDocComment(node, sourceCode);
	if (!JSDocComment) {
		return false;
	}

	const JSDoc = parseJSDoc(JSDocComment);
	if (!JSDoc) {
		return false;
	}

	return JSDoc.tags.some((tag) => tags.includes(tag.title.toLowerCase()));
}

function getJSDocDescription(node, sourceCode) {
	const JSDocComment = getJSDocComment(node, sourceCode);
	if (!JSDocComment) {
		return '';
	}

	const JSDoc = parseJSDoc(JSDocComment);
	if (!JSDoc) {
		return '';
	}

	return JSDoc.description;
}

function getJSDocTagContent(JSDoc, tag) {
	if (!JSDoc.tags.includes(tag)) {
		throw new Error(`Tag "${tag.title}" doesn't belong to given JSDoc`);
	}

	const commentLines = JSDoc.source.value.split('\n');
	const nextTag = JSDoc.tags[JSDoc.tags.indexOf(tag) + 1];

	return commentLines.slice(tag.lineNumber, nextTag && nextTag.lineNumber)
		.map((line) => line.replace(new RegExp('(?:[ \\t]*)\\*'), ''))
		.join('\n')
		.replace(new RegExp(`(?:[ \\t]*)@${tag.title}(?:[ \\t]*)`), '')
		.replace(tag.description || '', '')
		.trim();
}

function getScopeFromJSDoc(node, sourceCode) {
	if (hasJSDocTags(node, ['public'], sourceCode)) {
		return 'public';
	}

	if (hasJSDocTags(node, ['protected'], sourceCode)) {
		return 'protected';
	}

	if (hasJSDocTags(node, ['private'], sourceCode)) {
		return 'private';
	}

	return null;
}

function getStaticTypeFromJSDoc(node, sourceCode) {
	if (hasJSDocTags(node, ['const'], sourceCode)) {
		return 'const';
	}

	if (hasJSDocTags(node, ['enum'], sourceCode)) {
		return 'enum';
	}

	if (hasJSDocTags(node, ['typedef'], sourceCode)) {
		return 'typedef';
	}

	return null;
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

module.exports = {
	getJSDocComment,
	parseJSDoc,
	hasJSDocTags,
	getJSDocDescription,
	getJSDocTagContent,
	getScopeFromJSDoc,
	getStaticTypeFromJSDoc,
	traverseJSDocType
};
