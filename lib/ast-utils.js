const doctrine = require('doctrine');
const JSDocTokenizer = require('./jsdoc-tokenizer');

const JSDocTokenizers = {
	default: new JSDocTokenizer({
		range: true
	}),
	type: new JSDocTokenizer({
		type: true,
		range: true
	})
};

/**
 * @param {ASTNode} node
 * @return {boolean}
 */
function isClass(node) {
	return node.type === 'ClassDeclaration' || (
		(
			node.type === 'ExpressionStatement' &&
			node.expression.type === 'AssignmentExpression' &&
			node.expression.right.type === 'ClassExpression'
		) ||
		(
			node.type === 'VariableDeclaration' &&
			node.declarations.length === 1 &&
			node.declarations[0].init &&
			node.declarations[0].init.type === 'ClassExpression'
		)
	);
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {boolean}
 */
function isEnumExpression(node, sourceCode) {
	return (
		hasJSDocTags(node, ['enum'], sourceCode) && (
			(
				node.type === 'ExpressionStatement' &&
				node.expression.type === 'AssignmentExpression' &&
				node.expression.right.type === 'ObjectExpression'
			) ||
			(
				node.type === 'VariableDeclaration' &&
				node.declarations.length === 1 &&
				node.declarations[0].init &&
				node.declarations[0].init.type === 'ObjectExpression'
			)
		) &&
		node.parent.type === 'Program'
	);
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {boolean}
 */
function isTypedefExpression(node, sourceCode) {
	return (
		hasJSDocTags(node, ['typedef'], sourceCode) && (
			(
				node.type === 'ExpressionStatement' &&
				node.expression.type === 'MemberExpression'
			) ||
			(
				node.type === 'VariableDeclaration' &&
				node.declarations.length === 1 &&
				node.declarations[0].init === null
			)
		) &&
		node.parent.type === 'Program'
	);
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @param {{
 *     isStatic: (boolean|undefined)
 * }=} options
 * @return {boolean}
 */
function isConstantExpression(node, sourceCode, {isStatic = true} = {}) {
	return (
		hasJSDocTags(node, ['const'], sourceCode) &&
		node.type === 'ExpressionStatement' &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.left.property.type === 'Identifier' &&
		(isStatic ? node.parent.type === 'Program' : true)
	);
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {boolean}
 */
function isPropExpression(node, sourceCode) {
	if (node.type !== 'ExpressionStatement') {
		return false;
	}

	if (!/AssignmentExpression|MemberExpression/.test(node.expression.type)) {
		return false;
	}

	const lhs = node.expression.type === 'AssignmentExpression' ?
		node.expression.left.object :
		node.expression.object;

	return (
		lhs &&
		lhs.type === 'ThisExpression' &&
		hasJSDocTags(node, ['type', 'const'], sourceCode)
	);
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {boolean}
 */
function isTypecast(node, sourceCode) {
	const tokenBefore = sourceCode.getTokenBefore(node, {
		includeComments: true
	});

	const tokenAfter = sourceCode.getTokenAfter(node, {
		includeComments: true
	});

	return (
		tokenBefore &&
		tokenBefore.type === 'Punctuator' &&
		tokenBefore.value === '(' &&
		hasJSDocTags(tokenBefore, ['type'], sourceCode) &&

		tokenAfter &&
		tokenAfter.type === 'Punctuator' &&
		tokenAfter.value === ')'
	);
}

/**
 * @param {ASTNode} classNode
 * @return {?string}
 */
function resolveClassName(classNode) { // eslint-disable-line consistent-return
	switch (classNode.type) {
		case 'ExpressionStatement':
			return classNode.expression.left.type === 'MemberExpression' ?
				classNode.expression.left.property.name :
				classNode.expression.left.name;

		case 'ClassDeclaration':
			// An anonymous class declaration. e.g. "export default class {}"
			return classNode.id ? classNode.id.name : null;

		case 'VariableDeclaration':
			return classNode.declarations[0].id.name;
	}
}

/**
 * @param {ASTNode} enumExpression
 * @return {string}
 */
function resolveEnumName(enumExpression) {
	return enumExpression.type === 'ExpressionStatement' ?
		enumExpression.expression.left.property.name :
		enumExpression.declarations[0].id.name;
}

/**
 * @param {ASTNode} typedefExpression
 * @return {string}
 */
function resolveTypedefName(typedefExpression) {
	return typedefExpression.type === 'ExpressionStatement' ?
		typedefExpression.expression.property.name :
		typedefExpression.declarations[0].id.name;
}

/**
 * @param {ASTNode} constantExpression
 * @return {string}
 */
function resolveConstantName(constantExpression) {
	return constantExpression.expression.left.property.name;
}

/**
 * @param {ASTNode} propExpression
 * @return {?string}
 */
function resolvePropName(propExpression) {
	return propExpression.expression.type === 'MemberExpression' ?
		propExpression.expression.property.name :
		propExpression.expression.left.property.name;
}

/**
 * @param {ASTNode} param
 * @return {Array<string>}
 */
function resolveParamNames(param) {
	let node;
	switch (param.type) {
		case 'Identifier':
		case 'ObjectPattern':
			node = param;
			break;

		case 'AssignmentPattern':
			node = param.left;
			break;

		case 'RestElement':
			node = param.argument;
			break;

		default:
			return [];
	}

	switch (node.type) {
		case 'Identifier':
			return [node.name];

		case 'ObjectPattern':
			return node.properties.map((property) => property.key.name);

		default:
			return [];
	}
}

/**
 * @param {Scope} scope
 * @return {Array<ASTNode>}
 */
function getScopeBody(scope) {
	return /Function/.test(scope.block.type) ? scope.block.body.body : scope.block.body;
}

/**
 * @param {Scope} scope
 * @return {Array<number>}
 */
function getScopeRange(scope) {
	return /Function/.test(scope.block.type) ? scope.block.body.range : scope.block.range;
}

/**
 * @param {ASTNode} methodDefinition
 * @param {SourceCode} sourceCode
 * @return {Array<ASTNode>}
 */
function getPropsFromClassConstructor(methodDefinition, sourceCode) {
	if (methodDefinition.kind !== 'constructor') {
		return [];
	}

	return methodDefinition.value.body.body.filter((node) => isPropExpression(node, sourceCode));
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {?ASTComment}
 */
function getJSDocComment(node, sourceCode) {
	const sourceCodeComment = sourceCode.getJSDocComment(node);
	if (sourceCodeComment) {
		return sourceCodeComment;
	}

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

/**
 * @param {ASTComment} comment
 * @return {?JSDoc}
 */
function parseJSDoc(comment) {
	if (comment.type !== 'Block') {
		return null;
	}

	const content = doctrine.unwrapComment(comment.value)
		.replace(/^\s*/, ''); // Remove heading whitespace

	let JSDoc = null;
	try {
		JSDoc = doctrine.parse(content, {
			strict: true,
			sloppy: true,
			lineNumbers: true,
			range: true
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

	// Keep unwrapped content
	JSDoc.content = content;

	return JSDoc;
}

/**
 * @param {JSDoc} JSDoc
 * @param {JSDocTag} tag
 * @return {Array<JSDocTokenWithRange>}
 */
function parseJSDocTag(JSDoc, tag) {
	return JSDocTokenizers.default.tokenize(JSDoc.content.slice(...tag.range))
		.map((token) => {
			token.range[0] += tag.range[0];
			token.range[1] += tag.range[0];

			return token;
		});
}

/**
 * @param {JSDoc} JSDoc
 * @param {JSDocType} type
 * @return {Array<JSDocTokenWithRange>}
 */
function parseJSDocType(JSDoc, type) {
	return JSDocTokenizers.type.tokenize(JSDoc.content.slice(...type.range))
		.map((token) => {
			token.range[0] += type.range[0];
			token.range[1] += type.range[0];

			return token;
		});
}

/**
 * @param {ASTNode} node
 * @param {Array<string>} tags
 * @param {SourceCode} sourceCode
 * @return {boolean}
 */
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

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {string}
 */
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

/**
 * @param {JSDoc} JSDoc
 * @param {JSDocTag} tag
 * @return {string}
 */
function getJSDocTagContent(JSDoc, tag) {
	return JSDoc.content.slice(...tag.range);
}

/**
 * @param {JSDoc} JSDoc
 * @param {JSDocType} type
 * @return {string}
 */
function getJSDocTypeContent(JSDoc, type) {
	return JSDoc.content.slice(...type.range);
}

/**
 * @param {Array<JSDocTokenWithRange>} topTypeTokens
 * @param {JSDocType} type
 * @return {Array<JSDocTokenWithRange>}
 */
function getJSDocTypeTokens(topTypeTokens, type) {
	return topTypeTokens.filter((token) =>
		(token.range[0] >= type.range[0]) &&
		(token.range[1] <= type.range[1])
	);
}

/**
 * @param {Array<JSDocTokenWithRange>} tokens
 * @param {JSDocTokenWithRange} targetToken
 * @return {?JSDocTokenWithRange}
 */
function getJSDocTokenBefore(tokens, targetToken) {
	return tokens.find((token) => token.range[1] === targetToken.range[0]) || null;
}

/**
 * @param {Array<JSDocTokenWithRange>} tokens
 * @param {JSDocTokenWithRange} targetToken
 * @return {?JSDocTokenWithRange}
 */
function getJSDocTokenAfter(tokens, targetToken) {
	return tokens.find((token) => token.range[0] === targetToken.range[1]) || null;
}

/**
 * @param {Array<JSDocTokenWithRange>} tokens
 * @param {JSDocTokenWithRange} tokenA
 * @param {JSDocTokenWithRange} tokenB
 * @return {Array<JSDocTokenWithRange>}
 */
function getJSDocTokensBetween(tokens, tokenA, tokenB) {
	const tokensBetween = [];

	let cursor = tokenA;
	while (cursor) {
		cursor = getJSDocTokenAfter(tokens, cursor);

		if (!cursor || cursor.range[0] === tokenB.range[0]) {
			break;
		}

		tokensBetween.push(cursor);
	}

	return tokensBetween;
}

/**
 * @param {Array<JSDocTokenWithRange>} tokens
 * @param {{
 *     type: (string|undefined),
 *     value: (string|undefined)
 * }=} options
 * @return {?JSDocTokenWithRange}
 */
function findFirstJSDocToken(tokens, {type, value}) {
	return tokens.find((token) => (!type || token.type === type) && (!value || token.value === value)) || null;
}

/**
 * @param {Array<JSDocTokenWithRange>} tokens
 * @param {{
 *     type: (string|undefined),
 *     value: (string|undefined)
 * }=} options
 * @return {?JSDocTokenWithRange}
 */
function findLastJSDocToken(tokens, {type, value}) {
	return findFirstJSDocToken(tokens.slice().reverse(), {type, value});
}

/**
 * @param {Array<JSDocTokenWithRange>} tokens
 * @param {JSDocTokenWithRange} token
 * @param {{
 *     type: (string|undefined),
 *     value: (string|undefined),
 *     moveForward: (boolean|undefined)
 * }=} options
 * @return {?JSDocTokenWithRange}
 */
function findNonWhitespaceSiblingJSDocToken(tokens, token, {type, value, moveForward = true} = {}) {
	let cursor = token;
	while (cursor) {
		cursor = moveForward ?
			getJSDocTokenAfter(tokens, cursor) :
			getJSDocTokenBefore(tokens, cursor);

		if (!cursor) {
			return null;
		}

		if (cursor.type === 'Whitespace') {
			continue;
		}

		if ((!type || cursor.type === type) && (!value || cursor.value === value)) {
			return cursor;
		}

		return null;
	}

	return null;
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {?string}
 */
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

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {?string}
 */
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

/**
 * @param {JSDocType} type
 * @param {function(JSDocType)} callback
 */
function traverseJSDocType(type, callback) {
	callback(type);

	switch (type.type) {
		case 'NullableType':
		case 'NonNullableType':
		case 'OptionalType':
		case 'RestType':
			traverseJSDocType(type.expression, callback);

			break;

		case 'TypeApplication':
			type.applications.forEach((application) =>
				traverseJSDocType(application, callback)
			);

			traverseJSDocType(type.expression, callback);

			break;

		case 'FunctionType':
			type.params.forEach((param) => {
				traverseJSDocType(param, callback);
			});

			if (type.result) {
				traverseJSDocType(type.result, callback);
			}

			if (type.this) {
				traverseJSDocType(type.this, callback);
			}

			break;

		case 'RecordType':
			type.fields.forEach((field) =>
				traverseJSDocType(field.value, callback)
			);

			break;

		case 'UnionType':
			type.elements.forEach((element) =>
				traverseJSDocType(element, callback)
			);

			break;
	}
}

module.exports = {
	isClass,
	isEnumExpression,
	isTypedefExpression,
	isConstantExpression,
	isPropExpression,
	isTypecast,
	resolvePropName,
	resolveClassName,
	resolveEnumName,
	resolveTypedefName,
	resolveConstantName,
	resolveParamNames,
	getScopeBody,
	getScopeRange,
	getPropsFromClassConstructor,
	getJSDocComment,
	parseJSDoc,
	parseJSDocTag,
	parseJSDocType,
	hasJSDocTags,
	getJSDocDescription,
	getJSDocTagContent,
	getJSDocTypeContent,
	getJSDocTypeTokens,
	getJSDocTokenBefore,
	getJSDocTokenAfter,
	getJSDocTokensBetween,
	getScopeFromJSDoc,
	getStaticTypeFromJSDoc,
	findFirstJSDocToken,
	findLastJSDocToken,
	findNonWhitespaceSiblingJSDocToken,
	traverseJSDocType
};
