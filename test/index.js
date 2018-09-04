const path = require('path');
const {RuleTester} = require('eslint');
const {rules} = require('../index');
const {prependText} = require('./helper');

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 6
	}
});

const ruleNames = [
	'camelcase',
	'no-unused-expressions',
	'require-jsdoc',
	'valid-jsdoc',

	'abstract-class-name-prefix',
	'capitalized-enum',
	'capitalized-typedef',
	'caps-const',
	'event-const-desc',
	'event-const-value',
	'interface-name-prefix',
	'jsdoc-tags-order',
	'jsdoc-type-application-dot',
	'jsdoc-type-spacing',
	'lines-around-class',
	'lines-between-methods',
	'lines-between-props',
	'lines-between-statics',
	'methods-order',
	'no-empty-method',
	'no-public-underscore',
	'no-restricted-jsdoc-tags',
	'no-tabs-in-jsdoc-type',
	'prefer-shorthand-jsdoc-types',
	'props-order',
	'statics-order',
	'typecast-spacing'
];

const preventUnusedRuleName = [
	'prevent-unused-typedef-vars',
	'prevent-unused-meta-params'
];

ruleNames.forEach((ruleName) => {
	// eslint-disable-next-line global-require
	ruleTester.run(ruleName, rules[ruleName], require(path.join(__dirname, 'rules', ruleName)));
});

preventUnusedRuleName.forEach((ruleName) => {
	ruleTester.linter.defineRule(ruleName, rules[ruleName]);

	ruleTester.run(
		'no-unused-vars',
		require('eslint/lib/rules/no-unused-vars'), // eslint-disable-line global-require
		prependText(
			`/* eslint ${ruleName}: 1 */\n`,
			require(path.join(__dirname, 'rules', ruleName)) // eslint-disable-line global-require
		)
	);
});
