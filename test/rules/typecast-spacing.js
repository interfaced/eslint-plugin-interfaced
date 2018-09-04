const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`const castedValue = /** @type {number} */ (value);`
		)
	}, {
		code: concat(
			`const castedValue = /** @type {number} */value;`
		)
	}, {
		code: concat(
			`const castedValue = (/** @type {number} */value);`
		)
	}],
	invalid: ['value', 'ns.value', '{}', 'getValue()']
		.reduce((acc, expression) => acc.concat(...[{
			code: concat(
				`const castedValue = /** @type {number} */(${expression});`
			),
			output: concat(
				`const castedValue = /** @type {number} */ (${expression});`
			),
			errors: errors(
				`There is no space between type block and opening parenthesis in typecast.`
			)
		}, {
			code: concat(
				`const castedFunction = () => /** @type {number} */(${expression});`
			),
			output: concat(
				`const castedFunction = () => /** @type {number} */ (${expression});`
			),
			errors: errors(
				`There is no space between type block and opening parenthesis in typecast.`
			)
		}, {
			code: concat(
				`const castedFunction = () => {`,
				`   return /** @type {number} */(${expression});`,
				`}`
			),
			output: concat(
				`const castedFunction = () => {`,
				`   return /** @type {number} */ (${expression});`,
				`}`
			),
			errors: errors(
				`There is no space between type block and opening parenthesis in typecast.`
			)
		}, {
			code: concat(
				`function castedFunction() {`,
				`   return /** @type {number} */(${expression});`,
				`}`
			),
			output: concat(
				`function castedFunction() {`,
				`   return /** @type {number} */ (${expression});`,
				`}`
			),
			errors: errors(
				`There is no space between type block and opening parenthesis in typecast.`
			)
		}]), [])
};
