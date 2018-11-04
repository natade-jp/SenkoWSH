/**
 * SenkoWSH Character.js
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
 
// 作りかけでメモ用途です

var Character = {
	charCount:function(codepoint){
		if(0x10000 <= codepoint) {
			return(2);
		}
		else {
			return(1);
		}
	},

	isHighSurrogate: function(ch){
		return((0xD800 <= ch) && (ch <= 0xDBFF));
	},
	
	isLowSurrogate: function(ch){
		return((0xDC00 <= ch) && (ch <= 0xDFFF));
	},
	
	isSurrogatePair: function(ch){
		return((0xD800 <= ch) && (ch <= 0xDFFF));
	},
	
	toCodePoint: function(high, low){
		high -= 0xD800;
		high <<= 10;
		low  -= 0xDC00;
		low  |= high;
		low  += 0x10000;
		return(low);
	},
	
	getHighSurrogate: function(codepoint){
		return((( codepoint - 0x10000 ) >> 10) + 0xD800);
	},
	
	getLowSurrogate: function(codepoint){
		return((codepoint & 0x3FF) + 0xDC00);
	},
	
	toString: function(){
		var text = [];
		for(var i = 0;i < arguments.length;i++) {
			var codepoint = arguments[i];
			if(Character.charCount(codepoint) === 2) {
				text[text.length] = String.fromCharCode(Character.getHighSurrogate(codepoint));
				text[text.length] = String.fromCharCode(Character.getLowSurrogate(codepoint));
			}
			else {
				text[text.length] = String.fromCharCode(codepoint);
			}
		}
		return(text.join(""));
	}
};