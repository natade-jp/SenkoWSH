import System from "./System";

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
 * 書式に合わせて文字列を組み立てる関数を提供するクラス
 */
export default class Format {

	/**
	 * printf に似た書式に合わせて文字列を組み立てる
	 * - ロケール、日付時刻等はサポートしていません。
	 * - 変換指定子のpとnはサポートしていません。
	 * @param {String} text 
	 * @param {...any} parm パラメータは可変引数
	 * @returns {String}
	 */
	static textf() {
		let parm_number = 1;
		const parm = arguments;
		/**
		 * @param {number} x
		 * @returns {number}
		 * @private
		 */
		const toUnsign  = function(x) {
			if(x >= 0) {
				return x;
			}
			else {
				const ix = -x;
				//16ビットごとに分けてビット反転
				let high = ((~ix) >> 16) & 0xFFFF;
				high *= 0x00010000;
				const low  =  (~ix) & 0xFFFF;
				return high + low + 1;
			}
		};
		/**
		 * @param {string} istr
		 * @returns {string}
		 * @private
		 */
		const func = function(istr) {
			// 1文字目の%を除去
			let str = istr.substring(1, istr.length);
			let buff;
			// [6] 変換指定子(最後の1文字を取得)
			buff = str.match(/.$/);
			const type = buff[0];
			if(type === "%") {
				return("%");
			}
			// ここからパラメータの解析開始
			// [1] 引数順
			buff = str.match(/^[0-9]+\$/);
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				// 数字だけ切り出す
				buff = buff.substring(0, buff.length - 1);
				// 整数へ
				parm_number = parseInt(buff , 10);
			}
			// 引数を取得
			let parameter = parm[parm_number];
			if(typeof parameter !== "string" && typeof parameter !== "number") {
				parameter = parameter.toString();
			}
			parm_number = parm_number + 1;
			// [2] フラグ
			buff = str.match(/^[-+ #0]+/);
			let isFlagSharp = false;
			let isFlagTextAlignLeft = false;
			const isFlagFill = false;
			let sFillCharacter = " ";
			let isFlagFillZero = false;
			let isFlagDrawSign = false;
			let sSignCharacter = "";
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				if(buff.indexOf("#") !== -1) {
					isFlagSharp = true;
				}
				if(buff.indexOf("-") !== -1) {
					isFlagTextAlignLeft = true;
				}
				if(buff.indexOf(" ") !== -1) {
					isFlagDrawSign = true;
					sSignCharacter = " ";
				}
				if(buff.indexOf("+") !== -1) {
					isFlagDrawSign = true;
					sSignCharacter = "+";
				}
				if(buff.indexOf("0") !== -1) {
					isFlagFillZero = true;
					sFillCharacter = "0";
				}
			}
			// [3] 最小フィールド幅
			let width = 0;
			buff = str.match(/^([0-9]+|\*)/);
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				if(buff.indexOf("*") !== -1) { // 引数で最小フィールド幅を指定
					width = parameter;
					parameter = parm[parm_number];
					parm_number = parm_number + 1;
				}
				else { // 数字で指定
					width = parseInt(buff , 10);
				}
			}
			// [4] 精度の指定
			let isPrecision = false;
			let precision = 0;
			buff = str.match(/^(\.((-?[0-9]+)|\*)|\.)/); //.-3, .* , .
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				isPrecision = true;
				if(buff.indexOf("*") !== -1) { // 引数で精度を指定
					precision = parameter;
					parameter = parm[parm_number];
					parm_number = parm_number + 1;
				}
				else if(buff.length === 1) { // 小数点だけの指定
					precision = 0;
				}
				else { // 数字で指定
					buff = buff.substring(1, buff.length);
					precision = parseInt(buff , 10);
				}
			}
			// 長さ修飾子(非サポート)
			buff = str.match(/^hh|h|ll|l|L|z|j|t/);
			if(buff !== null) {
				str = str.substring(buff.length, str.length);
			}
			// 文字列を作成する
			let output = "";
			let isInteger = false;
			switch(type.toLowerCase()) {
				// 数字関連
				case "d":
				case "i":
				case "u":
				case "b":
				case "o":
				case "x":
					isInteger = true;
					// falls through
				case "e":
				case "f":
				case "g":
				{
					let sharpdata = "";
					let textlength = 0; // 現在の文字を構成するために必要な長さ
					let spacesize;  // 追加する横幅
					// 整数
					if(isInteger) {
						// 数字に変換
						if(isNaN(parameter)) {
							parameter = parseInt(parameter, 10);
						}
						// 正負判定
						if((type === "d") || (type === "i")) {
							if(parameter < 0) {
								sSignCharacter = "-";
								parameter  = -parameter;
							}
							parameter  = Math.floor(parameter);
						}
						else {
							if(parameter >= 0) {
								parameter  = Math.floor(parameter);
							}
							else {
								parameter  = Math.ceil(parameter);
							}
						}
					}
					// 実数
					else {
						// 数字に変換
						if(isNaN(parameter)) {
							parameter = parseFloat(parameter);
						}
						// 正負判定
						if(parameter < 0) {
							sSignCharacter = "-";
							parameter  = -parameter;
						}
						if(!isPrecision) {
							precision = 6;
						}
					}
					// 文字列を作成していく
					switch(type.toLowerCase()) {
						case "d":
						case "i":
							output += parameter.toString(10);
							break;
						case "u":
							output += toUnsign(parameter).toString(10);
							break;
						case "b":
							output += toUnsign(parameter).toString(2);
							if(isFlagSharp) {
								sharpdata = "0b";
							}
							break;
						case "o":
							output  += toUnsign(parameter).toString(8);
							if(isFlagSharp) {
								sharpdata = "0";
							}
							break;
						case "x":
						case "X":
							output  += toUnsign(parameter).toString(16);
							if(isFlagSharp) {
								sharpdata = "0x";
							}
							break;
						case "e":
							output += parameter.toExponential(precision);
							break;
						case "f":
							output += parameter.toFixed(precision);
							break;
						case "g":
							if(precision === 0) { // 0は1とする
								precision = 1;
							}
							output += parameter.toPrecision(precision);
							// 小数点以下の語尾の0の削除
							if((!isFlagSharp) && (output.indexOf(".") !== -1)) {
								output = output.replace(/\.?0+$/, "");  // 1.00 , 1.10
								output = output.replace(/\.?0+e/, "e"); // 1.0e , 1.10e
							}
							break;
						default:
							// 上でチェックしているため、ありえない
							break;
					}
					// 整数での後処理
					if(isInteger) {
						if(isPrecision) { // 精度の付け足し
							spacesize  = precision - output.length;
							for(let i = 0; i < spacesize; i++) {
								output = "0" + output;
							}
						}
					}
					// 実数での後処理
					else {
						if(isFlagSharp) { 
							// sharp指定の時は小数点を必ず残す
							if(output.indexOf(".") === -1) {
								if(output.indexOf("e") !== -1) {
									output = output.replace("e", ".e");
								}
								else {
									output += ".";
								}
							}
						}
					}
					// 指数表記は、3桁表示(double型のため)
					if(output.indexOf("e") !== -1) {
						/**
						 * @param {string} str
						 * @returns {string}
						 * @private
						 */
						const buff = function(str) {
							const l   = str.length;
							if(str.length === 3) { // e+1 -> e+001
								return(str.substring(0, l - 1) + "00" + str.substring(l - 1, l));
							}
							else { // e+10 -> e+010
								return(str.substring(0, l - 2) + "0" + str.substring(l - 2, l));
							}
						};
						output = output.replace(/e[+-][0-9]{1,2}$/, buff);
					}
					textlength = output.length + sharpdata.length + sSignCharacter.length;
					spacesize  = width - textlength;
					// 左よせ
					if(isFlagTextAlignLeft) {
						for(let i = 0; i < spacesize; i++) {
							output = output + " ";
						}
					}
					// 0を埋める場合
					if(isFlagFillZero) {
						for(let i = 0; i < spacesize; i++) {
							output = "0" + output;
						}
					}
					// マイナスや、「0x」などを接続
					output = sharpdata + output;
					output = sSignCharacter + output;
					// 0 で埋めない場合
					if((!isFlagFillZero) && (!isFlagTextAlignLeft)) {
						for(let i = 0; i < spacesize; i++) {
							output = " " + output;
						}
					}
					// 大文字化
					if(type.toUpperCase() === type) {
						output = output.toUpperCase();
					}
					break;
				}
				// 文字列の場合
				case "c":
					if(!isNaN(parameter)) {
						parameter = String.fromCharCode(parameter);
					}
					// falls through
				case "s":
				{
					if(!isNaN(parameter)) {
						parameter = parameter.toString(10);
					}
					output = parameter;
					if(isPrecision) { // 最大表示文字数
						if(output.length > precision) {
							output = output.substring(0, precision);
						}
					}
					const s_textlength = output.length; // 現在の文字を構成するために必要な長さ
					const s_spacesize  = width - s_textlength;  // 追加する横幅
					// 左よせ / 右よせ
					if(isFlagTextAlignLeft) {
						for(let i = 0; i < s_spacesize; i++) {
							output = output + " ";
						}
					}
					else {
						// 拡張
						const s = isFlagFillZero ? "0" : " ";
						for(let i = 0; i < s_spacesize; i++) {
							output = s + output;
						}
					}
					break;
				}
				// パーセント
				case "%":
					output = "%";
					break;
				// 未サポート
				case "p":
				case "n":
					output = "(unsupported)";
					break;
				default:
					// 正規表現でチェックしているため、ありえない
					break;
			}
			return (output);	
		};
		return (parm[0].replace(/%[^diubBoxXeEfFgGaAcspn%]*[diubBoxXeEfFgGaAcspn%]/g, func));
	}

	/**
	 * 時刻用の書式に合わせて文字列を組み立てる
	 * - YYYY-MM-DD hh:mm:ss のように指定できる。
	 * @param {String} text 
	 * @param {Date} date 時刻情報
	 * @returns {String}
	 */
	static datef(text, date) {
		const Y = date.getFullYear();
		const M = date.getMonth() + 1;
		const D = date.getDate();
		const h = date.getHours();
		const m = date.getMinutes();
		const s = date.getSeconds();
		const ms = date.getMilliseconds();
		const day = date.getDay(); // 曜日
		const aaa_array = [26085, 26376, 28779, 27700, 26408, 37329, 22303];
		const aaaa_str = String.fromCharCode(26332) + String.fromCharCode(26085);
		const ddd_array = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const dddd_array = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		let output = text;
		output = output.replace(/YYYY/g, Y.toString());
		output = output.replace(/YY/g, (Y % 100).toString());
		output = output.replace(/MM/g, Format.textf("%02d", M));
		output = output.replace(/M/g, M.toString());
		output = output.replace(/DD/g, Format.textf("%02d", D));
		output = output.replace(/D/g, D.toString());
		output = output.replace(/hh/g, Format.textf("%02d", h));
		output = output.replace(/h/g, h.toString());
		output = output.replace(/mm/g, Format.textf("%02d", m));
		output = output.replace(/m/g, m.toString());
		output = output.replace(/ss/g, Format.textf("%02d", s));
		output = output.replace(/s/g, s.toString());
		output = output.replace(/000/g, Format.textf("%03d", ms));
		output = output.replace(/aaaa/g, String.fromCharCode(aaa_array[day]) + aaaa_str);
		output = output.replace(/aaa/g, String.fromCharCode(aaa_array[day]));
		output = output.replace(/dddd/g, dddd_array[day]);
		output = output.replace(/ddd/g, ddd_array[day]);
		output = output.replace(/day/g, day.toString());
		return output;
	}

}
