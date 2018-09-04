const doctrine = require('doctrine');
const JSDocTokenizer = require('./jsdoc-tokenizer');

const JSDocTypeTokenizer = new JSDocTokenizer({
	type: true,
	range: true
});

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {boolean}
 */
function isEnumExpression(node, sourceCode) {
	return (
		hasJSDocTags(node, ['enum'], sourceCode) &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.right.type === 'ObjectExpression' &&
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
		hasJSDocTags(node, ['typedef'], sourceCode) &&
		node.expression.type === 'MemberExpression' &&
		node.parent.type === 'Program'
	);
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @param {boolean=} isStatic
 * @return {boolean}
 */
function isConstantExpression(node, sourceCode, isStatic = true) {
	return (
		hasJSDocTags(node, ['const'], sourceCode) &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.left.property.type === 'Identifier' &&
		(isStatic ? node.parent.type === 'Program' : true)
	);
}

/**
 * @param {ASTNode} node
 * @return {boolean}
 */
function isClass(node) {
	return (
		node.type === 'ClassDeclaration' ||
		(
			node.type === 'ExpressionStatement' &&
			node.expression.type === 'AssignmentExpression' &&
			node.expression.right.type === 'ClassExpression'
		)
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
 * @param {ASTNode} propExpression
 * @return {string}
 */
function resolvePropName(propExpression) {
	return propExpression.expression.type === 'MemberExpression' ?
		propExpression.expression.property.name :
		propExpression.expression.left.property.name;
}

/**
 * @param {ASTNode} classNode
 * @return {string}
 */
function resolveClassName(classNode) {
	return classNode.expression && classNode.expression.type === 'AssignmentExpression' ?
		classNode.expression.left.type === 'MemberExpression' ?
			classNode.expression.left.property.name :
			classNode.expression.left.name :
		classNode.id.name;
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
 * @param {ASTNode} methodDefinition
 * @param {SourceCode} sourceCode
 * @return {Array<ASTNode>}
 */
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

/**
 * @param {ASTNode} memberExpression
 * @return {ASTNode}
 */
function getMemberExpressionRootIdentifier(memberExpression) {
	let object = memberExpression.object;
	while (object.type !== 'Identifier') {
		object = object.object;
	}

	return object;
}

/**
 * @param {Array<ASTNode>} expressions
 * @return {Object<string|symbol, Array<ASTNode>>}
 */
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

	const content = doctrine.unwrapComment(comment.value);

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
 * @param {JSDoc} JSDoc
 * @param {JSDocTag} tag
 * @return {Array<JSDocTokenWithRange>}
 */
function getJSDocTagTokens(JSDoc, tag) {
	return JSDocTypeTokenizer.tokenize(JSDoc.content.slice(...tag.range))
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
function getJSDocTypeTokens(JSDoc, type) {
	return JSDocTypeTokenizer.tokenize(JSDoc.content.slice(...type.range))
		.map((token) => {
			token.range[0] += type.range[0];
			token.range[1] += type.range[0];

			return token;
		});
}

/**
 * @param {Array<JSDocTokenWithRange>} topTypeTokens
 * @param {JSDocType} type
 * @return {Array<JSDocTokenWithRange>}
 */
function getJSDocSubtypeTokens(topTypeTokens, type) {
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
 * @param {JSDocTokenWithRange} token
 * @param {{
 *     requiredType: (string|undefined),
 *     requiredValue: (string|undefined),
 *     moveForward: (boolean|undefined)
 * }=} options
 * @return {?JSDocTokenWithRange}
 */
function findFirstNonWhitespaceSiblingToken(tokens, token, {
	requiredType,
	requiredValue,
	moveForward = true
} = {}) {
	let currentToken = token;

	while (currentToken) {
		currentToken = moveForward ?
			getJSDocTokenAfter(tokens, currentToken) :
			getJSDocTokenBefore(tokens, currentToken);

		if (!currentToken) {
			return null;
		}

		if (currentToken.type === 'Whitespace') {
			continue;
		}

		if (
			(!requiredType || currentToken.type === requiredType) &&
			(!requiredValue || currentToken.value === requiredValue)
		) {
			return currentToken;
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
	isEnumExpression,
	isTypedefExpression,
	isConstantExpression,
	isClass,
	isTypecast,
	resolvePropName,
	resolveClassName,
	resolveParamNames,
	getPropsFromClassConstructor,
	groupStaticExpressions,
	getJSDocComment,
	parseJSDoc,
	hasJSDocTags,
	getJSDocDescription,
	getJSDocTagContent,
	getJSDocTypeContent,
	getJSDocTagTokens,
	getJSDocTypeTokens,
	getJSDocSubtypeTokens,
	getJSDocTokenBefore,
	getJSDocTokenAfter,
	findFirstNonWhitespaceSiblingToken,
	getScopeFromJSDoc,
	getStaticTypeFromJSDoc,
	traverseJSDocType
};
