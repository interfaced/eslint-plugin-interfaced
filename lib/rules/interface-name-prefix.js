const {iterateOverInterfaceNodes} = require('../iterators');
const {resolveClassName} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce "I" prefix for interface names'
		}
	},
	create: (context) => {
		function check(interfaceNode) {
			const interfaceName = resolveClassName(interfaceNode);

			if (!interfaceName.startsWith('I')) {
				context.report({
					node: interfaceNode,
					message: `Interface name "${interfaceName}" should start with "I".`
				});
			}
		}

		return iterateOverInterfaceNodes(check, context);
	}
};
