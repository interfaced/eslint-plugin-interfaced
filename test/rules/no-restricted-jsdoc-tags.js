const {errors, concat, extendToClassExpression} = require(`../helper`);

module.exports = extendToClassExpression({
	valid: [{
		options: [{
			tags: ['extends']
		}],
		code: concat(
			`/**`,
			` */`,
			`class Klass {}`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTags: ['interface']}]
		}],
		code: concat(
			`/**`,
			` * @interface`,
			` * @extends {AnotherKlass}`,
			` */`,
			`class Klass {}`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTypes: ['TypeApplication']}]
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass<number>}`,
			` */`,
			`class Klass extends AnotherKlass {}`
		)
	}],
	invalid: [{
		options: [{
			tags: ['extends']
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass}`,
			` */`,
			`class Klass extends AnotherKlass {}`
		),
		errors: errors(
			`JSDoc tag "extends" is not allowed.`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTags: ['interface']}]
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass}`,
			` */`,
			`class Klass {}`
		),
		errors: errors(
			`JSDoc tag "extends" is not allowed. This tags allowed only with tag "interface".`
		)
	}, {
		options: [{
			tags: [{tag: 'extends', allowWithTypes: ['TypeApplication']}]
		}],
		code: concat(
			`/**`,
			` * @extends {AnotherKlass}`,
			` */`,
			`class Klass extends AnotherKlass {}`
		),
		errors: errors(
			`JSDoc tag "extends" is not allowed. This tags allowed only with type "TypeApplication".`
		)
	}]
});
