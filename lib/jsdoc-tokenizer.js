const {
	code: {
		isLineTerminator,
		isWhiteSpace,
		isIdentifierStartES5,
		isIdentifierPartES5,
		isDecimalDigit
	}
} = require('esutils');

/**
 * @typedef {{
 *     type: JSDocTokenizer.Token,
 *     value: (string|number|undefined)
 * }}
 */
let JSDocToken;

/**
 * @typedef {{
 *     type: JSDocTokenizer.Token,
 *     value: (string|number|undefined),
 *     range: (Array<number>)
 * }}
 */
let JSDocTokenWithRange;


/**
 */
class JSDocTokenizer {
	/**
	 * @param {{
	 *     range: (boolean|undefined),
	 *     type: (boolean|undefined)
	 * }=} opt_options
	 */
	constructor({range = false, type = false} = {}) {
		/**
		 * @type {{range: boolean}}
		 * @protected
		 */
		this._options = {range, type};

		/**
		 * @type {string}
		 * @protected
		 */
		this._source = '';

		/**
		 * @type {number}
		 * @protected
		 */
		this._index = -1;

		/**
		 * @type {string}
		 * @protected
		 */
		this._char = '';

		/**
		 * @type {number}
		 * @protected
		 */
		this._charCode = NaN;

		/**
		 * @type {number}
		 * @protected
		 */
		this._openBracesCount = 0;

		/**
		 * @type {?JSDocToken}
		 * @protected
		 */
		this._previousNonWhitespaceToken = null;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isEOFReached = false;
	}

	/**
	 * @param {string} source
	 * @return {Array<JSDocToken|JSDocTokenWithRange>}
	 */
	tokenize(source) {
		const tokens = [];

		this._source = source;
		this._advance();

		let lastToken;
		while (!lastToken || lastToken.type !== JSDocTokenizer.Token.EOF) {
			tokens.push(lastToken = this._parseNextToken());
		}

		this._reset();

		return tokens;
	}

	/**
	 * @protected
	 */
	_reset() {
		this._source = '';
		this._index = -1;
		this._char = '';
		this._charCode = NaN;
		this._openBracesCount = 0;
		this._previousNonWhitespaceToken = null;
		this._isEOFReached = false;
	}

	/**
	 * @protected
	 */
	_advance() {
		if (this._isEOFReached) {
			throw new Error('EOF is reached, advance isn\'t possible');
		}

		this._index++;

		this._char = this._source[this._index];
		this._charCode = this._source.charCodeAt(this._index);

		if (this._char) {
			debug('advance', JSON.stringify(this._char), `(0x${this._charCode.toString(16).toUpperCase()})`);
		}

		if (!this._isEOFReached && this._index === this._source.length) {
			this._isEOFReached = true;

			debug('EOF reached');
		}
	}

	/**
	 * @param {number=} offset
	 * @return {{
	 *     char: string,
	 *     code: number
	 * }}
	 * @protected
	 */
	_next(offset = 1) {
		const nextIndex = this._index + offset;
		const nextChar = this._source[nextIndex];

		if (nextChar) {
			return {
				char: nextChar,
				code: this._source.charCodeAt(nextIndex)
			};
		}

		return {
			char: '',
			code: NaN
		};
	}

	/**
	 * @return {boolean}
	 * @protected
	 */
	_isTypeContext() {
		return !!this._openBracesCount || this._options.type;
	}

	/**
	 * @protected
	 * @return {Array<JSDocToken|JSDocTokenWithRange>}
	 */
	_parseNextToken() {
		const {KEYWORD, IDENTIFIER, NUMERIC, WHITESPACE} = JSDocTokenizer.Token;

		const startIndex = this._index;

		let type = (
			this._parseEOF() ||
			this._parseStartMark() ||
			this._parseEndMark() ||
			this._parseStar() ||
			this._parseTag() ||
			this._parsePunctuator() ||
			this._parseStringLiteral() ||
			this._parseNumericLiteral() ||
			this._parseWhitespace() ||
			this._parseLineBreak() ||
			this._parseIdentifier() ||
			this._parseText()
		);

		const range = [startIndex, this._index];
		const value = this._source.slice(...range);

		if (type === IDENTIFIER && value === 'function') {
			type = KEYWORD;
		}

		const result = {type};
		if (value) {
			result.value = type === NUMERIC ? parseInt(value, 10) : value;
		}
		if (this._options.range) {
			result.range = range;
		}

		debug(value ?
			`parsed ${type}: ${JSON.stringify(value)}` :
			`parsed ${type}`
		);

		if (type !== WHITESPACE) {
			this._previousNonWhitespaceToken = {type, value};
		}

		return result;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseEOF() {
		if (this._isEOFReached) {
			return JSDocTokenizer.Token.EOF;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseStartMark() {
		if (
			this._char === '/' &&
			this._next(1).char === '*' &&
			this._next(2).char === '*'
		) {
			this._advance(); // '/'
			this._advance(); // '*'
			this._advance(); // '*'

			return JSDocTokenizer.Token.PUNCTUATOR;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseEndMark() {
		if (this._char === '*' && this._next().char === '/') {
			this._advance(); // '*'
			this._advance(); // '/'

			return JSDocTokenizer.Token.PUNCTUATOR;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseStar() {
		const {PUNCTUATOR, LINE_BREAK} = JSDocTokenizer.Token;

		if (
			this._char === '*' && (
				!this._previousNonWhitespaceToken || this._previousNonWhitespaceToken.type === LINE_BREAK
			)
		) {
			this._advance(); // '*'

			return PUNCTUATOR;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseTag() {
		const {KEYWORD, PUNCTUATOR, LINE_BREAK} = JSDocTokenizer.Token;

		if (
			this._char === '@' && (
				!this._previousNonWhitespaceToken || (
					this._previousNonWhitespaceToken.type === LINE_BREAK || (
						this._previousNonWhitespaceToken.type === PUNCTUATOR &&
						this._previousNonWhitespaceToken.value === '*'
					)
				)
			)
		) {
			this._advance(); // '@'

			while (isASCIIAlphanumeric(this._charCode)) {
				this._advance();
			}

			return KEYWORD;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parsePunctuator() {
		const {KEYWORD, PUNCTUATOR} = JSDocTokenizer.Token;

		const punctuators = [
			'{', '}', '(', ')',
			'[', ']', '<', '>',
			'|', ':', '!', '?',
			'*', '=', ',', '.'
		];

		if (punctuators.includes(this._char)) {
			if (
				this._char === '{' &&
				this._openBracesCount || (
					this._previousNonWhitespaceToken &&
					this._previousNonWhitespaceToken.type === KEYWORD &&
					this._previousNonWhitespaceToken.value.startsWith('@')
				)
			) {
				this._openBracesCount++;
			}

			if (!this._isTypeContext()) {
				return null;
			}

			if (this._char === '}' && this._openBracesCount) {
				this._openBracesCount--;
			}

			if (
				this._char === '.' &&
				this._next(1).char === '.' &&
				this._next(2).char === '.'
			) {
				this._advance(); // '.'
				this._advance(); // '.'
				this._advance(); // '.'
			} else {
				this._advance();
			}

			return PUNCTUATOR;
		}

		return null;
	}
	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseStringLiteral() {
		if (isQuote(this._charCode)) {
			const quote = this._char;

			let nextQuoteOffset = 1;
			while (!isNaN(nextQuoteOffset)) {
				const next = this._next(nextQuoteOffset);
				if (next.char === quote) {
					break;
				}

				// EOF reached
				if (!next.char) {
					nextQuoteOffset = NaN;
				}

				nextQuoteOffset++;
			}

			// Quotes are not balanced
			if (isNaN(nextQuoteOffset)) {
				return null;
			}

			this._advance(); // ''' or '"'

			while (nextQuoteOffset) {
				this._advance();

				nextQuoteOffset--;
			}

			return JSDocTokenizer.Token.STRING;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseNumericLiteral() {
		if (isDecimalDigit(this._charCode)) {
			while (isDecimalDigit(this._charCode)) {
				this._advance();
			}

			return JSDocTokenizer.Token.NUMERIC;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseWhitespace() {
		if (isWhiteSpace(this._charCode)) {
			this._advance();

			return JSDocTokenizer.Token.WHITESPACE;
		}

		return null;
	}
	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseLineBreak() {
		if (isLineTerminator(this._charCode)) {
			this._advance();

			return JSDocTokenizer.Token.LINE_BREAK;
		}

		return null;
	}
	/**
	 * @protected
	 * @return {?JSDocTokenizer.Token}
	 */
	_parseIdentifier() {
		if (this._isTypeContext() && isIdentifierStartES5(this._charCode)) {
			this._advance();

			while (
				isIdentifierPartES5(this._charCode) || (
					this._char === '.' &&
					this._next().char !== '<'
				)
			) {
				this._advance();
			}

			return JSDocTokenizer.Token.IDENTIFIER;
		}

		return null;
	}

	/**
	 * @protected
	 * @return {JSDocTokenizer.Token}
	 */
	_parseText() {
		while (!isLineTerminator(this._charCode) && !this._isEOFReached) {
			this._advance();
		}

		return JSDocTokenizer.Token.TEXT;
	}
}


/**
 * @enum {string}
 */
JSDocTokenizer.Token = {
	KEYWORD: 'Keyword',
	IDENTIFIER: 'Identifier',
	STRING: 'String',
	NUMERIC: 'Numeric',
	TEXT: 'Text',
	PUNCTUATOR: 'Punctuator',
	WHITESPACE: 'Whitespace',
	LINE_BREAK: 'LineBreak',
	EOF: 'EOF'
};


/**
 * @param {...*} args
 */
function debug(...args) {
	if (process.env.DEBUG) {
		console.log(...args); // eslint-disable-line no-console
	}
}

/**
 * @param {number} charCode
 * @return {boolean}
 */
function isQuote(charCode) {
	return charCode === 0x22 || charCode === 0x27;
}

/**
 * @param {number} charCode
 * @return {boolean}
 */
function isASCIIAlphanumeric(charCode) {
	return (
		(charCode >= 0x61 && charCode <= 0x7A) ||
		(charCode >= 0x41 && charCode <= 0x5A) ||
		(charCode >= 0x30 && charCode <= 0x39)
	);
}

module.exports = JSDocTokenizer;
