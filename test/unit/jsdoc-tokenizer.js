const {describe, it} = require('mocha');
const {expect} = require('chai');

const JSDocTokenizer = require('../../lib/jsdoc-tokenizer');
const {
	KEYWORD,
	IDENTIFIER,
	STRING,
	NUMERIC,
	TEXT,
	PUNCTUATOR,
	WHITESPACE,
	LINE_BREAK,
	EOF
} = JSDocTokenizer.Token;

let tokenizer;

/**
 * @param {Array<string>} lines
 * @param {Array<JSDocToken>} tokens
 * @throws {chai.AssertionError}
 */
const expectTokenized = (lines, tokens) => {
	expect(tokenizer.tokenize(lines.join('\n'))).to.deep.equal(tokens);
};

describe('JSDocTokenizer', () => {
	describe('Sanity checks', () => {
		it('Should be instantiatable', () => {
			expect(() => new JSDocTokenizer()).to.not.throw();
		});

		it('Should expose public method "tokenize"', () => {
			expect((new JSDocTokenizer()).tokenize).to.be.a('function');
		});
	});

	describe('Tokenization', () => {
		beforeEach(() => {
			tokenizer = new JSDocTokenizer();
		});

		it('Doctrine\'s example', () => {
			expectTokenized(
				[
					'/**',
					' * @constructor',
					' * @param {(jQuerySelector|Element|Object|Array.<Element>|jQuery|string|function())=} arg1',
					' * @param {(Element|Object|Document|Object.<string, (string|function(!jQuery.event=))>)=} arg2',
					' * @return {!jQuery}',
					' */'
				],
				[
					{type: PUNCTUATOR, value: '/**'},

					{type: LINE_BREAK, value: '\n'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '*'},
					{type: WHITESPACE, value: ' '},
					{type: KEYWORD, value: '@constructor'},

					{type: LINE_BREAK, value: '\n'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '*'},
					{type: WHITESPACE, value: ' '},
					{type: KEYWORD, value: '@param'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '{'},
					{type: PUNCTUATOR, value: '('},
					{type: IDENTIFIER, value: 'jQuerySelector'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'Element'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'Object'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'Array'},
					{type: PUNCTUATOR, value: '.'},
					{type: PUNCTUATOR, value: '<'},
					{type: IDENTIFIER, value: 'Element'},
					{type: PUNCTUATOR, value: '>'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'jQuery'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'string'},
					{type: PUNCTUATOR, value: '|'},
					{type: KEYWORD, value: 'function'},
					{type: PUNCTUATOR, value: '('},
					{type: PUNCTUATOR, value: ')'},
					{type: PUNCTUATOR, value: ')'},
					{type: PUNCTUATOR, value: '='},
					{type: PUNCTUATOR, value: '}'},
					{type: WHITESPACE, value: ' '},
					{type: TEXT, value: 'arg1'},

					{type: LINE_BREAK, value: '\n'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '*'},
					{type: WHITESPACE, value: ' '},
					{type: KEYWORD, value: '@param'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '{'},
					{type: PUNCTUATOR, value: '('},
					{type: IDENTIFIER, value: 'Element'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'Object'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'Document'},
					{type: PUNCTUATOR, value: '|'},
					{type: IDENTIFIER, value: 'Object'},
					{type: PUNCTUATOR, value: '.'},
					{type: PUNCTUATOR, value: '<'},
					{type: IDENTIFIER, value: 'string'},
					{type: PUNCTUATOR, value: ','},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '('},
					{type: IDENTIFIER, value: 'string'},
					{type: PUNCTUATOR, value: '|'},
					{type: KEYWORD, value: 'function'},
					{type: PUNCTUATOR, value: '('},
					{type: PUNCTUATOR, value: '!'},
					{type: IDENTIFIER, value: 'jQuery.event'},
					{type: PUNCTUATOR, value: '='},
					{type: PUNCTUATOR, value: ')'},
					{type: PUNCTUATOR, value: ')'},
					{type: PUNCTUATOR, value: '>'},
					{type: PUNCTUATOR, value: ')'},
					{type: PUNCTUATOR, value: '='},
					{type: PUNCTUATOR, value: '}'},
					{type: WHITESPACE, value: ' '},
					{type: TEXT, value: 'arg2'},

					{type: LINE_BREAK, value: '\n'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '*'},
					{type: WHITESPACE, value: ' '},
					{type: KEYWORD, value: '@return'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '{'},
					{type: PUNCTUATOR, value: '!'},
					{type: IDENTIFIER, value: 'jQuery'},
					{type: PUNCTUATOR, value: '}'},

					{type: LINE_BREAK, value: '\n'},
					{type: WHITESPACE, value: ' '},
					{type: PUNCTUATOR, value: '*/'},
					{type: EOF}
				]
			);
		});

		describe('Type only', () => {
			beforeEach(() => {
				tokenizer = new JSDocTokenizer({type: true});
			});

			it('Should interpret as a plain text by default', () => {
				tokenizer = new JSDocTokenizer();

				expectTokenized(['Array.<string>'], [
					{type: TEXT, value: 'Array.<string>'},
					{type: EOF}
				]);
			});

			it('Should interpret as a type with enabled option "type"', () => {
				expectTokenized(['Array.<string>'], [
					{type: IDENTIFIER, value: 'Array'},
					{type: PUNCTUATOR, value: '.'},
					{type: PUNCTUATOR, value: '<'},
					{type: IDENTIFIER, value: 'string'},
					{type: PUNCTUATOR, value: '>'},
					{type: EOF}
				]);
			});

			it('Should consume identifier with dots', () => {
				expectTokenized(['namespace.module.Class'], [
					{type: IDENTIFIER, value: 'namespace.module.Class'},
					{type: EOF}
				]);
			});

			it('Should consume type application of identifier with dots', () => {
				expectTokenized(['namespace.module.Class.<string>'], [
					{type: IDENTIFIER, value: 'namespace.module.Class'},
					{type: PUNCTUATOR, value: '.'},
					{type: PUNCTUATOR, value: '<'},
					{type: IDENTIFIER, value: 'string'},
					{type: PUNCTUATOR, value: '>'},
					{type: EOF}
				]);
			});

			it('Should consume string and number literals', () => {
				expectTokenized(['{"doubleQuotes": boolean, \'singleQuotes\': boolean, 12345: boolean}'], [
					{type: PUNCTUATOR, value: '{'},
					{type: STRING, value: '"doubleQuotes"'},
					{type: PUNCTUATOR, value: ':'},
					{type: WHITESPACE, value: ' '},
					{type: IDENTIFIER, value: 'boolean'},
					{type: PUNCTUATOR, value: ','},
					{type: WHITESPACE, value: ' '},

					{type: STRING, value: '\'singleQuotes\''},
					{type: PUNCTUATOR, value: ':'},
					{type: WHITESPACE, value: ' '},
					{type: IDENTIFIER, value: 'boolean'},
					{type: PUNCTUATOR, value: ','},
					{type: WHITESPACE, value: ' '},

					{type: NUMERIC, value: 12345},
					{type: PUNCTUATOR, value: ':'},
					{type: WHITESPACE, value: ' '},
					{type: IDENTIFIER, value: 'boolean'},
					{type: PUNCTUATOR, value: '}'},

					{type: EOF}
				]);
			});
		});

		describe('Edge cases', () => {
			beforeEach(() => {
				tokenizer = new JSDocTokenizer();
			});

			it('Empty', () => {
				expectTokenized([''], [{type: EOF}]);
			});

			it('Without type', () => {
				expectTokenized(
					[
						'/**',
						' * @param arg',
						' */'
					],
					[
						{type: PUNCTUATOR, value: '/**'},

						{type: LINE_BREAK, value: '\n'},
						{type: WHITESPACE, value: ' '},
						{type: PUNCTUATOR, value: '*'},
						{type: WHITESPACE, value: ' '},
						{type: KEYWORD, value: '@param'},
						{type: WHITESPACE, value: ' '},
						{type: TEXT, value: 'arg'},

						{type: LINE_BREAK, value: '\n'},
						{type: WHITESPACE, value: ' '},
						{type: PUNCTUATOR, value: '*/'},
						{type: EOF}
					]
				);
			});

			it('Double "*"', () => {
				expectTokenized(
					[
						'/**',
						' ** @param {} arg',
						' */'
					],
					[
						{type: PUNCTUATOR, value: '/**'},

						{type: LINE_BREAK, value: '\n'},
						{type: WHITESPACE, value: ' '},
						{type: PUNCTUATOR, value: '*'},
						{type: TEXT, value: '* @param {} arg'},

						{type: LINE_BREAK, value: '\n'},
						{type: WHITESPACE, value: ' '},
						{type: PUNCTUATOR, value: '*/'},
						{type: EOF}
					]
				);
			});

			it('Double "@"', () => {
				expectTokenized(
					[
						'/**',
						' * @@param {} arg',
						' */'
					],
					[
						{type: PUNCTUATOR, value: '/**'},

						{type: LINE_BREAK, value: '\n'},
						{type: WHITESPACE, value: ' '},
						{type: PUNCTUATOR, value: '*'},
						{type: WHITESPACE, value: ' '},
						{type: KEYWORD, value: '@'},
						{type: TEXT, value: '@param {} arg'},

						{type: LINE_BREAK, value: '\n'},
						{type: WHITESPACE, value: ' '},
						{type: PUNCTUATOR, value: '*/'},
						{type: EOF}
					]
				);
			});
		});

		// it.only('TEST', () => {
		// 	tokenizer = new JSDocTokenizer();
		//
		// 	const source = [
		// 		'/**',
		// 		' *',
		// 		' */'
		// 	].join('\n');
		//
		// 	console.log('Source:');
		// 	console.log(source);
		//
		// 	console.log('\n');
		//
		// 	console.log('Tokens:');
		// 	console.log(tokenizer.tokenize(source));
		// });
	});
});
