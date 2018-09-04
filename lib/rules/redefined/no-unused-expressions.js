const originalRule = require('eslint/lib/rules/no-unused-expressions');
const {hasJSDocTags} = require('../../jsdoc');
const {shallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = shallowCopy(context);

		contextCopy.report = (error) => {
			const isTypedef = (
				hasJSDocTags(error.node, ['typedef'], sourceCode) &&
				error.node.parent.type === 'Program' &&
				error.node.expression.type === 'MemberExpression'
			);

			const isConstructorPropertyDefinition = (
				hasJSDocTags(error.node, ['type', 'const'], sourceCode) &&
				error.node.expression.type === 'MemberExpression' &&
				error.node.expression.object.type === 'ThisExpression' &&

				error.node.parent.type === 'BlockStatement' &&
				error.node.parent.parent.type === 'FunctionExpression' &&
				error.node.parent.parent.parent.type === 'MethodDefinition' &&
				error.node.parent.parent.parent.kind === 'constructor'
			);

			const isPrototypePropertyDefinition = (
				hasJSDocTags(error.node, ['type', 'const'], sourceCode) &&
				error.node.expression.type === 'MemberExpression' &&
				error.node.expression.object.type === 'MemberExpression' &&
				error.node.expression.object.property.name === 'prototype'
			);

			if (isTypedef || isConstructorPropertyDefinition || isPrototypePropertyDefinition) {
				return;
			}

			context.report(error);
		};

		return originalRule.create(contextCopy);
	}
};
