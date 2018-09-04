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
	invalid: [{
		code: `const castedValue = /** @type {number} */(value);`,
		output: `const castedValue = /** @type {number} */ (value);`,
		errors: errors(
			`There is no space between type block and opening parenthesis in typecast.`
		)
	}, {
		code: `const castedFunction = () => /** @type {number} */(value);`,
		output: `const castedFunction = () => /** @type {number} */ (value);`,
		errors: errors(
			`There is no space between type block and opening parenthesis in typecast.`
		)
	}]
};
