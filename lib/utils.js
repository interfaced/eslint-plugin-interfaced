function fixNewlinesBetween(nodeA, nodeB, newlinesAmount, fixer, sourceCode) {
	const newlines = new Array(newlinesAmount + 1);
	const newlinesContent = newlines.fill('\n').join('');

	// Preserve all whitespace characters before "nodeB"
	const nodeBStartLineContent = sourceCode.lines[nodeB.loc.start.line - 1];
	const whitespacesMatch = nodeBStartLineContent.match(/(\s)*/g);
	const whitespacesContent = whitespacesMatch ? whitespacesMatch[0] : '';

	return fixer.replaceTextRange([nodeA.range[1], nodeB.range[0]], newlinesContent + whitespacesContent);
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

function deepShallowCopy(object) {
	const copy = {};

	// eslint-disable-next-line guard-for-in
	for (const key in object) {
		copy[key] = object[key];
	}

	return copy;
}

module.exports = {
	fixNewlinesBetween,
	toSnakeCaps,
	deepShallowCopy
};
