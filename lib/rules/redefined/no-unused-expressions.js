const originalRule = require('eslint/lib/rules/no-unused-expressions');

const {isTypedefExpression, hasJSDocTags} = require('../../ast-utils');
const {deepShallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = deepShallowCopy(context);

		contextCopy.report = (error) => {
			const {node} = error;

			const isTypedef = isTypedefExpression(node, sourceCode);

			const isPropDefinitionInConstructor = (
				hasJSDocTags(node, ['type', 'const'], sourceCode) &&
				node.expression.type === 'MemberExpression' &&
				node.expression.object.type === 'ThisExpression' &&

				node.parent.type === 'BlockStatement' &&
				node.parent.parent.type === 'FunctionExpression' &&
				node.parent.parent.parent.type === 'MethodDefinition' &&
				node.parent.parent.parent.kind === 'constructor'
			);

			const isPropDefinitionInPrototype = (
				hasJSDocTags(node, ['type', 'const'], sourceCode) &&
				node.expression.type === 'MemberExpression' &&
				node.expression.object.type === 'MemberExpression' &&
				node.expression.object.property.name === 'prototype'
			);

			if (isTypedef || isPropDefinitionInConstructor || isPropDefinitionInPrototype) {
				return;
			}

			context.report(error);
		};

		return originalRule.create(contextCopy);
	}
};
