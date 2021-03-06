/**
 * @const {Array<string>}
 */
const JSDOC3_TAGS = [
	'abstract',
	'access',
	'alias',
	'arg',
	'argument',
	'async',
	'augments',
	'author',
	'borrows',
	'callback',
	'class',
	'classdesc',
	'constructor',
	'const',
	'constant',
	'constructs',
	'copyright',
	'default',
	'defaultvalue',
	'deprecated',
	'desc',
	'description',
	'emits',
	'enum',
	'event',
	'example',
	'exception',
	'exports',
	'extends',
	'external',
	'file',
	'fileoverview',
	'fires',
	'func',
	'function',
	'generator',
	'global',
	'hideconstructor',
	'host',
	'ignore',
	'implements',
	'inheritdoc',
	'inner',
	'instance',
	'interface',
	'kind',
	'lends',
	'license',
	'listens',
	'member',
	'memberof',
	'method',
	'mixes',
	'mixin',
	'module',
	'name',
	'namespace',
	'package',
	'param',
	'override',
	'overview',
	'private',
	'prop',
	'property',
	'protected',
	'public',
	'readonly',
	'requires',
	'return',
	'returns',
	'see',
	'since',
	'static',
	'summary',
	'this',
	'throws',
	'todo',
	'tutorial',
	'type',
	'typedef',
	'var',
	'variation',
	'version',
	'virtual',
	'yields',
	'yield'
];

/**
 * @const {Array<string>}
 */
const CLOSURE_COMPILER_TAGS = [
	'define',
	'dict',
	'export',
	'externs',
	'final',
	'implicitcast',
	'modifies',
	'noalias',
	'nocollapse',
	'nocompile',
	'nosideeffects',
	'polymer',
	'polymerbehavior',
	'preserve',
	'record',
	'struct',
	'suppress',
	'template',
	'unrestricted'
];

/**
 * @const {Array<string>}
 */
const KNOWN_JSDOC_TAGS = [
	...JSDOC3_TAGS,
	...CLOSURE_COMPILER_TAGS
];

/**
 * @const {Array<string>}
 */
const KNOWN_JSDOC_TYPES = [
	'NullableLiteral',
	'AllLiteral',
	'NullLiteral',
	'UndefinedLiteral',
	'VoidLiteral',
	'UnionType',
	'ArrayType',
	'RecordType',
	'FieldType',
	'FunctionType',
	'ParameterType',
	'RestType',
	'NonNullableType',
	'OptionalType',
	'NullableType',
	'NameExpression',
	'TypeApplication',
	'StringLiteralType',
	'NumericLiteralType',
	'BooleanLiteralType'
];

module.exports = {
	KNOWN_JSDOC_TAGS,
	KNOWN_JSDOC_TYPES
};
