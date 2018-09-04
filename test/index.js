const rules = require('../index').rules;
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 6
	}
});

const ruleNames = [
	'space-in-typecast',
	'caps-const',
	'event-const-desc',
	'no-restricted-jsdoc-tags',
	'no-public-underscore',
	'no-empty-method',
	'lines-around-class',
	'lines-between-methods',
	'lines-between-props',
	'lines-between-statics',
	'statics-order',
	'props-order',
	'methods-order',
	'jsdoc-tags-order'
];

ruleNames.forEach((ruleName) => {
	// eslint-disable-next-line global-require
	ruleTester.run(ruleName, rules[ruleName], require('./rules/' + ruleName));
});
