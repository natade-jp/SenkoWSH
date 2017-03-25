/**
 * StringMacros.js
 * 
 * VERSION:
 *  0.02
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  CC0					(http://sciencecommons.jp/cc0/about)
 *
 * HISTORY:
 *  2014/04/24 - v0.01 - natade - first release
 *  
 * DEPENDENT LIBRARIES:
 *  なし
 */
 
 // よく利用されそうな文字列操作をまとめました。
 
var StringMacros = {

	// 文字列かどうか知る
	isString: function(string) {
		return((typeof string === "string")||(string instanceof String));
	},
	
	// 正規表現かどうか知る
	isRegularExpression : function(regexp) {
		return(regexp instanceof RegExp);
	},
	
	// 正規表現表記を取得します
	getRegularExpression : function(data) {
		var new_reg;
		if(StringMacros.isRegularExpression(data)) {
			return(data);
		}
		if(!StringMacros.isString(data)) {
			data = data.toString();
		}
		if(StringMacros.isString(data)) {
			new_reg = new RegExp(StringMacros.escapeStringForRegularExpression(data));
		}
		return(new_reg);
	},
	
	// 指定した文字数を最初から削る
	deleteStartCharacter: function(string, length) {
		return(string.substr(length, string.length - length));
	},
	
	// 指定した文字数を後ろから削る
	deleteEndCharacter: function(string, length) {
		return(string.substr(0, string.length - length));
	},
	
	// 指定した文字数を最初から取得する
	getStartCharacter: function(string, length) {
		return(string.substr(0, length));
	},
	
	// 指定した文字数を後ろから取得する
	getEndCharacter: function(string, length) {
		return(string.substr(string.length - length, length));
	},
	
	// 文字列を正規表現用にエスケープさせる
	escapeStringForRegularExpression: function(string) {
		return(string.toString().replace(/([\\\/\*\+\.\?\{\}\(\)\[\]\^\$\-\|])/g, "\\$1" ));
	},

	// 最初に見つけた指定した文字より右側を抜き出す
	rightFirstString: function(string, regexp) {
		var reg_word = ".*?" + StringMacros.getRegularExpression(regexp).source;
		var regex = new RegExp(reg_word);
		if(regex.test(string)) {
			return(string.replace(regex, ""));
		}
		else {
			return("");
		}
	},
	
	// 文字の最後から左へ探索し、指定した文字より右側を抜き出す
	rightLastString: function(string, regexp) {
		var reg_word = ".*" + StringMacros.getRegularExpression(regexp).source;
		var regex = new RegExp(reg_word);
		if(regex.test(string)) {
			return(string.replace(regex, ""));
		}
		else {
			return("");
		}
	},
	
	// 最初に見つけた指定した文字より左側を抜き出す
	leftFirstString: function(string, regexp) {
		var reg_word = StringMacros.getRegularExpression(regexp).source;
		var regex = new RegExp(reg_word);
		var string_array = string.match(regex);
		if(string_array) {
			return(StringMacros.getStartCharacter(string, string_array.index));
		}
		else {
			return("");
		}
	},
	
	// 文字の最後から左へ探索し、指定した文字より左側を抜き出す
	leftLastString: function(string, regexp) {
		var matchword = StringMacros.getMatchWords(string, regexp);
		if(matchword.length === 0) {
			return("");
		}
		else if(matchword.length > 1) {
			matchword = matchword[matchword.length - 1];
		}
		else {
			matchword = matchword[0];
		}
		return(StringMacros.getStartCharacter(string, matchword.offset ));
	},
	
	// 指定したワードの位置、ワード、サイズを配列で取得します。
	getMatchWords: function(string, regexp) {
		var global_reg;
		global_reg = new RegExp(StringMacros.getRegularExpression(regexp).source, "g");
		var output = [];
		var dummy = function() {
			// var offset		= arguments[arguments.length - 2];	// 先頭の番目
			// var alltext	= arguments[arguments.length - 1];	// 全体の文字
			// var word		= arguments[0];						// ヒットした文字
			var data = {
				offset:		arguments[arguments.length - 2],
				word:		arguments[0],
				length:		arguments[0].length
			};
			output[output.length] = data;
			return;
		};
		string.replace(global_reg, dummy);
		return(output);
	},
	
	// 指定したワードの間に挟まれたテキストを配列で取得します。
	// getMatchWords を使用して調べるため、長さ 0 も許可します。
	getStringsBetweenWords: function(string, regexp) {
		var matchwords = StringMacros.getMatchWords(string, regexp);
		if(matchwords.length === 0) {
			return(string);
		}
		var output = [];
		var im, offset, length;
		var old_target = null;
		for(im = 0; im <= matchwords.length; im++) {
			var target = matchwords[im];
			if(im < matchwords.length ) {
				if(old_target === null) {
					offset	= 0;
					length	= target.offset;
				}
				else {
					offset	= old_target.offset + old_target.length;
					length	= target.offset - offset;
				}
				old_target = target;
			}
			else {
				offset	= old_target.offset + old_target.length;
				length	= string.length - offset;
			}
		// この条件にすれば文字列長 0 は配列に加えない
		//	if(length > 0) {
		//		output[output.length] = string.substr(offset, length);
		//	}
			output[output.length] = string.substr(offset, length);
		}
		return(output);
	},
	
	// Cの関数の正規表現取得例
	regexFunctionC: /((\w+)[ \t]+)((\w+)[ \t]*)+\((([^)]+)?(\([^\)]*\))?)*\)/
	
};