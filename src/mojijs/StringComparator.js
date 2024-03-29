/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Japanese from "./Japanese.js";
import Unicode from "./Unicode.js";

/**
 * 日本語の文字列比較用関数を提供するクラス
 * - sortの引数で利用できます
 */
export default class StringComparator {

	/**
	 * 文字列の揺れを除去し正規化します。
	 * @param {String} string_data - 正規化したいテキスト
	 * @returns {String} 正規化後のテキスト
	 * @private
	 * @ignore
	 */
	static toNormalizeString(string_data) {
		let normalize_text = null;
		// NORM_IGNOREWIDTH 半角全角区別しない（半角英数記号と全角カタカナに統一）
		normalize_text = Japanese.toHalfWidthAsciiCode(Japanese.toHalfWidthAsciiCode(string_data));
		// LCMAP_LOWERCASE 半角に統一
		normalize_text = normalize_text.toLowerCase();
		// NORM_IGNOREKANATYPE ひらがなとカタカナを区別しない
		normalize_text = Japanese.toHiragana(normalize_text);
		// NORM_IGNORENONSPACE 簡単に場所をとらない記号を削除
		normalize_text = normalize_text.replace(/[゛゜]/g, "");
		// NORM_IGNORESYMBOLS 英文法の記号を無視
		normalize_text = normalize_text.replace(/["'-]/g, "");
		return normalize_text;
	}

	/**
	 * ASCIIコードが半角数値かどうかを判定する
	 * @param {number} string_number - ASCIIコード
	 * @returns {Boolean} 数値ならTRUE
	 * @private
	 * @ignore
	 */
	static isNumberAscii(string_number) {
		const ASCII_0 = 0x30;
		const ASCII_9 = 0x39;
		return (ASCII_0 <= string_number) && (string_number <= ASCII_9);
	}

	/**
	 * ASCIIコード配列の中で指定した位置から数値が何バイト続くか
	 * @param {Array<number>} string_number_array - ASCIIコードの配列
	 * @param {number} offset - どの位置から調べるか
	 * @returns {number} 数値ならTRUE
	 * @private
	 * @ignore
	 */
	static getNumberAsciiLength(string_number_array, offset) {
		for(let i = offset; i < string_number_array.length; i++) {
			if(!StringComparator.isNumberAscii(string_number_array[i])) {
				return (i - offset);
			}
		}
		return (string_number_array.length - offset);
	}

	/**
	 * ASCIIコード配列の中の指定した位置にある数値データ同士をCompareする
	 * @param {Array<number>} t1 - ASCIIコードの配列（比較元）
	 * @param {number} t1off - どの位置から調べるか
	 * @param {number} t1size - 調べるサイズ
	 * @param {Array<number>} t2 - ASCIIコードの配列（比較先）
	 * @param {number} t2off - どの位置から調べるか
	 * @param {number} t2size - 調べるサイズ
	 * @returns {number} Compare結果
	 * @private
	 * @ignore
	 */
	static compareNumber(t1, t1off, t1size, t2, t2off, t2size) {
		const ASCII_0 = 0x30;
		const t1end = t1off + t1size;
		const t2end = t2off + t2size;
		// 前方から調査
		let t1p = t1off;
		let t2p = t2off;
		// 先頭の0は飛ばして比較したい
		// 0以外の数値がどこに含まれているか調査
		for(;t1p < t1end;t1p++) {
			if(t1[t1p] !== ASCII_0) {
				break;
			}
		}
		for(;t2p < t2end;t2p++) {
			if(t2[t2p] !== ASCII_0) {
				break;
			}
		}
		// 0しかなかった場合
		if((t1p == t1end)||(t2p == t2end)) {
			if(t1p != t1end) { //t2pのみはみだした == 0
				return 1;
			}
			else if(t2p != t2end) {
				return -1;
			}
			else {
				return 0;
			}
		}
		// 桁数のみでどちらが大きいか比較
		const t1keta = t1size - (t1p - t1off);
		const t2keta = t2size - (t2p - t2off);
		if(t1keta > t2keta) {
			return 1;
		}
		else if(t1keta < t2keta) {
			return -1;
		}
		// 同じ桁同士の比較
		for(;t1p < t1end;) {
			if(t1[t1p] > t2[t2p]) {
				return 1;
			}
			else if(t1[t1p] < t2[t2p]) {
				return -1;
			}
			t1p++;
			t2p++;
		}
		return 0;
	}

	/**
	 * ASCIIコード配列の同士をCompareする
	 * @param {Array<number>} t1 - ASCIIコードの配列（比較元）
	 * @param {Array<number>} t2 - ASCIIコードの配列（比較先）
	 * @returns {number} Compare結果
	 * @private
	 * @ignore
	 */
	static compareText(t1, t2) {
		const l1 = t1.length;
		const l2 = t2.length;
		if((l1 === 0) && (l2 === 0)) {
			return 0;
		}
		if(l1 === 0) {
			return -1;
		}
		if(l2 === 0) {
			return 1;
		}
		//この地点で両方とも長さが1より大きい
		let t1off = 0;
		let t2off = 0;
		while(t1off <= l1 && t2off <= l2) {
			const t1isnum = StringComparator.isNumberAscii(t1[t1off]);
			const t2isnum = StringComparator.isNumberAscii(t2[t2off]);
			//文字目の種類が違う
			if(t1isnum !== t2isnum) {
				if(t1isnum) {
					return -1;//数値が前
				}
				else {
					return 1;//文字が後ろ
				}
			}
			//両方とも数値
			if(t1isnum) {
				const t1size = StringComparator.getNumberAsciiLength(t1, t1off);
				const t2size = StringComparator.getNumberAsciiLength(t2, t2off);
				const r = StringComparator.compareNumber(t1,t1off,t1size,t2,t2off,t2size);
				if(r !== 0) {
					return r;
				}
				t1off += t1size;
				t2off += t2size;
			}
			//両方とも文字列
			else {
				if(t1[t1off] > t2[t2off]) {
					return 1;
				}
				else if(t1[t1off] < t2[t2off]) {
					return -1;
				}
				t1off++;
				t2off++;
			}
			//両方ともオーバー
			if((t1off >= l1)&&(t2off >= l2)) {
				//長さも等しい
				if(l1 === l2) {
					return 0;
				}
				else if(l1 > l2) {
					return 1;
				}
				else {
					return -1;
				}
			}
			//片方のほうがサイズが大きい
			else if(t2off >= l2) { //t2の方が短い
				return 1;
			}
			else if(t1off >= l1) { //t1の方が短い
				return -1;
			}
		}
		// ※ここには達成しない
		return 0;
	}

	/**
	 * 2つの文字列を比較する
	 * 
	 * @param {any} a - 比較元
	 * @param {any} b - 比較先
	 * @returns {number} Compare結果
	 */
	static DEFAULT(a, b) {
		if(a === b) {
			return 0;
		}
		if(typeof a === typeof b) {
			return (a < b ? -1 : 1);
		}
		return ((typeof a < typeof b) ? -1 : 1);
	}

	/**
	 * 2つの文字列を自然順に比較を行う（自然順ソート（Natural Sort）用）
	 * - 入力引数は文字列化して比較します
	 * 
	 * @param {any} a - 比較元
	 * @param {any} b - 比較先
	 * @returns {number} Compare結果
	 */
	static NATURAL(a, b) {
		if((a.toString === undefined) || (b.toString === undefined)) {
			return 0;
		}
		const a_str = Unicode.toUTF16Array(StringComparator.toNormalizeString(a.toString()));
		const b_str = Unicode.toUTF16Array(StringComparator.toNormalizeString(b.toString()));
		return StringComparator.compareText(a_str, b_str);
	}

}
