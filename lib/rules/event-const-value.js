const {visitConstantExpressions} = require('../visitors');
const {resolveConstantName} = require('../ast-utils');

const firstCode = 'a'.charCodeAt(0);
const lastCode = 'z'.charCodeAt(0);
const minusCode = '-'.charCodeAt(0);
const lettersCodes = Array.from(Array(lastCode - firstCode + 1), (_, i) => firstCode + i);
const allowedCodes = [...lettersCodes, minusCode];

module.exports = {
	meta: {
		docs: {
			description: 'enforce event constant value to be a lowercase latinic string with dash sign delimiter'
		}
	},
	create: (context) => {
		/**
		 * @param {ASTNode} constantExpression
		 */
		function check(constantExpression) {
			const constantName = resolveConstantName(constantExpression);

			if (constantName.startsWith('EVENT_')) {
				const value = constantExpression.expression.right.value;
				const valueType = typeof value;

				const isLiteral = constantExpression.expression.right.type === 'Literal';
				const isString = isLiteral && valueType === 'string';

				if (!isString) {
					context.report({
						node: constantExpression,
						message: `Event constant "${constantName}" value should be a string.`
					});

					return;
				}

				const letters = value.split('');
				const badCode = letters.find((letter) => !allowedCodes.includes(letter.charCodeAt(0)));

				if (badCode) {
					context.report({
						node: constantExpression,
						message: (
							`Event constant "${constantName}" should consist of ` +
							`latinic lowercase letters (a-z) or dash sign (-), but "${badCode}" given.`
						)
					});
				}
			}
		}

		return visitConstantExpressions(check, context.getSourceCode());
	}
};
