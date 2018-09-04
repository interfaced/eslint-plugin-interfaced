const {visitAbstractClassNodes} = require('../visitors');
const {resolveClassName} = require('../ast');

module.exports = {
	meta: {
		docs: {
			description: 'enforce "Abstract" prefix for for abstract class name'
		}
	},
	create: (context) => {
		function check(classNode) {
			const className = resolveClassName(classNode);

			if (!className.startsWith('Abstract')) {
				context.report({
					node: classNode,
					message: `Abstract class name "${className}" should start with "Abstract".`
				});
			}
		}

		return visitAbstractClassNodes(check, context);
	}
};
