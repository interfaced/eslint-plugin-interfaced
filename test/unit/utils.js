const {describe, it} = require('mocha');
const {expect} = require('chai');

const utils = require('../../lib/utils');

describe('utils', () => {
	describe('wrapJSDocContent', () => {
		[
			[
				concat(
					'*',
					' * @private',
					' * @abstract',
					' '
				),
				concat(
					'@public',
					'@abstract'
				),
				concat(
					'/**',
					' * @public',
					' * @abstract',
					' */'
				)
			],
			[
				concat(
					'* @private '
				),
				concat(
					'@public'
				),
				concat(
					'/** @public */'
				)
			],
			[
				concat(
					'* @private',
					' * @abstract',
					' '
				),
				concat(
					'@public',
					'@abstract'
				),
				concat(
					'/** @public',
					' * @abstract',
					' */'
				)
			],
			[
				concat(
					'*',
					'    * @private',
					'    * @abstract',
					'    '
				),
				concat(
					'@public',
					'@abstract'
				),
				concat(
					'/**',
					'    * @public',
					' * @abstract',
					'    */'
				)
			],
			[
				concat(
					'*    @private    '
				),
				concat(
					'@public'
				),
				concat(
					'/**    @public    */'
				)
			],
			[
				concat(
					'',
					' * @private',
					' * @abstract',
					' '
				),
				concat(
					'@public',
					'@abstract'
				),
				concat(
					'/*',
					' * @public',
					' * @abstract',
					' */'
				)
			],
			[
				concat(
					' @private '
				),
				concat(
					'@public'
				),
				concat(
					'/* @public */'
				)
			]
		].forEach(([original, content, expected], index) => {
			it(`#${index + 1}`, () => {
				expect(utils.wrapJSDocContent(original, content, '')).equal(expected);
			});
		});
	});
});

/**
 * @param {...string} args
 * @return {string}
 */
function concat(...args) {
	return args.join('\n');
}
