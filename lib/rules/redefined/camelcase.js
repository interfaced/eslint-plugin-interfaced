const originalRule = require('eslint/lib/rules/camelcase');
const {shallowCopy} = require('../../utils');

const ALLOWED_PREFIXES = ['opt_', 'var_'];

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const contextCopy = shallowCopy(context);
		const allowedParams = [];

		contextCopy.report = (error) => {
			const paramName = resolveParamName(error.node);
			const isAllowed = paramName && allowedParams.some((allowedParam) =>
				resolveParamName(allowedParam) === paramName
			);

			if (!isAllowed) {
				context.report(error);
			}
		};

		function trackParams(params) {
			params.forEach((param) => {
				const paramName = resolveParamName(param);

				if (ALLOWED_PREFIXES.some((allowedPrefix) => paramName.startsWith(allowedPrefix))) {
					const strippedParamName = paramName.replace(new RegExp(ALLOWED_PREFIXES.join('|')), '');

					if (strippedParamName.indexOf('_') === -1) {
						allowedParams.push(param);
					}
				}
			});
		}

		function untrackParams(params) {
			params.forEach((param, index) => {
				if (allowedParams.includes(param)) {
					allowedParams.splice(index, 1);
				}
			});
		}

		function resolveParamName(param) {
			switch (param.type) {
				case 'Identifier':
					return param.name;
				case 'AssignmentPattern':
					return param.left.name;
				case 'RestElement':
					return param.argument.name;
				default:
					return '';
			}
		}

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
