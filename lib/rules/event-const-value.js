const {visitEventConstantExpressions} = require('../visitors');
const {resolveConstantName, resolveConstantValue} = require('../ast-utils');

const firstCode = 'a'.charCodeAt(0);
const lastCode = 'z'.charCodeAt(0);
const minusCode = '-'.charCodeAt(0);
const lettersCodes = Array.from(Array(lastCode - firstCode + 1), (_, i) => firstCode + i);
const allowedCodes = [...lettersCodes, minusCode];

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce event constant value to be a lowercase latin string with dash sign delimiter'
		}
	},
	create: (context) => {
		/**
		 * @param {ASTNode} constantExpression
		 */
		function check(constantExpression) {
			const name = resolveConstantName(constantExpression);
			const value = resolveConstantValue(constantExpression);

			const isString = value.type === 'Literal' && typeof value.value === 'string';
			if (!isString) {
				context.report({
					node: constantExpression,
					message: `Event constant "${name}" value should be a string.`
				});

				return;
			}

			const letters = value.value.split('');
			const badCode = letters.find((letter) => !allowedCodes.includes(letter.charCodeAt(0)));

			if (badCode) {
				context.report({
					node: constantExpression,
					message: (
						`Event constant "${name}" should consist of ` +
						`latin lowercase letters (a-z) or dash sign (-), but "${badCode}" given.`
					)
				});
			}
		}

		return visitEventConstantExpressions(check, context.getSourceCode());
	}
};
