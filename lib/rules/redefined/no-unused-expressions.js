const originalRule = require('eslint/lib/rules/no-unused-expressions');

const {isTypedefExpression, isPropExpression} = require('../../ast-utils');
const {deepShallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = deepShallowCopy(context);

		contextCopy.report = (error) => {
			const {node} = error;

			const isProp = isPropExpression(node, sourceCode);
			const isTypedef = isTypedefExpression(node, sourceCode);

			const isInConstructor = (
				node.parent.type === 'BlockStatement' &&
				node.parent.parent.type === 'FunctionExpression' &&
				node.parent.parent.parent.type === 'MethodDefinition' &&
				node.parent.parent.parent.kind === 'constructor'
			);

			const isPrototypeExtending = (
				node.type === 'ExpressionStatement' &&
				node.expression.type === 'MemberExpression' &&
				node.expression.object.type === 'MemberExpression' &&
				node.expression.object.property.name === 'prototype'
			);

			if ((isProp && isInConstructor) || isPrototypeExtending || isTypedef) {
				return;
			}

			context.report(error);
		};

		return originalRule.create(contextCopy);
	}
};
