const {iterateOverMethodDefinitionPairs} = require('../iterators');
const {getScopeFromJSDoc, hasJSDocTags} = require('../jsdoc');

const DEFAULT_OPTIONS = {
	scopesOrder: ['public', 'protected', 'private'],
	staticInTheEnd: true
};

module.exports = {
	meta: {
		docs: {
			description: 'enforce specified methods order'
		},
		schema: [{
			type: 'object',
			properties: {
				scopesOrder: {
					type: 'array',
					minItems: 3,
					maxItems: 3,
					items: [{
						enum: ['public', 'protected', 'private']
					}, {
						enum: ['public', 'protected', 'private']
					}, {
						enum: ['public', 'protected', 'private']
					}]
				},
				staticInTheEnd: {
					type: 'boolean'
				}
			},
			additionalProperties: false
		}]
	},
	create: (context) => {
		const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
		const sourceCode = context.getSourceCode();

		function resolveMethodScope(methodDefinition) {
			const scopeFromJSDoc = getScopeFromJSDoc(methodDefinition, sourceCode);

			if (!scopeFromJSDoc) {
				if (methodDefinition.key.name.startsWith('_') &&
					hasJSDocTags(methodDefinition, ['override', 'inheritdoc'], sourceCode)
				) {
					return 'private/protected';
				}

				return 'public';
			}

			return scopeFromJSDoc;
		}

		function check(methodADefinition, methodBDefinition) {
			const methodAName = methodADefinition.key.name;
			const methodBName = methodBDefinition.key.name;

			const methodAScope = resolveMethodScope(methodADefinition);
			const methodBScope = resolveMethodScope(methodBDefinition);

			const isMethodAOverridden = hasJSDocTags(methodADefinition, ['override', 'inheritdoc'], sourceCode);
			const isMethodBOverridden = hasJSDocTags(methodBDefinition, ['override', 'inheritdoc'], sourceCode);

			const isMethodAConstructor = methodADefinition.kind === 'constructor';
			const isMethodBConstructor = methodBDefinition.kind === 'constructor';

			const isMethodAStatic = methodADefinition.static === true;
			const isMethodBStatic = methodBDefinition.static === true;

			const isMethodsHaveSameStatic = (
				(isMethodAStatic && isMethodBStatic) ||
				(!isMethodAStatic && !isMethodBStatic)
			);

			let isMethodBScopeHigher;
			let isMethodsHaveSameScope;
			if (methodBScope === 'private/protected') {
				isMethodsHaveSameScope = methodAScope === 'private' || methodAScope === 'protected';
				isMethodBScopeHigher = (
					options.scopesOrder.indexOf('private') < options.scopesOrder.indexOf(methodAScope) ||
					options.scopesOrder.indexOf('protected') < options.scopesOrder.indexOf(methodAScope)
				);
			} else if (methodAScope === 'private/protected') {
				isMethodsHaveSameScope = methodBScope === 'private' || methodBScope === 'protected';
				isMethodBScopeHigher = (
					options.scopesOrder.indexOf(methodBScope) < options.scopesOrder.indexOf('private') &&
					options.scopesOrder.indexOf(methodBScope) < options.scopesOrder.indexOf('protected')
				);
			} else {
				isMethodsHaveSameScope = methodBScope === methodAScope;
				isMethodBScopeHigher =
					options.scopesOrder.indexOf(methodBScope) < options.scopesOrder.indexOf(methodAScope);
			}

			const wrongOrderByConstructor = isMethodBConstructor;

			const wrongOrderByScope = (
				isMethodsHaveSameStatic &&
				!isMethodAConstructor &&
				isMethodBScopeHigher
			);

			const wrongOrderByOverride = (
				isMethodsHaveSameStatic &&
				isMethodsHaveSameScope &&
				!isMethodAConstructor &&
				!isMethodAOverridden &&
				isMethodBOverridden
			);

			const wrongOrderByStatic = (
				isMethodAStatic &&
				!isMethodBStatic
			);

			if (wrongOrderByConstructor) {
				context.report({
					node: methodBDefinition,
					message: 'Constructor method should be first in the class body.'
				});
			}

			if (wrongOrderByScope) {
				context.report({
					node: methodBDefinition,
					message: (
						`Method "${methodBName}" (${methodBScope}) should be before ` +
						`method "${methodAName}" (${methodAScope}) due to its priority.`
					)
				});
			}

			if (wrongOrderByOverride) {
				context.report({
					node: methodBDefinition,
					message: (
						`Method "${methodBName}" should be before "${methodAName}" ` +
						`because of "${methodBName}" is overridden.`
					)
				});
			}

			if (options.staticInTheEnd && wrongOrderByStatic) {
				context.report({
					node: methodADefinition,
					message: `Method "${methodAName}" is static and should be in the end of class body.`
				});
			}
		}

		return iterateOverMethodDefinitionPairs(check);
	}
};
