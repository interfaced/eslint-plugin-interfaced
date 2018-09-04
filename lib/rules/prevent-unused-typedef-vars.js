const {visitTypedefVariables} = require('../visitors');

module.exports = {
	meta: {
		docs: {
			description: 'prevent typedef variable to be marked as unused'
		}
	},
	create: (context) => {
		/**
		 * @param {ASTNode} typedefVariable
		 */
		function check(typedefVariable) {
			typedefVariable.declarations.forEach((declarator) => {
				context.markVariableAsUsed(declarator.id.name);
			});
		}

		return visitTypedefVariables(check, context.getSourceCode());
	}
};
