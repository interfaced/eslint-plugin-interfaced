const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Enum1 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Enum2 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Enum3 = {`,
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
			`let enum1 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.enum2 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`enum3 = {`,
			`   VALUE1: 1,`,
			`   VALUE2: 2`,
			`};`
		),
		errors: errors(
			`Enum "enum1" isn't capitalized.`,
			`Enum "enum2" isn't capitalized.`,
			`Enum "enum3" isn't capitalized.`
		)
	}]
};
