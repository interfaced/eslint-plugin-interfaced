const {errors, concat} = require(`../../helper`);

module.exports = {
	valid: [{
		options: [{
			require: {
				ClassDeclaration: true
			}
		}],
		code: concat(
			`/**`,
			` */`,
			`Klass1 = class {}`,
			``,
			`/**`,
			` */`,
			`const Klass2 = class {}`
		)
	}, {
		options: [{
			require: {
				ClassDeclaration: false
			}
		}],
		code: concat(
			`Klass1 = class {}`,
			``,
			`const Klass2 = class {}`
		)
	}],
	invalid: [{
		options: [{
			require: {
				ClassDeclaration: true
			}
		}],
		code: concat(
			`Klass = class {}`,
			``,
			`const Klass2 = class {}`
		),
		errors: errors(
			'Missing JSDoc comment.',
			'Missing JSDoc comment.'
		)
	}]
};
