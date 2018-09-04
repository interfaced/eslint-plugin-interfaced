const originalRule = require('eslint/lib/rules/no-param-reassign');

const {isTypecast} = require('../../ast-utils');
const {deepShallowCopy} = require('../../utils');

module.exports = {
	meta: originalRule.meta,
	create: (context) => {
		const sourceCode = context.getSourceCode();
		const contextCopy = deepShallowCopy(context);

		/**
		 * @param {ASTNode} nodeA
		 * @param {ASTNode} nodeB
		 * @param {string} type
		 * @return {boolean}
		 */
		function bothHaveType(nodeA, nodeB, type) {
			return nodeA.type === type && nodeB.type === type;
		}

		/**
		 * @param {ASTNode} nodeA
		 * @param {ASTNode} nodeB
		 * @return {boolean}
		 */
		function bothHaveSameName(nodeA, nodeB) {
			return nodeA.name === nodeB.name;
		}

		contextCopy.report = (error) => {
			const {node} = error;

			let assignment;
			if (node.parent.type === 'AssignmentExpression') {
				assignment = node.parent;
			} else if (node.parent.type === 'MemberExpression') {
				let ancestor = node.parent;
				while (ancestor.type === 'MemberExpression') {
					ancestor = ancestor.parent;
				}

				if (ancestor.type === 'AssignmentExpression') {
					assignment = ancestor;
				}
			}

			if (assignment && assignment.operator === '=') {
				const lhs = assignment.left;
				const rhs = assignment.right;

				if (isTypecast(rhs, sourceCode)) {
					if (bothHaveType(lhs, rhs, 'Identifier') && bothHaveSameName(lhs, rhs)) {
						return;
					}

					if (bothHaveType(lhs, rhs, 'MemberExpression')) {
						let lhsObject = lhs;
						let rhsObject = rhs;

						let areIdentical = true;
						while (areIdentical) {
							if (bothHaveType(lhsObject, rhsObject, 'Identifier')) {
								areIdentical = bothHaveSameName(lhsObject, rhsObject);
							} else {
								areIdentical = (
									bothHaveType(lhsObject.property, rhsObject.property, 'Identifier') &&
									bothHaveSameName(lhsObject.property, rhsObject.property)
								);
							}

							lhsObject = lhsObject.object;
							rhsObject = rhsObject.object;

							if (!lhsObject || !rhsObject) {
								break;
							}
						}

						if (areIdentical) {
							return;
						}
					}
				}
			}

			context.report(error);
		};

		return originalRule.create(contextCopy);
	}
};
