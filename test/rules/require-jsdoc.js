const {errors, concat} = require(`../helper`);

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
			`Klass  = class {}`
		)
	}, {
		options: [{
			require: {
				ClassDeclaration: false
			}
		}],
		code: concat(
			`Klass  = class {}`
		)
	}],
	invalid: [{
		options: [{
			require: {
				ClassDeclaration: true
			}
		}],
		code: concat(
			`Klass  = class {}`
		),
		errors: errors(
			'Missing JSDoc comment.'
		)
	}]
};
