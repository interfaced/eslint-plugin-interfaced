const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		options: [{
			tags: ['extends']
		}],
		code: concat(
			`/**`,
			` */`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTags: ['interface']}]
		}],
		code: concat(
			`/**`,
			` * @interface`,
			` * @extends {AnotherKlass}`,
			` */`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTypes: ['TypeApplication']}]
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass<number>}`,
			` */`
		)
	}],
	invalid: [{
		options: [{
			tags: ['extends']
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass}`,
			` */`
		),
		errors: errors(
			`JSDoc tag "extends" isn't allowed.`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTags: ['interface']}]
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass}`,
			` */`
		),
		errors: errors(
			`JSDoc tag "extends" isn't allowed. This tag allowed only with tag "interface".`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTypes: ['TypeApplication']}]
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass}`,
			` */`
		),
		errors: errors(
			`JSDoc tag "extends" isn't allowed. This tag allowed only with type "TypeApplication".`
		)
	}]
};
