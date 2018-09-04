const originalRule = require('eslint/lib/rules/camelcase');

const {resolveParamNames} = require('../../ast-utils');
const {deepShallowCopy} = require('../../utils');

const ALLOWED_PREFIXES = ['opt_', 'var_'];

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const contextCopy = deepShallowCopy(context);
		const allowedParams = [];

		/**
		 * @param {Array<ASTNode>} params
		 */
		function trackParams(params) {
			params.forEach((param) => {
				const paramNames = resolveParamNames(param);
				const isAllowed = ALLOWED_PREFIXES.some((allowedPrefix) => paramNames.some((paramName) =>
					paramName.startsWith(allowedPrefix) &&
					paramName.replace(allowedPrefix, '').indexOf('_') === -1
				));

				if (isAllowed) {
					allowedParams.push(param);
				}
			});
		}

		/**
		 * @param {Array<ASTNode>} params
		 */
		function untrackParams(params) {
			params.forEach((param, index) => {
				if (allowedParams.includes(param)) {
					allowedParams.splice(index, 1);
				}
			});
		}

		contextCopy.report = (error) => {
			const paramNames = resolveParamNames(error.node);
			const isAllowed = paramNames.length && allowedParams.some((allowedParam) =>
				resolveParamNames(allowedParam)
					.some((paramName) => paramNames.includes(paramName))
			);

			if (!isAllowed) {
				context.report(error);
			}
		};

		return Object.assign(originalRule.create(contextCopy), {
			'FunctionExpression': (node) => trackParams(node.params),
			'FunctionDeclaration': (node) => trackParams(node.params),
			'ArrowFunctionExpression': (node) => trackParams(node.params),
			'FunctionExpression:exit': (node) => untrackParams(node.params),
			'FunctionDeclaration:exit': (node) => untrackParams(node.params),
			'ArrowFunctionExpression:exit': (node) => untrackParams(node.params)
		});
	}
};
