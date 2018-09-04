const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		code: concat(
			`function test(opt_firstArg, var_restArgs) {}`
		)
	}, {
		code: concat(
			`const test = function (opt_firstArg, var_restArgs) {}`
		)
	}, {
		code: concat(
			`const test = (opt_firstArg, var_restArgs) => {}`
		)
	}, {
		code: concat(
			`function test(opt_firstArg = 1, var_restArgs = 2) {}`
		)
	}, {
		code: concat(
			`function test({opt_firstArg, opt_secondArg = 1}) {}`
		)
	}, {
		code: concat(
			`function test(...var_restArgs) {}`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   method(opt_firstArg, var_restArgs) {}`,
			`}`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   method(opt_firstArg, var_restArgs) {`,
			`       if (true) {`,
			`           const firstArg = opt_firstArg;`,
			`           const restArg = var_restArgs;`,
			`       }`,
			`   }`,
			`}`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   method(opt_firstArg, var_restArgs) {`,
			`       return () => {`,
			`           if (true) {`,
			`               const firstArg = opt_firstArg;`,
			`               const restArg = var_restArgs;`,
			`           }`,
			`       }`,
			`   }`,
			`}`
		)
	}],
	invalid: [{
		code: concat(
			`function test(first_arg, second_arg) {}`
		),
		errors: errors(
			`Identifier 'first_arg' is not in camel case.`,
			`Identifier 'second_arg' is not in camel case.`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   method(first_arg, second_arg) {}`,
			`}`
		),
		errors: errors(
			`Identifier 'first_arg' is not in camel case.`,
			`Identifier 'second_arg' is not in camel case.`
		)
	}, {
		code: concat(
			`function test(opt_first_arg, var_rest_args) {}`
		),
		errors: errors(
			`Identifier 'opt_first_arg' is not in camel case.`,
			`Identifier 'var_rest_args' is not in camel case.`
		)
	}, {
		code: concat(
			`const opt_variable = 1;`
		),
		errors: errors(
			`Identifier 'opt_variable' is not in camel case.`
		)
	}, {
		code: concat(
			`class Klass {`,
			`   method() {`,
			`       const opt_variable = 1;`,
			`   }`,
			`}`
		),
		errors: errors(
			`Identifier 'opt_variable' is not in camel case.`
		)
	}]
});
