const path = require('path');
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
	'interface-name-prefix',
	'abstract-class-name-prefix',
	'camelcase',
	'no-restricted-jsdoc-tags',
	'no-public-underscore',
	'no-empty-method',
	'no-unused-expressions',
	'no-tabs-in-jsdoc-type',
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
	'valid-jsdoc',
	'require-jsdoc'
];

ruleNames.forEach((ruleName) => {
	// eslint-disable-next-line global-require
	ruleTester.run(ruleName, rules[ruleName], require(path.join(__dirname, 'rules', ruleName)));
});
