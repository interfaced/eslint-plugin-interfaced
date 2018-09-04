const {iterateOverTypedefVariables} = require('../iterators');

module.exports = {
	meta: {
		docs: {
			description: 'prevent typedef variables to be marked as unused'
		}
	},
	create: (context) => {
		function check(typedefVariable) {
			typedefVariable.declarations.forEach((declarator) => {
				context.markVariableAsUsed(declarator.id.name);
			});
		}

		return iterateOverTypedefVariables(check, context);
	}
};
