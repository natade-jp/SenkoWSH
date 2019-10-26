/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ExtendsString from "../senko/ExtendsString.js";

/**
 * Unicodeを扱うクラス
 * @ignore
 */
export default class Unicode {

	/**
	 * 文字列をUTF32(コードポイント)の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF32(コードポイント)のデータが入った配列
	 */
	static toUTF32Array(text) {
		const utf32 = [];
		for(let i = 0; i < text.length; i = ExtendsString.offsetByCodePoints(text, i, 1)) {
			utf32.push(ExtendsString.codePointAt(text, i));
		}
		return utf32;
	}

	/**
	 * UTF32の配列から文字列に変換
	 * @param {Array<number>} utf32 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF32Array(utf32) {
		return ExtendsString.fromCodePoint(utf32);
	}

	/**
	 * 文字列をUTF16の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF16のデータが入った配列
	 */
	static toUTF16Array(text) {
		const utf16 = [];
		for(let i = 0; i < text.length; i++) {
			utf16[i] = text.charCodeAt(i);
		}
		return utf16;
	}

	/**
	 * UTF16の配列から文字列に変換
	 * @param {Array<number>} utf16 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF16Array(utf16) {
		const text = [];
		for(let i = 0; i < utf16.length; i++) {
			text[i] = String.fromCharCode(utf16[i]);
		}
		return text.join("");
	}

}
