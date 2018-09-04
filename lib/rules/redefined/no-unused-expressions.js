const originalRule = require('eslint/lib/rules/no-unused-expressions');
const {shallowCopy, hasJSDocTags} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const contextCopy = shallowCopy(context);

		contextCopy.report = (error) => {
			const isTypedef = (
				error.node.parent.type === 'Program' &&
				error.node.expression.type === 'MemberExpression' &&
				hasJSDocTags(error.node, 'typedef', context)
			);

			const isPropertyDefinition = (
				hasJSDocTags(error.node, 'type', context) &&
				error.node.expression.type === 'MemberExpression' &&
				error.node.expression.object.type === 'ThisExpression' &&

				error.node.parent.type === 'BlockStatement' &&
				error.node.parent.parent.type === 'FunctionExpression' &&
				error.node.parent.parent.parent.type === 'MethodDefinition' &&
				error.node.parent.parent.parent.kind === 'constructor'
			);

			if (isTypedef || isPropertyDefinition) {
				return;
			}

			context.report(error);
		};

		return originalRule.create(contextCopy);
	}
};
