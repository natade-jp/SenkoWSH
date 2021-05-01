/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import typeExtendsArray from "./ExtendsArray.js";
import typeExtendsObject from "./ExtendsObject.js";
import typeExtendsString from "./ExtendsString.js";

/**
 * グローバル空間
 * 参考
 *  JavaScript大域変数の存在確認
 *  https://m-hiyama.hatenablog.com/entry/20071126/1196037633
 * @private
 */
var global_var = ( function() { return this; } ).apply( null, [] );

if(!("globalThis" in global_var)) {
	// @ts-ignore
	globalThis = global_var;
}
if(!("global" in globalThis)) {
	// @ts-ignore
	global = globalThis;
}
if(!("window" in globalThis)) {
	// @ts-ignore
	window = globalThis;
}

/**
 * @type {typeof typeExtendsArray}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ExtendsArray = typeExtendsArray;

/**
 * @type {typeof typeExtendsObject}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ExtendsObject = typeExtendsObject;

/**
 * @type {typeof typeExtendsString}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ExtendsString = typeExtendsString;

/**
 * @param {any} original 
 * @param {any} extension
 * @returns {any}
 * @private
 * @ignore
 */
const extendClass = function(original, extension) {
	for(const key in extension) {
		// 未設定なら設定する
		if(!original.prototype[key]) {
			original.prototype[key] = function() {
				const x = [];
				x.push(this);
				for(let i = 0 ; i < arguments.length ; i++) {
					x.push(arguments[i]);
				}
				return extension[key].apply(this, x);
			};
		}
	}
};

extendClass(Array, typeExtendsArray);
extendClass(Object, typeExtendsObject);
extendClass(String, typeExtendsString);






















/**
 * Class for improving compatibility.
 * @ignore
 */
export default class Polyfill {

	/**
	 * Improved compatibility
	 * @private
	 * @ignore
	 */
	static run() {
		if(!Math.imul) {
			Math.imul = function(x1, x2) {
				let y = ((x1 & 0xFFFF) * (x2 & 0xFFFF)) >>> 0;
				let b = (x1 & 0xFFFF) * (x2 >>> 16);
				y = (y + ((b & 0xFFFF) << 16)) >>> 0;
				b = (x1 >>> 16) * (x2 & 0xFFFF);
				y = (y + ((b & 0xFFFF) << 16));
				return (y & 0xFFFFFFFF);
			};
		}
		if(!Math.trunc) {
			Math.trunc = function(x) {
				return x > 0 ? Math.floor(x) : Math.ceil(x);
			};
		}
		if(!Number.isFinite) {
			Number.isFinite = isFinite;
		}
		if(!Number.isInteger) {
			Number.isInteger = function(x) {
				// @ts-ignore
				return isFinite(x) && ((x | 0) === x);
			};
		}
		if(!Number.isNaN) {
			Number.isNaN = isNaN;
		}
		if(!Number.NaN) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.NaN = NaN;
		}
		if(!Number.EPSILON) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.EPSILON = 2.220446049250313e-16;
		}
		if(!Number.MIN_SAFE_INTEGER) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.MIN_SAFE_INTEGER = -9007199254740991;
		}
		if(!Number.MAX_SAFE_INTEGER) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.MAX_SAFE_INTEGER = 9007199254740991;
		}
		if(!Number.parseFloat) {
			Number.parseFloat = parseFloat;
		}
		if(!Number.parseInt) {
			Number.parseInt = parseInt;
		}
		if(!Array.isArray) {
			// @ts-ignore
			Array.isArray = function(x) {
				return Object.prototype.toString.call(x) === "[object Array]";
			};
		}
		if(!Array.of) {
			// @ts-ignore
			Array.of = function() {
				return Array.prototype.slice.call(arguments);
			};
		}
		if(!String.fromCodePoint) {
			/**
			 * コードポイントの数値データをUTF16の配列に変換
			 * @param {...(number|Array<number>)} codepoint - 変換したいUTF-32の配列、又はコードポイントを並べた可変引数
			 * @returns {Array<number>} 変換後のテキスト
			 * @private
			 */
			const toUTF16ArrayfromCodePoint = function() {
				/**
				 * @type {Array<number>}
				 * @private
				 */
				const utf16_array = [];
				/**
				 * @type {Array<number>}
				 * @private
				 */
				let codepoint_array = [];
				if(arguments[0].length) {
					codepoint_array = arguments[0];
				}
				else {
					for(let i = 0;i < arguments.length;i++) {
						codepoint_array[i] = arguments[i];
					}
				}
				for(let i = 0;i < codepoint_array.length;i++) {
					const codepoint = codepoint_array[i];
					if(0x10000 <= codepoint) {
						const high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
						const low  = (codepoint & 0x3FF) + 0xDC00;
						utf16_array.push(high);
						utf16_array.push(low);
					}
					else {
						utf16_array.push(codepoint);
					}
				}
				return utf16_array;
			}

			/**
			 * コードポイントの数値データを文字列に変換
			 * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
			 * @returns {string} 変換後のテキスト
			 */
			String.fromCodePoint = function(codepoint) {
				let utf16_array = null;
				if(codepoint instanceof Array) {
					utf16_array = toUTF16ArrayfromCodePoint(codepoint);
				}
				else {
					const codepoint_array = [];
					for(let i = 0;i < arguments.length;i++) {
						codepoint_array[i] = arguments[i];
					}
					utf16_array = toUTF16ArrayfromCodePoint(codepoint_array);
				}
				const text = [];
				for(let i = 0;i < utf16_array.length;i++) {
					text[text.length] = String.fromCharCode(utf16_array[i]);
				}
				return text.join("");
			};

		}
	}
}

// @ts-ignore
Polyfill.run();

