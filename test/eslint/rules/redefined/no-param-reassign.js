const {errors, concat, extendToClassExpression} = require(`../../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`function func(arg) {`,
			`    arg = /** @type {string} */ (arg);`,
			`}`
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a = /** @type {string} */ (arg.a);`,
			`}`
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a.b = /** @type {string} */ (arg.a.b);`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`function func(arg) {`,
			`    arg = arg;`,
			`}`
		),
		errors: errors(
			'Assignment to function parameter \'arg\'.'
		)
	}, {
		code: concat(
			`function func(arg) {`,
			`    arg = /** @type {string} */ (1);`,
			`}`
		),
		errors: errors(
			'Assignment to function parameter \'arg\'.'
		)
	}, {
		code: concat(
			`function func(arg) {`,
			`    arg += /** @type {string} */ (arg);`,
			`}`
		),
		errors: errors(
			'Assignment to function parameter \'arg\'.'
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a = arg.a;`,
			`}`
		),
		errors: errors(
			'Assignment to property of function parameter \'arg\'.'
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a = /** @type {string} */ (arg1.a);`,
			`}`
		),
		errors: errors(
			'Assignment to property of function parameter \'arg\'.'
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a = /** @type {string} */ (arg.b);`,
			`}`
		),
		errors: errors(
			'Assignment to property of function parameter \'arg\'.'
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a.b = /** @type {string} */ (arg.a.c);`,
			`}`
		),
		errors: errors(
			'Assignment to property of function parameter \'arg\'.'
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a += /** @type {string} */ (arg.a);`,
			`}`
		),
		errors: errors(
			'Assignment to property of function parameter \'arg\'.'
		)
	}, {
		options: [{
			props: true
		}],
		code: concat(
			`function func(arg) {`,
			`    arg.a = /** @type {string} */ (1);`,
			`}`
		),
		errors: errors(
			'Assignment to property of function parameter \'arg\'.'
		)
	}]
});
