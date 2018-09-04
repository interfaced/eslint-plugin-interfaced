module.exports.rules = {
	'space-in-typecast': require('./lib/rules/space-in-typecast'),
	'caps-const': require('./lib/rules/caps-const'),
	'event-const-desc': require('./lib/rules/event-const-desc'),
	'no-empty-method': require('./lib/rules/no-empty-method'),
	'no-public-underscore': require('./lib/rules/no-public-underscore'),
	'no-restricted-jsdoc-tags': require('./lib/rules/no-restricted-jsdoc-tags'),
	'newline-between-methods': require('./lib/rules/newline-between-methods'),
	'newline-between-props': require('./lib/rules/newline-between-props'),
	'newline-between-statics': require('./lib/rules/newline-between-statics'),
	'newline-before-after-class': require('./lib/rules/newline-before-after-class'),
	'methods-order': require('./lib/rules/methods-order'),
	'props-order': require('./lib/rules/props-order'),
	'statics-order': require('./lib/rules/statics-order'),
	'jsdoc-tags-order': require('./lib/rules/jsdoc-tags-order')
};
