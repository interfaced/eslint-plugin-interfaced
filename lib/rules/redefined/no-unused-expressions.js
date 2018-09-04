const originalRule = require('eslint/lib/rules/no-unused-expressions');

const {hasJSDocTags} = require('../../jsdoc');
const {isTypedefExpression} = require('../../ast');
const {deepShallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = deepShallowCopy(context);

		contextCopy.report = (error) => {
			const isTypedef = isTypedefExpression(error.node, sourceCode);

			const isPropDefinitionInConstructor = (
				hasJSDocTags(error.node, ['type', 'const'], sourceCode) &&
				error.node.expression.type === 'MemberExpression' &&
				error.node.expression.object.type === 'ThisExpression' &&

				error.node.parent.type === 'BlockStatement' &&
				error.node.parent.parent.type === 'FunctionExpression' &&
				error.node.parent.parent.parent.type === 'MethodDefinition' &&
				error.node.parent.parent.parent.kind === 'constructor'
			);

			const isPropDefinitionInPrototype = (
				hasJSDocTags(error.node, ['type', 'const'], sourceCode) &&
				error.node.expression.type === 'MemberExpression' &&
				error.node.expression.object.type === 'MemberExpression' &&
				error.node.expression.object.property.name === 'prototype'
			);

			if (isTypedef || isPropDefinitionInConstructor || isPropDefinitionInPrototype) {
				return;
			}

			context.report(error);
		};

		return originalRule.create(contextCopy);
	}
};
