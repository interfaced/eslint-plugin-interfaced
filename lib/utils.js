const LINE_BREAK_MATCHER = /\r\n|[\r\n\u2028\u2029]/;

/**
 * Based on "morph" (https://github.com/cmoncrief/morph)
 * @param {string} input
 * @return {string}
 */
function toSnakeCaps(input) {
	let output;

	output = input.replace(/([A-Z])([A-Z][a-z])/g, '$1_$2');
	output = output.replace(/([a-z])([A-Z])/g, '$1_$2');
	output = output.replace(/[-. ]/g, '_');
	output = output.toUpperCase();

	return output;
}

/**
 * @param {Object} object
 * @return {Object}
 */
function deepShallowCopy(object) {
	const copy = {};

	// eslint-disable-next-line guard-for-in
	for (const key in object) {
		copy[key] = object[key];
	}

	return copy;
}

/**
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @return {string}
 */
function getIndent(node, sourceCode) {
	const line = sourceCode.lines[node.loc.start.line - 1];
	const indentMatch = line.match(/^(\s)*/);

	return indentMatch ? indentMatch[0] : '';
}

/**
 * @param {string} original
 * @param {string} content
 * @param {string} indent
 * @return {string}
 */
function wrapJSDocContent(original, content, indent) {
	const head = original.match(/^(\*?)(\s*)/)[0];
	const tail = original.match(/(\s*)$/)[0];

	let lines = content.split(LINE_BREAK_MATCHER)
		.join(`\n${indent} * `);

	if (LINE_BREAK_MATCHER.test(head)) {
		lines = '* ' + lines;
	}

	return `/*${head}${lines}${tail}*/`;
}

/**
 * @param {string} text
 * @param {string} textToInsert
 * @param {number} start
 * @param {number} end
 * @return {string}
 */
function insertIntoText(text, textToInsert, start, end) {
	const head = text.slice(0, start);
	const tail = text.slice(end);

	return `${head}${textToInsert}${tail}`;
}

/**
 * @param {ASTNode} nodeA
 * @param {ASTNode} nodeB
 * @param {number} newlinesAmount
 * @param {SourceCodeFixer} fixer
 * @param {SourceCode} sourceCode
 * @return {Object}
 */
function fixNewlinesBetweenNodes(nodeA, nodeB, newlinesAmount, fixer, sourceCode) {
	const indent = getIndent(nodeB, sourceCode);
	const newlines = new Array(newlinesAmount + 1)
		.fill('\n')
		.join('');

	return fixer.replaceTextRange([nodeA.range[1], nodeB.range[0]], newlines + indent);
}

/**
 * @param {JSDoc} JSDoc
 * @param {number} start
 * @param {number} end
 * @param {string} text
 * @param {SourceCodeFixer} fixer
 * @param {SourceCode} sourceCode
 * @return {Object}
 */
function fixTextInJSDocInterval(JSDoc, start, end, text, fixer, sourceCode) {
	const indent = getIndent(JSDoc.source, sourceCode);
	const fixed = insertIntoText(JSDoc.content, text, start, end);
	const wrapped = wrapJSDocContent(JSDoc.source.value, fixed, indent);

	return fixer.replaceTextRange(JSDoc.source.range, wrapped);
}

/**
 * @param {JSDoc} JSDoc
 * @param {JSDocTokenWithRange} tokenA
 * @param {JSDocTokenWithRange} tokenB
 * @param {string} text
 * @param {SourceCodeFixer} fixer
 * @param {SourceCode} sourceCode
 * @return {Object}
 */
function fixTextBetweenJSDocTokens(JSDoc, tokenA, tokenB, text, fixer, sourceCode) {
	return fixTextInJSDocInterval(JSDoc, tokenA.range[1], tokenB.range[0], text, fixer, sourceCode);
}

module.exports = {
	LINE_BREAK_MATCHER,
	toSnakeCaps,
	deepShallowCopy,
	getIndent,
	wrapJSDocContent,
	insertIntoText,
	fixNewlinesBetweenNodes,
	fixTextInJSDocInterval,
	fixTextBetweenJSDocTokens
};
