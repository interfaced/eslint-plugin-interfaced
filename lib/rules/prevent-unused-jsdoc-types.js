const {combineVisitors, visitJSDocs} = require('../visitors');
const {getScopeRange, traverseJSDocType} = require('../ast-utils');

module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'prevent variables used in JSDoc type to be marked as unused'
		}
	},
	create: (context) => {
		const typeNamesByRange = new Map();

		/**
		 * @param {JSDoc} JSDoc
		 */
		function checkJSDoc(JSDoc) {
			const {range} = JSDoc.source;

			JSDoc.tags.forEach((tag) => {
				if (!tag.type) {
					return;
				}

				traverseJSDocType(tag.type, (type) => {
					if (type.type !== 'NameExpression') {
						return;
					}

					if (!typeNamesByRange.has(range)) {
						typeNamesByRange.set(range, []);
					}

					typeNamesByRange.get(range).push(type.name);
				});
			});
		}

		/**
		 * @param {Scope} scope
		 */
		function checkScope(scope) {
			const scopeRange = getScopeRange(scope);

			const usedTypeNamesInScope = Array.from(typeNamesByRange.entries())
				.filter(([range]) => range[0] > scopeRange[0] && range[1] < scopeRange[1])
				.reduce((acc, [range, names]) => acc.concat(names), []);

			scope.variables.forEach((variable) => {
				if (usedTypeNamesInScope.includes(variable.name)) {
					variable.eslintUsed = true;
				}
			});

			scope.childScopes.forEach(checkScope);
		}

		return combineVisitors(visitJSDocs(checkJSDoc, context.getSourceCode()), {
			Program() {
				checkScope(context.getScope());
			}
		});
	}
};
