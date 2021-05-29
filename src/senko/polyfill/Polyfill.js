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
if(!("JSON" in globalThis)) {
	// @ts-ignore
	JSON = {};
}

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
		extendClass(String, typeExtendsString);

		// 安定ソートへ差し替え ECMAScript 2019
		// @ts-ignore
		Array.sort = typeExtendsArray.sort;

		// IE9以降の splice 動作の仕様へ差し替え
		{
			// splice の動作チェック
			const A = [0, 0];
			A.splice(1);
			if(A.length !== 1) {
				// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
				// 2番目の引数が省略された場合の動作の仕様を合わせる
				const splice_buffer = Array.prototype.splice;
				Array.prototype.splice = function() {
					const x = [];
					for(var i = 0 ; i < arguments.length ; i++) {
						x.push(arguments[i]);
					}
					if(arguments.length === 1) {
						x.push(this.length - arguments[0]);
					}
					return splice_buffer.apply(this, x);
				};
			}
		}

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
		if(!Math.cbrt) {
			Math.cbrt = function(x) {
				return Math.exp(Math.log(x) / 3.0);
			};
		}
		if(!Math.expm1) {
			Math.expm1 = function(x) {
				return Math.exp(x) - 1.0;
			};
		}
		if(!Math.log1p) {
			Math.log1p = function(x) {
				return Math.log(x + 1.0);
			};
		}
		if(!Math.log2) {
			Math.log2 = function(x) {
				return Math.log(x) / Math.log(2);
			};
		}
		if(!Math.log10) {
			Math.log10 = function(x) {
				return Math.log(x) / Math.log(10);
			};
		}
		if(Math.E === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.E = 2.718281828459045;
		}
		if(Math.LN10 === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.LN10 = Math.log(10);
		}
		if(Math.LN2 === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.LN2 = Math.log(2);
		}
		if(Math.LOG2E === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.LOG2E = Math.log2(Math.E);
		}
		if(Math.LOG10E === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.LOG10E = Math.log10(Math.E);
		}
		if(Math.PI === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.PI = 3.141592653589793;
		}
		if(Math.SQRT1_2 === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.SQRT1_2 = Math.pow(0.5, 0.5);
		}
		if(Math.SQRT2 === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Math.SQRT2 = Math.pow(2, 0.5);
		}
		if(!Number.isFinite) {
			Number.isFinite = isFinite;
		}
		if(!Number.isInteger) {
			Number.isInteger = function(x) {
				// @ts-ignore
				return isFinite(x) && Math.trunc(x) === x;
			};
		}
		if(!Number.isNaN) {
			Number.isNaN = isNaN;
		}
		if(Number.NaN === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.NaN = NaN;
		}
		if(Number.EPSILON === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.EPSILON = 2.220446049250313e-16;
		}
		if(Number.MIN_SAFE_INTEGER === undefined) {
			// @ts-ignore
			// eslint-disable-next-line no-global-assign
			Number.MIN_SAFE_INTEGER = -9007199254740991;
		}
		if(Number.MAX_SAFE_INTEGER === undefined) {
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
		if(!Number.isSafeInteger) {
			// @ts-ignore
			Number.isSafeInteger = function(x) {
				// @ts-ignore
				return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
			};
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
		if(!Date.now) {
			// @ts-ignore
			Date.now = function() {
				return (new Date()).getTime();
			};
		}
		if(!JSON.parse) {
			JSON.parse = function(json_text) {
				return eval("(" + json_text + ")");
			};
		}
		if(!JSON.stringify) {
			/**
			 * @type {Object<string, string>} 
			 */
			const escapeMap = {
				"\u0022" : "\\\"",
				"\u005C" : "\\\\",
				"\u002F" : "\\/",
				"\u0008" : "\\b",
				"\u000C" : "\\f",
				"\u000A" : "\\n",
				"\u000D" : "\\r",
				"\u0009" : "\\t"
			};
			/**
			 * @param {string} str
			 * @returns {string}
			 */
			const escapeString = function(str) {
				return escapeMap[str];
			};
			/**
			 * https://tools.ietf.org/html/rfc8259
			 * @param {string} str
			 * @returns {string}
			 */
			const escape = function(str) {
				return str.replace(/[\u0022\u005C\u002F\u0008\u000C\u000A\u000D\u0009]/g, escapeString);;
			};
			/**
			 * @param {any} data
			 * @returns {string}
			 */
			const stringify = function(data) {
				const type = Object.prototype.toString.call(data);
				if((type === "[object Number]") || (type === "[object Boolean]")) {
					return data.toString();
				}
				else if(type === "[object String]") {
					return "\"" + escape(data) + "\"";
				}
				else if(type === "[object Date]") {
					// JScript には toISOString がないので。
					return "\"" + data.toGMTString() + "\"";
				}
				else if(type === "[object Function]") {
					return "null";
				}
				else if(type === "[object RegExp]") {
					return "{}";
				}
				else if(data === null) {
					return "null";
				}
				else if(data === undefined) {
					return "undefined";
				}
				else if(type === "[object Array]") {
					/**
					 * @type {string[]}
					 */
					let output = [];
					output.push("[");
					/**
					 * @type {string[]}
					 */
					let array_data = [];
					for(let i = 0; i < data.length; i++) {
						array_data.push(stringify(data[i]));
					}
					output.push(array_data.join(","));
					output.push("]");
					return output.join("");
				}
				else if(type === "[object Object]") {
					/**
					 * @type {string[]}
					 */
					let output = [];
					output.push("{");
					/**
					 * @type {string[]}
					 */
					let object_data = [];
					for(const key in data) {
						const value = data[key];
						// 関数の場合は無視する
						if(Object.prototype.toString.call(value) === "[object Function]") {
							continue;
						}
						/**
						 * @type {string[]}
						 */
						const line = [];
						line.push("\"" + key + "\"");
						line.push(":");
						line.push(stringify(value));
						object_data.push(line.join(""));
					}
					output.push(object_data.join(","));
					output.push("}");
					return output.join("");
				}
				else {
					return "\"" + escape(data.toString()) + "\""
				}
			};
			JSON.stringify = stringify;
		}
	}
}

// @ts-ignore
Polyfill.run();

