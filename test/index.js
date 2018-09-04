const RuleTester = require('eslint').RuleTester;
const rules = require('../index').rules;

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 6
	}
});

const ruleNames = [
	'typecast-spacing',
	'caps-const',
	'capitalized-enum',
	'capitalized-typedef',
	'event-const-desc',
	'no-restricted-jsdoc-tags',
	'no-public-underscore',
	'no-empty-method',
	'no-unused-expressions',
	'lines-around-class',
	'lines-between-methods',
	'lines-between-props',
	'lines-between-statics',
	'statics-order',
	'props-order',
	'methods-order',
	'jsdoc-tags-order',
	'jsdoc-type-application-dot',
	'jsdoc-type-spacing',
	'valid-jsdoc'
];

ruleNames.forEach((ruleName) => {
	// eslint-disable-next-line global-require
	ruleTester.run(ruleName, rules[ruleName], require('./rules/' + ruleName));
});
