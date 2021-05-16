/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * ES3相当のJScirptのString拡張用クラス
 * - String.prototypeに拡張します
 */
export default class ExtendsString {

	/**
	 * @param {string} text
	 * @param {string} target
	 * @param {string} replacement
	 * @returns {string}
	 */
	static replaceAll(text, target, replacement) {
		//正規表現のgを使って全置換する
		//従って正規表現にならないようにエスケープしておく
		const regex = new RegExp(target.replace(/([\\/*+.?{}()[\]^$\-|])/g, "\\$1" ), "g");
		const ireplacement = replacement.replace(/\$/g, "$$$$");
		return text.replace(regex, ireplacement);
	}

	/**
	 * @param {string} text
	 * @returns {string}
	 */
	static trim(text) {
		return text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
	}

	/**
	 * 指定した関数を全ての文字に一律に処理を行う
	 * @param {string} text
	 * @param {function(number, string, number): boolean} func - 文字番号, 文字列, 文字コード。戻り値がfalseで処理を終了。
	 * @returns {boolean} result
	 */
	static each(text, func) {
		let out = true;
		const len = this.length;
		for(let i = 0; i < len; i = ExtendsString.offsetByCodePoints(text, i, 1)) {
			// 要 Polyfill.js
			const codepoint = text.codePointAt(i);
			const str = String.fromCodePoint(codepoint);
			if(func.call(func, i, str, codepoint) === false) {
				out = false;
				break;
			}
		}
		return out;
	}

	/**
	 * 上位のサロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isHighSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return (0xD800 <= ch) && (ch <= 0xDBFF);
	}

	/**
	 * 下位のサロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isLowSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return (0xDC00 <= ch) && (ch <= 0xDFFF);
	}
	
	/**
	 * サロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isSurrogatePairAt(text, index) {
		const ch = text.charCodeAt(index);
		return (0xD800 <= ch) && (ch <= 0xDFFF);
	}
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text - 対象テキスト
	 * @param {number} [index = 0] - インデックス
	 * @returns {number} コードポイント
	 */
	static codePointAt(text, index) {
		const index_ = (index !== undefined) ? index : 0;
		if(ExtendsString.isHighSurrogateAt(text, index_)) {
			const high = text.charCodeAt(index_);
			const low  = text.charCodeAt(index_ + 1);
			return (((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000;
		}
		else {
			return text.charCodeAt(index_);
		}
	}

	/**
	 * インデックスの前にあるコードポイント
	 * @param {String} text - 対象テキスト
	 * @param {number} index - インデックス
	 * @returns {number} コードポイント
	 */
	static codePointBefore(text, index) {
		if(!ExtendsString.isLowSurrogateAt(text, index - 1)) {
			return text.charCodeAt(index - 1);
		}
		else {
			return text.codePointAt(index - 2);
		}
	}

	/**
	 * コードポイント換算で文字列数をカウント
	 * @param {string} text - 対象テキスト
	 * @param {number} [beginIndex=0] - 最初のインデックス（省略可）
	 * @param {number} [endIndex] - 最後のインデックス（ここは含めない）（省略可）
	 * @returns {number} 文字数
	 */
	static codePointCount(text, beginIndex, endIndex) {
		let ibeginIndex = beginIndex !== undefined ? beginIndex : 0;
		let iendIndex = endIndex !== undefined ? endIndex : text.length;
		let count = 0;
		for(;beginIndex < iendIndex;ibeginIndex++) {
			count++;
			if(ExtendsString.isSurrogatePairAt(text, beginIndex)) {
				iendIndex++;
			}
		}
		return count;
	}

	/**
	 * コードポイント換算で文字列配列の位置を計算
	 * @param {string} text - 対象テキスト
	 * @param {number} index - オフセット
	 * @param {number} codePointOffset - ずらすコードポイント数
	 * @returns {number} ずらしたインデックス
	 */
	static offsetByCodePoints(text, index, codePointOffset) {
		let count = 0;
		let icodePointOffset = codePointOffset;
		let i = index;
		if(icodePointOffset === 0) {
			return i;
		}
		if(icodePointOffset > 0) {
			for(;i < text.length;i++) {
				count++;
				if(ExtendsString.isHighSurrogateAt(text, i)) {
					i++;
				}
				if(count === icodePointOffset) {
					return i + 1;
				}
			}

		}
		else {
			icodePointOffset = -icodePointOffset;
			for(;i >= 0;i--) {
				count++;
				if(ExtendsString.isLowSurrogateAt(text, i - 1)) {
					i--;
				}
				if(count === icodePointOffset) {
					return i - 1;
				}
			}
		}
		throw "error offsetByCodePoints";
	}

	/**
	 * @param {string} text
	 * @param {string} prefix
	 * @returns {boolean}
	 */
	static startsWith(text, prefix) {
		return text.indexOf(prefix) === 0;
	}

	/**
	 * @param {string} text
	 * @param {string} suffix
	 * @returns {boolean}
	 */
	static endsWith(text, suffix) {
		if(text.length < suffix.length) {
			return(false);
		}
		return text.indexOf(suffix) === (text.length - suffix.length);
	}

}
