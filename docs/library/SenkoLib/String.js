"use strict";

/**
 * SenkoLib String.js
 *  文字列の拡張ライブラリ
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 * 
 * DEPENDENT LIBRARIES:
 *  なし
 */

String.prototype.replaceAll = function(target, replacement) {
	//正規表現のgを使って全置換する
	//従って正規表現にならないようにエスケープしておく
	var regex = new RegExp(target.replace(/([\\\/\*\+\.\?\{\}\(\)\[\]\^\$\-\|])/g, "\\$1" ), "g");
	replacement = replacement.replace(/\$/g, "$$$$");
	return(this.replace(regex, replacement));
};
String.prototype.trim = function() {
	return(this.replace(/^\s+|\s+$/g, ""));
};
String.prototype.each = function(func) {
	var out = true;
	var len = this.length;
	for(var i = 0; i < len; i = this.offsetByCodePoints(i, 1)) {
		var codepoint = this.codePointAt(i);
		var str = String.fromCodePoint(codepoint);
		if(func.call(func, i, str, codepoint) === false) {
			out = false;
			break;
		}
	}
	return(out);
};
String.prototype.isHighSurrogateAt = function(index) {
	var ch = this.charCodeAt(index);
	return((0xD800 <= ch) && (ch <= 0xDBFF));
};
String.prototype.isLowSurrogateAt = function(index) {
	var ch = this.charCodeAt(index);
	return((0xDC00 <= ch) && (ch <= 0xDFFF));
};
String.prototype.isSurrogatePairAt = function(index) {
	var ch = this.charCodeAt(index);
	return((0xD800 <= ch) && (ch <= 0xDFFF));
};
String.prototype.codePointAt = function(index) {
	if(this.isHighSurrogateAt(index)) {
		var high = this.charCodeAt(index);
		var low  = this.charCodeAt(index + 1);
		return((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
	}
	else {
		return(this.charCodeAt(index));
	}
};
String.prototype.codePointBefore = function(index) {
	if(!this.isLowSurrogateAt(index - 1)) {
		return(this.charCodeAt(index - 1));
	}
	else {
		return(this.codePointAt(index - 2));
	}
};
String.prototype.codePointCount = function(beginIndex, endIndex) {
	if(arguments.length < 1) {
		beginIndex = 0;
	}
	if(arguments.length < 2) {
		endIndex = this.length;
	}
	var count = 0;
	for(;beginIndex < endIndex;beginIndex++) {
		count++;
		if(this.isSurrogatePairAt(beginIndex)) {
			beginIndex++;
		}
	}
	return(count);
};
String.prototype.offsetByCodePoints = function(index, codePointOffset) {
	var count = 0;
	if(codePointOffset === 0) {
		return(index);
	}
	if(codePointOffset > 0) {
		for(;index < this.length;index++) {
			count++;
			if(this.isHighSurrogateAt(index)) {
				index++;
			}
			if(count === codePointOffset) {
				return(index + 1);
			}
		}
		
	}
	else {
		codePointOffset = -codePointOffset;
		for(;index >= 0;index--) {
			count++;
			if(this.isLowSurrogateAt(index - 1)) {
				index--;
			}
			if(count === codePointOffset) {
				return(index - 1);
			}
		}
	}
	return(false);
};
String.prototype.startsWith = function(prefix) {
	return(this.indexOf(prefix) === 0);
};
String.prototype.endsWith = function(suffix) {
	if(this.length < suffix.length) {
		return(false);
	}
	return(this.indexOf(suffix) === (this.length - suffix.length));
};
String.prototype.toHiragana = function() {
	var func = function(ch) {
		return(String.fromCharCode(ch.charCodeAt(0) - 0x0060));
	};
	return(this.replace(/[\u30A1-\u30F6]/g, func));
};
String.prototype.toKatakana = function() {
	var func = function(ch) {
		return(String.fromCharCode(ch.charCodeAt(0) + 0x0060));
	};
	return(this.replace(/[\u3041-\u3096]/g, func));
};
String.prototype.toHalfWidthSpace = function() {
	return(this.replace(/\u3000/g, String.fromCharCode(0x0020)));
};
String.prototype.toFullWidthSpace = function() {
	return(this.replace(/\u0020/g, String.fromCharCode(0x3000)));
};
String.prototype.toHalfWidthAsciiCode = function() {
	var out = this;
	out = out.replace(/\u3000/g, "\u0020");				//全角スペース
	out = out.replace(/[\u2018-\u201B]/g, "\u0027");	//シングルクォーテーション
	out = out.replace(/[\u201C-\u201F]/g, "\u0022");	//ダブルクォーテーション
	var func = function(ch) {
		ch = ch.charCodeAt(0);
		return(String.fromCharCode(ch - 0xFEE0));
	};
	return(out.replace(/[\uFF01-\uFF5E]/g, func));
};
String.prototype.toFullWidthAsciiCode = function() {
	var out = this;
	out = out.replace(/\u0020/g, "\u3000");	//全角スペース
	out = out.replace(/\u0022/g, "\u201D");	//ダブルクォーテーション
	out = out.replace(/\u0027/g, "\u2019");	//アポストロフィー
	var func = function(ch) {
		ch = ch.charCodeAt(0);
		return(String.fromCharCode(ch + 0xFEE0));
	};
	return(out.replace(/[\u0020-\u007E]/g, func));
};
String.prototype.toHalfWidthAlphabet = function() {
	var func = function(ch) {
		return(String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
	};
	return(this.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, func));
};
String.prototype.toFullWidthAlphabet = function() {
	var func = function(ch) {
		return(String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
	};
	return(this.replace(/[A-Za-z]/g, func));
};
String.prototype.toHalfWidthNumber = function() {
	var func = function(ch) {
		return(String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
	};
	return(this.replace(/[\uFF10-\uFF19]/g, func));
};
String.prototype.toFullWidthNumber = function() {
	var func = function(ch) {
		return(String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
	};
	return(this.replace(/[0-9]/g, func));
};
String.prototype.toHalfWidthKana = function() {
	var map = {
		0x3001	:	"\uFF64"	,	//	､
		0x3002	:	"\uFF61"	,	//	。	｡
		0x300C	:	"\uFF62"	,	//	「	｢
		0x300D	:	"\uFF63"	,	//	」	｣
		0x309B	:	"\uFF9E"	,	//	゛	ﾞ
		0x309C	:	"\uFF9F"	,	//	゜	ﾟ
		0x30A1	:	"\uFF67"	,	//	ァ	ｧ
		0x30A2	:	"\uFF71"	,	//	ア	ｱ
		0x30A3	:	"\uFF68"	,	//	ィ	ｨ
		0x30A4	:	"\uFF72"	,	//	イ	ｲ
		0x30A5	:	"\uFF69"	,	//	ゥ	ｩ
		0x30A6	:	"\uFF73"	,	//	ウ	ｳ
		0x30A7	:	"\uFF6A"	,	//	ェ	ｪ
		0x30A8	:	"\uFF74"	,	//	エ	ｴ
		0x30A9	:	"\uFF6B"	,	//	ォ	ｫ
		0x30AA	:	"\uFF75"	,	//	オ	ｵ
		0x30AB	:	"\uFF76"	,	//	カ	ｶ
		0x30AC	:	"\uFF76\uFF9E"	,	//	ガ	ｶﾞ
		0x30AD	:	"\uFF77"	,	//	キ	ｷ
		0x30AE	:	"\uFF77\uFF9E"	,	//	ギ	ｷﾞ
		0x30AF	:	"\uFF78"	,	//	ク	ｸ
		0x30B0	:	"\uFF78\uFF9E"	,	//	グ	ｸﾞ
		0x30B1	:	"\uFF79"	,	//	ケ	ｹ
		0x30B2	:	"\uFF79\uFF9E"	,	//	ゲ	ｹﾞ
		0x30B3	:	"\uFF7A"	,	//	コ	ｺ
		0x30B4	:	"\uFF7A\uFF9E"	,	//	ゴ	ｺﾞ
		0x30B5	:	"\uFF7B"	,	//	サ	ｻ
		0x30B6	:	"\uFF7B\uFF9E"	,	//	ザ	ｻﾞ
		0x30B7	:	"\uFF7C"	,	//	シ	ｼ
		0x30B8	:	"\uFF7C\uFF9E"	,	//	ジ	ｼﾞ
		0x30B9	:	"\uFF7D"	,	//	ス	ｽ
		0x30BA	:	"\uFF7D\uFF9E"	,	//	ズ	ｽﾞ
		0x30BB	:	"\uFF7E"	,	//	セ	ｾ
		0x30BC	:	"\uFF7E\uFF9E"	,	//	ゼ	ｾﾞ
		0x30BD	:	"\uFF7F"	,	//	ソ	ｿ
		0x30BE	:	"\uFF7F\uFF9E"	,	//	ゾ	ｿﾞ
		0x30BF	:	"\uFF80"	,	//	タ	ﾀ
		0x30C0	:	"\uFF80\uFF9E"	,	//	ダ	ﾀﾞ
		0x30C1	:	"\uFF81"	,	//	チ	ﾁ
		0x30C2	:	"\uFF81\uFF9E"	,	//	ヂ	ﾁﾞ
		0x30C3	:	"\uFF6F"	,	//	ッ	ｯ
		0x30C4	:	"\uFF82"	,	//	ツ	ﾂ
		0x30C5	:	"\uFF82\uFF9E"	,	//	ヅ	ﾂﾞ
		0x30C6	:	"\uFF83"	,	//	テ	ﾃ
		0x30C7	:	"\uFF83\uFF9E"	,	//	デ	ﾃﾞ
		0x30C8	:	"\uFF84"	,	//	ト	ﾄ
		0x30C9	:	"\uFF84\uFF9E"	,	//	ド	ﾄﾞ
		0x30CA	:	"\uFF85"	,	//	ナ	ﾅ
		0x30CB	:	"\uFF86"	,	//	ニ	ﾆ
		0x30CC	:	"\uFF87"	,	//	ヌ	ﾇ
		0x30CD	:	"\uFF88"	,	//	ネ	ﾈ
		0x30CE	:	"\uFF89"	,	//	ノ	ﾉ
		0x30CF	:	"\uFF8A"	,	//	ハ	ﾊ
		0x30D0	:	"\uFF8A\uFF9E"	,	//	バ	ﾊﾞ
		0x30D1	:	"\uFF8A\uFF9F"	,	//	パ	ﾊﾟ
		0x30D2	:	"\uFF8B"	,	//	ヒ	ﾋ
		0x30D3	:	"\uFF8B\uFF9E"	,	//	ビ	ﾋﾞ
		0x30D4	:	"\uFF8B\uFF9F"	,	//	ピ	ﾋﾟ
		0x30D5	:	"\uFF8C"	,	//	フ	ﾌ
		0x30D6	:	"\uFF8C\uFF9E"	,	//	ブ	ﾌﾞ
		0x30D7	:	"\uFF8C\uFF9F"	,	//	プ	ﾌﾟ
		0x30D8	:	"\uFF8D"	,	//	ヘ	ﾍ
		0x30D9	:	"\uFF8D\uFF9E"	,	//	ベ	ﾍﾞ
		0x30DA	:	"\uFF8D\uFF9F"	,	//	ペ	ﾍﾟ
		0x30DB	:	"\uFF8E"	,	//	ホ	ﾎ
		0x30DC	:	"\uFF8E\uFF9E"	,	//	ボ	ﾎﾞ
		0x30DD	:	"\uFF8E\uFF9F"	,	//	ポ	ﾎﾟ
		0x30DE	:	"\uFF8F"	,	//	マ	ﾏ
		0x30DF	:	"\uFF90"	,	//	ミ	ﾐ
		0x30E0	:	"\uFF91"	,	//	ム	ﾑ
		0x30E1	:	"\uFF92"	,	//	メ	ﾒ
		0x30E2	:	"\uFF93"	,	//	モ	ﾓ
		0x30E3	:	"\uFF6C"	,	//	ャ	ｬ
		0x30E4	:	"\uFF94"	,	//	ヤ	ﾔ
		0x30E5	:	"\uFF6D"	,	//	ュ	ｭ
		0x30E6	:	"\uFF95"	,	//	ユ	ﾕ
		0x30E7	:	"\uFF6E"	,	//	ョ	ｮ
		0x30E8	:	"\uFF96"	,	//	ヨ	ﾖ
		0x30E9	:	"\uFF97"	,	//	ラ	ﾗ
		0x30EA	:	"\uFF98"	,	//	リ	ﾘ
		0x30EB	:	"\uFF99"	,	//	ル	ﾙ
		0x30EC	:	"\uFF9A"	,	//	レ	ﾚ
		0x30ED	:	"\uFF9B"	,	//	ロ	ﾛ
		0x30EE	:	"\uFF9C"	,	//	ヮ	ﾜ
		0x30EF	:	"\uFF9C"	,	//	ワ	ﾜ
		0x30F0	:	"\uFF72"	,	//	ヰ	ｲ
		0x30F1	:	"\uFF74"	,	//	ヱ	ｴ
		0x30F2	:	"\uFF66"	,	//	ヲ	ｦ
		0x30F3	:	"\uFF9D"	,	//	ン	ﾝ
		0x30F4	:	"\uFF73\uFF9E"	,	//	ヴ	ｳﾞ
		0x30F5	:	"\uFF76"	,	//	ヵ	ｶ
		0x30F6	:	"\uFF79"	,	//	ヶ	ｹ
		0x30F7	:	"\uFF9C\uFF9E"	,	//	ヷ	ﾜﾞ
		0x30F8	:	"\uFF72\uFF9E"	,	//	ヸ	ｲﾞ
		0x30F9	:	"\uFF74\uFF9E"	,	//	ヹ	ｴﾞ
		0x30FA	:	"\uFF66\uFF9E"	,	//	ヺ	ｦﾞ
		0x30FB	:	"\uFF65"	,	//	・	･
		0x30FC	:	"\uFF70"		//	ー	ｰ
	};
	var func = function(ch) {
		if(ch.length === 1) {
			return(map[ch.charCodeAt(0)]);
		}
		else {
			return(map[ch.charCodeAt(0)] + map[ch.charCodeAt(1)]);
		}
	};
	return(this.replace(/[\u3001\u3002\u300C\u300D\u309B\u309C\u30A1-\u30FC][\u309B\u309C]?/g, func));
};
String.prototype.toFullWidthKana = function() {
	var map = {
		0xFF61	:	0x3002	,	//	。	｡
		0xFF62	:	0x300C	,	//	「	｢
		0xFF63	:	0x300D	,	//	」	｣
		0xFF64	:	0x3001	,	//	､
		0xFF65	:	0x30FB	,	//	・	･
		0xFF66	:	0x30F2	,	//	ヲ	ｦ
		0xFF67	:	0x30A1	,	//	ァ	ｧ
		0xFF68	:	0x30A3	,	//	ィ	ｨ
		0xFF69	:	0x30A5	,	//	ゥ	ｩ
		0xFF6A	:	0x30A7	,	//	ェ	ｪ
		0xFF6B	:	0x30A9	,	//	ォ	ｫ
		0xFF6C	:	0x30E3	,	//	ャ	ｬ
		0xFF6D	:	0x30E5	,	//	ュ	ｭ
		0xFF6E	:	0x30E7	,	//	ョ	ｮ
		0xFF6F	:	0x30C3	,	//	ッ	ｯ
		0xFF70	:	0x30FC	,	//	ー	ｰ
		0xFF71	:	0x30A2	,	//	ア	ｱ
		0xFF72	:	0x30A4	,	//	イ	ｲ
		0xFF73	:	0x30A6	,	//	ウ	ｳ
		0xFF74	:	0x30A8	,	//	エ	ｴ
		0xFF75	:	0x30AA	,	//	オ	ｵ
		0xFF76	:	0x30AB	,	//	カ	ｶ
		0xFF77	:	0x30AD	,	//	キ	ｷ
		0xFF78	:	0x30AF	,	//	ク	ｸ
		0xFF79	:	0x30B1	,	//	ケ	ｹ
		0xFF7A	:	0x30B3	,	//	コ	ｺ
		0xFF7B	:	0x30B5	,	//	サ	ｻ
		0xFF7C	:	0x30B7	,	//	シ	ｼ
		0xFF7D	:	0x30B9	,	//	ス	ｽ
		0xFF7E	:	0x30BB	,	//	セ	ｾ
		0xFF7F	:	0x30BD	,	//	ソ	ｿ
		0xFF80	:	0x30BF	,	//	タ	ﾀ
		0xFF81	:	0x30C1	,	//	チ	ﾁ
		0xFF82	:	0x30C4	,	//	ツ	ﾂ
		0xFF83	:	0x30C6	,	//	テ	ﾃ
		0xFF84	:	0x30C8	,	//	ト	ﾄ
		0xFF85	:	0x30CA	,	//	ナ	ﾅ
		0xFF86	:	0x30CB	,	//	ニ	ﾆ
		0xFF87	:	0x30CC	,	//	ヌ	ﾇ
		0xFF88	:	0x30CD	,	//	ネ	ﾈ
		0xFF89	:	0x30CE	,	//	ノ	ﾉ
		0xFF8A	:	0x30CF	,	//	ハ	ﾊ
		0xFF8B	:	0x30D2	,	//	ヒ	ﾋ
		0xFF8C	:	0x30D5	,	//	フ	ﾌ
		0xFF8D	:	0x30D8	,	//	ヘ	ﾍ
		0xFF8E	:	0x30DB	,	//	ホ	ﾎ
		0xFF8F	:	0x30DE	,	//	マ	ﾏ
		0xFF90	:	0x30DF	,	//	ミ	ﾐ
		0xFF91	:	0x30E0	,	//	ム	ﾑ
		0xFF92	:	0x30E1	,	//	メ	ﾒ
		0xFF93	:	0x30E2	,	//	モ	ﾓ
		0xFF94	:	0x30E4	,	//	ヤ	ﾔ
		0xFF95	:	0x30E6	,	//	ユ	ﾕ
		0xFF96	:	0x30E8	,	//	ヨ	ﾖ
		0xFF97	:	0x30E9	,	//	ラ	ﾗ
		0xFF98	:	0x30EA	,	//	リ	ﾘ
		0xFF99	:	0x30EB	,	//	ル	ﾙ
		0xFF9A	:	0x30EC	,	//	レ	ﾚ
		0xFF9B	:	0x30ED	,	//	ロ	ﾛ
		0xFF9C	:	0x30EF	,	//	ワ	ﾜ
		0xFF9D	:	0x30F3	,	//	ン	ﾝ
		0xFF9E	:	0x309B	,	//	゛	ﾞ
		0xFF9F	:	0x309C		//	゜	ﾟ
	};
	var func = function(str) {
		if(str.length === 1) {
			return(String.fromCharCode(map[str.charCodeAt(0)]));
		}
		else {
			var next = str.charCodeAt(1);
			var ch   = str.charCodeAt(0);
			if(next === 0xFF9E) {
				// Shift-JISにない濁点は無視
				// ヴ
				if (ch === 0xFF73) {
					return(String.fromCharCode(0x3094));
				}
				// ガ-ド、バ-ボ
				else if(
					((0xFF76 <= ch) && (ch <= 0xFF84)) ||
					((0xFF8A <= ch) && (ch <= 0xFF8E))	) {
					return(String.fromCharCode(map[ch] + 1));
				}
			}
			// 半濁点
			else if(next === 0xFF9F) {
				// パ-ポ
				if((0xFF8A <= ch) && (ch <= 0xFF8E)) {
					return(String.fromCharCode(map[ch] + 2));
				}
			}
			return(String.fromCharCode(map[ch]) + String.fromCharCode(map[next]));
		}
	};
	return(this.replace(/[\uFF61-\uFF9F][\uFF9E\uFF9F]?/g, func));
};
String.prototype.toHalfWidth = function() {
	return(this.toHalfWidthAsciiCode().toHalfWidthKana());
};
String.prototype.toFullWidth = function() {
	return(this.toFullWidthAsciiCode().toFullWidthKana());
};
String.prototype.removeComment = function() {
	var istextA  = false;
	var isescape = false;
	var commentA1 = false;
	var commentA2 = false;
	var commentB2 = false;
	var commentB3 = false;
	var output = [];
	
	for(var i = 0;i < this.length;i++) {
		var character = this.charAt(i);

		//文字列（ダブルクォーテーション）は除去しない
		if(istextA) {
			if(isescape) {
				isescape = false;
			}
			else if(character === "\\") {
				isescape = true;
			}
			else if(character === "\"") {
				istextA = false;
			}
			output[output.length] = character;
			continue;
		}
		
		//複数行コメント
		if(commentB2) {
			//前回複数行コメントが終了の可能性があった場合
			if(commentB3){
				commentB3 = false;
				//コメント終了
				if(character === "/") {
					commentB2 = false;
				}
			}
			//ここにelseをつけると、**/ が抜ける
			if(character === "*") {
				commentB3 = true;
			}
			else if(character === "\n"){
				output[output.length] = character;
			}
			continue;
		}

		//１行コメントである
		if(commentA2) {
			//改行でコメント修了
			if(character === "\n"){
				commentA2 = false;
				output[output.length] = character;
			}
			continue;
		}

		//前回コメントの開始点だと思われている場合
		if(commentA1){
			commentA1 = false;
			//1行コメントの場合
			if(character === "/") {
				commentA2 = true;
				output[output.length - 1] = "";
				continue;
			}
			//複数行コメントの場合
			else if(character === "*") {
				commentB2 = true;
				output[output.length - 1] = "";
				continue;
			}
		}

		//文字列開始点
		if(character === "\"") {
			istextA = true;
		}
		//コメントの開始点だと追われる場合
		if(character === "/") {
			commentA1 = true;
		}
		output[output.length] = character;
	}
	return(output.join(""));
};
String.fromCodePoint = function(){
	var text = [];
	for(var i = 0;i < arguments.length;i++) {
		var codepoint = arguments[i];
		if(0x10000 <= codepoint) {
			var high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
			var low  = (codepoint & 0x3FF) + 0xDC00;
			text[text.length] = String.fromCharCode(high);
			text[text.length] = String.fromCharCode(low);
		}
		else {
			text[text.length] = String.fromCharCode(codepoint);
		}
	}
	return(text.join(""));
};
// JavaのString.formatの動きを模したもの
// 主にCのsprintfの動きをサポートし

// JavaのFormatterのロケール、日付時刻等はサポートしていません。
// sprintfの変換指定子のpとnはサポートしていません。
String.format = function(){
	var parm_number = 1;
	var parm = arguments;
	var toUnsign  = function(x) {
		if(x >= 0) {
			return(x);
		}
		else {
			x = -x;
			//16ビットごとに分けてビット反転
			var high = ((~x) >> 16) & 0xFFFF;
			high *= 0x00010000;
			var low  =  (~x) & 0xFFFF;
			return(high + low + 1);
		}
	};
	var func = function(str) {
		// 1文字目の%を除去
		str = str.substring(1, str.length);
		var buff;
		// [6] 変換指定子(最後の1文字を取得)
		buff = str.match(/.$/);
		var type = buff[0];
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
		var parameter = parm[parm_number];
		parm_number = parm_number + 1;
		// [2] フラグ
		buff = str.match(/^[\-\+\s\#0]+/);
		var isFlagSharp = false;
		var isFlagTextAlignLeft = false;
		var isFlagFill = false;
		var sFillCharacter = " ";
		var isFlagFillZero = false;
		var isFlagDrawSign = false;
		var sSignCharacter = "";
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
		var width = 0;
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
		var isPrecision = false;
		var precision = 0;
		buff = str.match(/^(\.((\-?[0-9]+)|\*)|\.)/); //.-3, .* , .
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
		var output = "";
		var isInteger = false;
		switch(type.toLowerCase()) {
			// 数字関連
			case "d":
			case "i":
			case "u":
			case "b":
			case "o":
			case "x":
				isInteger = true;
			case "e":
			case "f":
			case "g":
				var sharpdata = "";
				var textlength; // 現在の文字を構成するために必要な長さ
				var spacesize;  // 追加する横幅
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
						for(var i = 0; i < spacesize; i++) {
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
					var buff = function(str) {
						var l   = str.length;
						if(str.length === 3) { // e+1 -> e+001
							return(str.substring(0, l - 1) + "00" + str.substring(l - 1, l));
						}
						else { // e+10 -> e+010
							return(str.substring(0, l - 2) + "0" + str.substring(l - 2, l));
						}
					};
					output = output.replace(/e[\+\-][0-9]{1,2}$/, buff);
				}
				textlength = output.length + sharpdata.length + sSignCharacter.length;
				spacesize  = width - textlength;
				// 左よせ
				if(isFlagTextAlignLeft) {
					for(var i = 0; i < spacesize; i++) {
						output = output + " ";
					}
				}
				// 0を埋める場合
				if(isFlagFillZero) {
					for(var i = 0; i < spacesize; i++) {
						output = "0" + output;
					}
				}
				// マイナスや、「0x」などを接続
				output = sharpdata + output;
				output = sSignCharacter + output;
				// 0 で埋めない場合
				if((!isFlagFillZero) && (!isFlagTextAlignLeft)) {
					for(var i = 0; i < spacesize; i++) {
						output = " " + output;
					}
				}
				// 大文字化
				if(type.toUpperCase() === type) {
					output = output.toUpperCase();
				}
				break;
			// 文字列の場合
			case "c":
				if(!isNaN(parameter)) {
					parameter = String.fromCharCode(parameter);
				}
			case "s":
				if(!isNaN(parameter)) {
					parameter = parameter.toString(10);
				}
				output = parameter;
				if(isPrecision) { // 最大表示文字数
					if(output.length > precision) {
						output = output.substring(0, precision);
					}
				}
				var textlength; // 現在の文字を構成するために必要な長さ
				var spacesize;  // 追加する横幅
				textlength = output.length;
				spacesize  = width - textlength;
				// 左よせ / 右よせ
				if(isFlagTextAlignLeft) {
					for(var i = 0; i < spacesize; i++) {
						output = output + " ";
					}
				}
				else {
					// 拡張
					var s = isFlagFillZero ? "0" : " ";
					for(var i = 0; i < spacesize; i++) {
						output = s + output;
					}
				}
				break;
			// パーセント
			case "%":
				output = "%";
				break;
			// 未サポート
			case "p":
			case "n":
				output = "(変換できません)";
				break;
			default:
				// 正規表現でチェックしているため、ありえない
				break;
		}
		return(output);	
	};
	return(parm[0].replace(/%[^diubBoxXeEfFgGaAcspn%]*[diubBoxXeEfFgGaAcspn%]/g, func));
};

String.valueOf = function(obj){
	return(obj.toString());
};