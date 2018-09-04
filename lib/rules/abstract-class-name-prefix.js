const {iterateOverAbstractClassNodes} = require('../iterators');
const {resolveClassName} = require('../utils');

module.exports = {
	meta: {
		docs: {
			description: 'enforce "Abstract" prefix for abstract class names'
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

		return iterateOverAbstractClassNodes(check, context);
	}
};
