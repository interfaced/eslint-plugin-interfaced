const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum1 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Enum2 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.enum1 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`let enum2 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`
		),
		errors: errors(
			`Enum "enum1" is not capitalized.`,
			`Enum "enum2" is not capitalized.`
		)
	}]
};
