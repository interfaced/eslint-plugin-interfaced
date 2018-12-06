const path = require('path');
const {RuleTester} = require('eslint');
const {rules} = require('../../index');
const {prependText} = require('./helper');

function addAlignment(code) {
	return code.replace(/\n/g, `\n${Array(13).join(' ')}`);
}

function addLineNumbers(code) {
	return code.split('\n')
		.reduce((result, line, index) => result + `\n${index + 1}. ${line}`, '');
}

RuleTester.it = (title, fn) => it(addAlignment(addLineNumbers(title)), function(...args) {
	try {
		fn(...args);
	} catch (e) {
		// Skip the scenario when it has a parsing error, e.g. when is uses import/export not in module context
		if (e.message.includes('Parsing error')) {
			this.skip();
		} else {
			throw e;
		}
	}
});

const testers = [
	{
		name: 'Browser',
		tester: new RuleTester({
			parserOptions: {
				ecmaVersion: 2015
			},
			env: {
				browser: true
			}
		})
	},
	{
		name: 'Node',
		tester: new RuleTester({
			parserOptions: {
				ecmaVersion: 2015
			},
			env: {
				node: true
			}
		})
	},
	{
		name: 'Module',
		tester: new RuleTester({
			parserOptions: {
				ecmaVersion: 2015,
				sourceType: 'module'
			}
		})
	}
];

const ruleNames = [
	'redefined/camelcase',
	'redefined/no-param-reassign',
	'redefined/no-unused-expressions',
	'redefined/require-jsdoc',
	'redefined/valid-jsdoc',

	'abstract-class-name-prefix',
	'capitalized-enum',
	'capitalized-typedef',
	'caps-const',
	'event-const-desc',
	'event-const-value',
	'interface-name-prefix',
	'jsdoc-tags-order',
	'jsdoc-type-application-dot',
	'jsdoc-type-indent',
	'jsdoc-type-spacing',
	'lines-around-class',
	'lines-between-methods',
	'lines-between-props',
	'methods-order',
	'no-jsdoc-type-multi-spaces',
	'no-jsdoc-type-tabs',
	'no-empty-method',
	'no-public-underscore',
	'no-restricted-jsdoc-tags',
	'prefer-shorthand-jsdoc-types',
	'props-order',
	'singular-enum',
	'typecast-spacing'
];

const preventUnusedRuleNames = [
	'prevent-unused-jsdoc-types',
	'prevent-unused-meta-params'
];

describe('Rules', () => {
	testers.forEach(({name, tester}) => {
		describe(name, () => {
			ruleNames.forEach((ruleName) => {
				const rule = rules[ruleName.split('/').pop()];

				// eslint-disable-next-line global-require
				tester.run(ruleName, rule, require(path.join(__dirname, 'rules', ruleName)));
			});

			preventUnusedRuleNames.forEach((ruleName) => {
				tester.linter.defineRule(ruleName, rules[ruleName]);

				tester.run(
					'no-unused-vars',
					require('eslint/lib/rules/no-unused-vars'), // eslint-disable-line global-require
					prependText(
						`/* eslint ${ruleName}: 1 */\n`,
						require(path.join(__dirname, 'rules', ruleName)) // eslint-disable-line global-require
					)
				);
			});
		});
	});
});
