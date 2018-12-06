const {errors, concat} = require(`../helper`);

module.exports = {
	valid: [{
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Key = {};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Value = {};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Name = {};`
		)
	}],
	invalid: [{
		code: concat(
			`/**`,
			` * @enum {number}`,
			` */`,
			`let Keys = {};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`ns.Values = {};`,
			``,
			`/**`,
			` * @enum {number}`,
			` */`,
			`Names = {};`
		),
		errors: errors(
			`Enum "Keys" isn't singular.`,
			`Enum "Values" isn't singular.`,
			`Enum "Names" isn't singular.`
		)
	}]
};
