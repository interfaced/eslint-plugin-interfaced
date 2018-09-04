const {visitInterfaceNodes} = require('../visitors');
const {resolveClassName} = require('../ast');

module.exports = {
	meta: {
		docs: {
			description: 'enforce "I" prefix for interface name'
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

		return visitInterfaceNodes(check, context);
	}
};
