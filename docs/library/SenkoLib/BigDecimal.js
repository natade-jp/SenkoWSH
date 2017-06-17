"use strict";

/* global BigInteger */

﻿/**
 * SenkoLib BigDecimal.js
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

// まだ作成中です。

var RoundingMode = {
	// 0 から離れる
	UP: {
		toString : function() {
			return("UP");
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return(0);
			}
			else if(x > 0) {
				return(10 - x);
			}
			else {
				return(-(10 + x));
			}
		}
	},
	// 0 に近づく
	DOWN: {
		toString : function() {
			return("DOWN");
		},
		getAddNumber : function(x) {
			x = x % 10;
			return(-x);
		}
	},
	// 正の無限大に近づく
	CEILING: {
		toString : function() {
			return("CEILING");
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return(0);
			}
			else if(x > 0) {
				return(10 - x);
			}
			else {
				return(-x);
			}
		}
	},
	// 負の無限大に近づく
	FLOOR: {
		toString : function() {
			return("FLOOR");
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return(0);
			}
			else if(x > 0) {
				return(-x);
			}
			else {
				return(-(10 + x));
			}
		}
	},
	// 四捨五入
	HALF_UP: {
		toString : function() {
			return("HALF_UP");
		},
		getAddNumber : function(x) {
			x = x % 10;
			var sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 5) {
				return(x * -1);
			}
			else {
				return(sign * (10 - Math.abs(x)));
			}
		}
	},
	// 五捨六入
	HALF_DOWN: {
		toString : function() {
			return("HALF_DOWN");
		},
		getAddNumber : function(x) {
			x = x % 10;
			var sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 6) {
				return(x * -1);
			}
			else {
				return(sign * (10 - Math.abs(x)));
			}
		}
	},
	// 等間隔なら偶数側へ丸める
	HALF_EVEN: {
		toString : function() {
			return("HALF_EVEN");
		},
		getAddNumber : function(x) {
			x = x % 100;
			var sign, even;
			if(x < 0) {
				sign = -1;
				even = Math.ceil(x / 10) & 1;
			}
			else {
				sign = 1;
				even = Math.floor(x / 10) & 1;
			}
			var center;
			if(even === 1) {
				center = 5;
			}
			else {
				center = 6;
			}
			x = x % 10;
			if(Math.abs(x) < center) {
				return(x * -1);
			}
			else {
				return(sign * (10 - Math.abs(x)));
			}
		}
	},
	// 丸めない（丸める必要が出る場合はエラー）
	UNNECESSARY: {
		toString : function() {
			return("UNNECESSARY");
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return(0);
			}
			else {
				throw "ArithmeticException";
			}
		}
	},
	valueOf: function(name) {
		if(name === null) {
			throw "NullPointerException";
		}
		var values = RoundingMode.values;
		var i = 0;
		for(i = 0;i < values.length; i++) {
			if(values[i].toString() === name) {
				return(values[i]);
			}
		}
		throw "IllegalArgumentException";
	},
	getRoundingMode: function(roundingMode) {
		var mode;
		switch(roundingMode) {
			case RoundingMode.CEILING:
			case RoundingMode.DOWN:
			case RoundingMode.FLOOR:
			case RoundingMode.HALF_DOWN:
			case RoundingMode.HALF_EVEN:
			case RoundingMode.HALF_UP:
			case RoundingMode.UNNECESSARY:
			case RoundingMode.UP:
				mode = roundingMode;
				break;
			default:
				if((typeof roundingMode === "number")||(roundingMode instanceof Number)) {
					mode = RoundingMode.values[roundingMode];
				}
				else if((typeof roundingMode === "string")||(roundingMode instanceof String)) {
					mode = RoundingMode.valueOf(roundingMode);
				}
		}
		if(!mode) {
			throw "Not RoundingMode";
		}
		return mode;
	}
};

RoundingMode.values = {
	0	:	RoundingMode.CEILING,
	1	:	RoundingMode.DOWN,
	2	:	RoundingMode.FLOOR,
	3	:	RoundingMode.HALF_DOWN,
	4	:	RoundingMode.HALF_EVEN,
	5	:	RoundingMode.HALF_UP,
	6	:	RoundingMode.UNNECESSARY,
	7	:	RoundingMode.UP
};

var MathContext = function() {
	this.precision = 0;
	this.roundingMode = RoundingMode.HALF_UP;
	var p1 = 0;
	var p2 = 0;
	var buff;
	if(arguments.length >= 1) {
		p1 = arguments[0];
	}
	if(arguments.length >= 2) {
		p2 = arguments[1];
	}
	if((typeof p1 === "string")||(p1 instanceof String)) {
		buff = p1.match(/precision=\d+/);
		if(buff !== null) {
			buff = buff[0].substring("precision=".length, buff[0].length);
			this.precision = parseInt(buff, 10);
		}
		buff = p1.match(/roundingMode=\w+/);
		if(buff !== null) {
			buff = buff[0].substring("roundingMode=".length, buff[0].length);
			this.roundingMode = RoundingMode.valueOf(buff);
		}	
	}
	else if(arguments.length === 1) {
		this.precision = p1;
	}
	else if(arguments.length === 2) {
		this.precision = p1;
		this.roundingMode = p2;
	}
	if(this.precision < 0) {
		throw "IllegalArgumentException";
	}
};
	
MathContext.prototype.getPrecision = function() {
	return(this.precision);
};

MathContext.prototype.getRoundingMode = function() {
	return(this.roundingMode);
};

MathContext.prototype.equals = function(x) {
	if(x instanceof MathContext) {
		if(x.toString() === this.toString()) {
			return(true);
		}
	}
	return(false);
};

MathContext.prototype.toString = function() {
	return("precision=" + this.precision + " roundingMode=" + this.roundingMode.toString());
};

MathContext.UNLIMITED	= new MathContext(0,	RoundingMode.HALF_UP);
MathContext.DECIMAL32	= new MathContext(7,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL64	= new MathContext(16,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL128	= new MathContext(34,	RoundingMode.HALF_EVEN);

var BigDecimal = function() {
	this.integer = 0;
	this._scale = 0;
	var p1 = 0;
	var p2 = 0;
	var p3 = null;
	if(arguments.length >= 1) {
		p1 = arguments[0];
	}
	if(arguments.length >= 2) {
		p2 = arguments[1];
	}
	if(arguments.length >= 3) {
		p3 = arguments[2];
	}
	// BigDecimal(BigInteger val, MathContext mc)
	if(p2 instanceof MathContext) {
		p3 = p2;
	}
	if(p1 instanceof BigDecimal) {
		// System.out.println(p1.integer);
		this.integer	= p1.integer.clone();
		this._scale		= p1._scale;
		this.int_string	= p1.int_string;
	}
	else if(p1 instanceof BigInteger) {
		this.integer = p1.clone();
		this._scale   = p2;
	}
	else if(typeof p1 === "number") {
		// 整数か
		if(p1 === Math.floor(p1)) {
			this.integer = new BigInteger(p1);
			this._scale   = 0;
		}
		// 実数か
		else {
			this._scale = 0;
			while(true) {
				p1 = p1 * 10;
				this._scale = this._scale + 1;
				if(p1 === Math.floor(p1)) {
					break;
				}
			}
			this.integer = new BigInteger(p1);
		}
	}
	else if(typeof p1 === "string") {
		this._scale = 0;
		var buff;
		// 正規化
		var text = p1.replace(/\s/g, "").toLowerCase();
		// +-の符号があるか
		var number_text = "";
		buff = text.match(/^[\-\+]+/);
		if(buff !== null) {
			buff = buff[0];
			text = text.substring(buff.length, text.length);
			if(buff.indexOf("-") !== -1) {
				number_text += "-";
			}
		}
		// 整数部があるか
		buff = text.match(/^[0-9]+/);
		if(buff !== null) {
			buff = buff[0];
			text = text.substring(buff.length, text.length);
			number_text += buff;
		}
		// 小数部があるか
		buff = text.match(/^\.[0-9]+/);
		if(buff !== null) {
			buff = buff[0];
			text = text.substring(buff.length, text.length);
			buff = buff.substring(1, buff.length);
			this._scale   = this._scale + buff.length;
			number_text += buff;
		}
		// 指数表記があるか
		buff = text.match(/^e(\+|\-)?[0-9]+/);
		if(buff !== null) {
			buff = buff[0].substring(1, buff[0].length);
			this._scale   = this._scale - parseInt(buff, 10);
		}
		this.integer = new BigInteger(number_text, 10);
	}
	if(p3 instanceof MathContext) {
		var newbigdecimal = this.round(p3);
		this.integer	= newbigdecimal.integer;
		this._scale		= newbigdecimal._scale;
	}
	//	System.out.println(p1 + "\t\n->\t[" + this.integer + "," + this._scale +"]\n\t"+ this.toEngineeringString() );
};

BigDecimal.prototype._getUnsignedIntegerString = function() {
	// キャッシュする
	if(typeof this.int_string === "undefined") {
		this.int_string = this.integer.toString(10).replace(/^\-/, "");
	}
	return(this.int_string);
};

BigDecimal.prototype.clone = function() {
	return(new BigDecimal(this));
};

BigDecimal.prototype.scale = function() {
	return(this._scale);
};

BigDecimal.prototype.signum = function() {
	return(this.integer.signum());
};

BigDecimal.prototype.precision = function() {
	return(this._getUnsignedIntegerString().length);
};

BigDecimal.prototype.unscaledValue = function() {
	return(new BigInteger(this.integer));
};

BigDecimal.prototype.toScientificNotation = function(e) {
	var text	= this._getUnsignedIntegerString();
	var s		= this.scale();
	var x		= [];
	var i, k;
	// -
	if(this.signum() === -1) {
		x[x.length] = "-";
	}
	// 表示上の桁数
	s = - e - s;
	// 小数点が付かない
	if(s >= 0) {
		x[x.length] = text;
		for(i = 0; i < s; i++) {
			x[x.length] = "0";
		}
	}
	// 小数点が付く
	else {
		k = this.precision() + s;
		if(0 < k) {
			x[x.length] = text.substring(0, k);
			x[x.length] = ".";
			x[x.length] = text.substring(k, text.length);
		}
		else {
			k = - k;
			x[x.length] = "0.";
			for(i = 0; i < k; i++) {
				x[x.length] = "0";
			}
			x[x.length] = text;
		}
	}
	x[x.length] = "E";
	if(e >= 0) {
		x[x.length] = "+";
	}
	x[x.length] = e;
	return(x.join(""));
};

BigDecimal.prototype.toString = function() {
	// 「調整された指数」
	var x = - this.scale() + (this.precision() - 1);
	// スケールが 0 以上で、「調整された指数」が -6 以上
	if((this.scale() >= 0) && (x >= -6)) {
		return(this.toPlainString());
	}
	else {
		return(this.toScientificNotation(x));
	}
};

BigDecimal.prototype.toEngineeringString = function() {
	// 「調整された指数」
	var x = - this.scale() + (this.precision() - 1);
	// スケールが 0 以上で、「調整された指数」が -6 以上
	if((this.scale() >= 0) && (x >= -6)) {
		return(this.toPlainString());
	}
	else {
		// 0 でない値の整数部が 1 〜 999 の範囲に収まるように調整
		return(this.toScientificNotation(Math.floor(x / 3) * 3));
	}
};

BigDecimal.prototype.toPlainString = function() {
	// スケールの変換なし
	if(this.scale() === 0) {
		if(this.signum() < 0) {
			return("-" + this._getUnsignedIntegerString());
		}
		else {
			return(this._getUnsignedIntegerString());
		}
	}
	// 指数0で文字列を作成後、Eの後ろの部分をとっぱらう
	var text = this.toScientificNotation(0);
	return(text.match(/^[^E]*/)[0]);
};

BigDecimal.prototype.ulp = function() {
	return(new BigDecimal(BigInteger.ONE, this.scale()));
};

BigDecimal.prototype.setScale = function(newScale, roundingMode) {
	if(this.scale() === newScale) {
		// scaleが同一なので処理の必要なし
		return(this.clone());
	}
	if(arguments.length === 1) {
		roundingMode = RoundingMode.UNNECESSARY;
	}
	else {
		roundingMode = RoundingMode.getRoundingMode(roundingMode);
	}
	// 文字列を扱ううえで、符号があるとやりにくいので外しておく
	var text		= this._getUnsignedIntegerString();
	var sign		= this.signum();
	var sign_text	= sign >= 0 ? "" : "-";
	// scale の誤差
	// 0 以上なら 0 を加えればいい。0未満なら0を削るか、四捨五入など丸めを行う
	var delta		= newScale - this.scale();	// この桁分増やすといい
	if(0 <= delta) {
		// 0を加える
		var i;
		for(i = 0; i < delta; i++) {
			text = text + "0";
		}
		return(new BigDecimal(new BigInteger(sign_text + text), newScale));
	}
	var keta			= text.length + delta;		// 最終的な桁数
	var keta_marume		= keta + 1;
	if(keta <= 0) {
		// 指定した scale では設定できない場合
		// 例えば "0.1".setScale(-2), "10".setScale(-3) としても表すことは不可能であるため、
		// sign（-1, 0, +1）のどれかの数値を使用して丸める
		var outdata = (sign + roundingMode.getAddNumber(sign)) / 10;
		// 上記の式は、CEILINGなら必ず1、正でCEILINGなら1、負でFLOORなら1、それ以外は0となり、
		// さらに元々の数値が 0 なら 0、切り捨て不能なら例外が返る計算式である。
		// これは Java の動作をまねています。
		return(new BigDecimal(new BigInteger(outdata), newScale));
	}
	{
		// 0を削るだけで解決する場合
		// 単純な切捨て(0を削るのみ)
		var zeros			= text.match(/0+$/);
		var zero_length		= (zeros !== null) ? zeros[0].length : 0;
		if(( (zero_length + delta) >= 0 ) || (roundingMode === RoundingMode.DOWN)) {
			return(new BigDecimal(new BigInteger(sign_text + text.substring(0, keta)), newScale));
		}
	}
	{
		// 丸め計算で解決する場合
		// 12345 -> '123'45
		text = text.substring(0, keta_marume);
		// 丸め計算に必要な切り取る桁数(後ろの1～2桁を取得)
		var cutsize = text.length > 1 ? 2 : 1;
		// '123'45 -> 1'23'4
		var number = parseInt(text.substring(text.length - cutsize, text.length)) * sign;
		// 「元の数」と「丸めに必要な数」を足す
		var x1 = new BigInteger(sign_text + text);
		var x2 = new BigInteger(roundingMode.getAddNumber(number));
		text = x1.add(x2).toString();
		// 丸め後の桁数に戻して
		return(new BigDecimal(new BigInteger(text.substring(0, text.length - 1)), newScale));
	}
};

BigDecimal.prototype.round = function(mc) {
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var newPrecision	= mc.getPrecision();
	var delta			= newPrecision - this.precision();
	if((delta === 0)||(newPrecision === 0)) {
		return(this.clone());
	}
	var newBigDecimal = this.setScale( this.scale() + delta, mc.getRoundingMode());
	/* 精度を上げる必要があるため、0を加えた場合 */
	if(delta > 0) {
		return(newBigDecimal);
	}
	/* 精度を下げる必要があるため、丸めた場合は、桁の数が正しいか調べる */
	if(newBigDecimal.precision() === mc.getPrecision()) {
		return(newBigDecimal);
	}
	/* 切り上げなどで桁数が１つ増えた場合 */
	var sign_text	= newBigDecimal.integer.signum() >= 0 ? "" : "-";
	var abs_text	= newBigDecimal._getUnsignedIntegerString();
	var inte_text	= sign_text + abs_text.substring(0, abs_text.length - 1);
	return(new BigDecimal(new BigInteger(inte_text), newBigDecimal.scale() - 1));
};

BigDecimal.prototype.abs = function(mc) {
	var output = this.clone();
	output.integer = output.integer.abs();
	if(arguments.length === 1) {
		return(output);
	}
	else {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		return(output.round(mc));
	}
};

BigDecimal.prototype.plus = function(mc) {
	var output = this.clone();
	if(arguments.length === 1) {
		return(output);
	}
	else {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		return(output.round(mc));
	}
};

BigDecimal.prototype.negate = function(mc) {
	var output = this.clone();
	output.integer = output.integer.negate();
	if(arguments.length === 1) {
		return(output);
	}
	else {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		return(output.round(mc));
	}
};

BigDecimal.prototype.compareTo = function(val) {
	if(!(val instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	var src			= this;
	var tgt			= val;
	// 簡易計算
	{
		var src_sign	= src.signum();
		var tgt_sign	= tgt.signum();
		if((src_sign === 0) && (src_sign === tgt_sign)) {
			return(0);
		}
		else if(src_sign === 0) {
			return(- tgt_sign);
		}
		else if(tgt_sign === 0) {
			return(src_sign);
		}
	}
	// 実際に計算する
	if(src._scale === tgt._scale) {
		return(src.integer.compareTo(tgt.integer));
	}
	else if(src._scale > tgt._scale) {
		var newdst = tgt.setScale(src._scale);
		return(src.integer.compareTo(newdst.integer));
	}
	else {
		var newsrc = src.setScale(tgt._scale);
		return(newsrc.integer.compareTo(tgt.integer));
	}
};

BigDecimal.prototype.equals = function(x) {
	if(!(x instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	return((this._scale === x._scale) && (this.integer.equals(x.integer)));
};

BigDecimal.prototype.min = function(val) {
	if(!(val instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(this.compareTo(val) <= 0) {
		return(this.clone());
	}
	else {
		return(val.clone());
	}
};

BigDecimal.prototype.max = function(val) {
	if(!(val instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(this.compareTo(val) >= 0) {
		return(this.clone());
	}
	else {
		return(val.clone());
	}
};

BigDecimal.prototype.movePointLeft = function(n) {
	var output = this.scaleByPowerOfTen( -n );
	output = output.setScale(Math.max(this.scale() + n, 0));
	return(output);
};

BigDecimal.prototype.movePointRight = function(n) {
	var output = this.scaleByPowerOfTen( n );
	output = output.setScale(Math.max(this.scale() - n, 0));
	return(output);
};

BigDecimal.prototype.scaleByPowerOfTen = function(n) {
	var output = this.clone();
	output._scale = this.scale() - n;
	return(output);
};

BigDecimal.prototype.stripTrailingZeros = function() {
	// 0をできる限り取り除く
	var sign		= this.signum();
	var sign_text	= sign >= 0 ? "" : "-";
	var text		= this.integer.toString(10).replace(/^\-/, "");
	var zeros		= text.match(/0+$/);
	var zero_length	= (zeros !== null) ? zeros[0].length : 0;
	if(zero_length === text.length) {
		// 全て 0 なら 1 ケタ残す
		zero_length = text.length - 1;
	}
	var newScale	= this.scale() - zero_length;
	return(new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), newScale));
};

BigDecimal.prototype.add = function(augend, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(augend instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var src			= this;
	var tgt			= augend;
	var newscale	= Math.max(src._scale, tgt._scale);
	if(src._scale === tgt._scale) {
		// 1 e1 + 1 e1 = 1
		return(new BigDecimal(src.integer.add(tgt.integer), newscale, mc));
	}
	else if(src._scale > tgt._scale) {
		// 1 e-2 + 1 e-1
		var newdst = tgt.setScale(src._scale);
		// 0.01 + 0.10 = 0.11 = 11 e-2
		return(new BigDecimal(src.integer.add(newdst.integer), newscale, mc));
	}
	else {
		// 1 e-1 + 1 e-2
		var newsrc = src.setScale(tgt._scale);
		// 0.1 + 0.01 = 0.11 = 11 e-2
		return(new BigDecimal(newsrc.integer.add(tgt.integer), newscale, mc));
	}
};

BigDecimal.prototype.subtract = function(subtrahend, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(subtrahend instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var src			= this;
	var tgt			= subtrahend;
	var newscale	= Math.max(src._scale, tgt._scale);
	if(src._scale === tgt._scale) {
		return(new BigDecimal(src.integer.subtract(tgt.integer), newscale, mc));
	}
	else if(src._scale > tgt._scale) {
		var newdst = tgt.setScale(src._scale);
		return(new BigDecimal(src.integer.subtract(newdst.integer), newscale, mc));
	}
	else {
		var newsrc = src.setScale(tgt._scale);
		return(new BigDecimal(newsrc.integer.subtract(tgt.integer), newscale, mc));
	}
};

BigDecimal.prototype.multiply = function(multiplicand, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(multiplicand instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var src			= this;
	var tgt			= multiplicand;
	var newinteger	= src.integer.multiply(tgt.integer);
	// 0.1 * 0.01 = 0.001
	var newscale	= src._scale + tgt._scale;
	return(new BigDecimal(newinteger, newscale, mc));
};

BigDecimal.prototype.divideToIntegralValue = function(divisor, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(divisor instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var getDigit  = function( num ) {
		var i;
		var text = "1";
		for(i = 0; i < num; i++) {
			text = text + "0";
		}
		return(new BigInteger(text));
	};
	if(divisor.compareTo(BigDecimal.ZERO) === 0) {
		throw "ArithmeticException";
	}

	// 1000e0		/	1e2				=	1000e-2
	// 1000e0		/	10e1			=	100e-1
	// 1000e0		/	100e0			=	10e0
	// 1000e0		/	1000e-1			=	1e1
	// 1000e0		/	10000e-2		=	1e1
	// 1000e0		/	100000e-3		=	1e1

	// 10e2			/	100e0			=	1e1
	// 100e1		/	100e0			=	1e1
	// 1000e0		/	100e0			=	10e0
	// 10000e-1		/	100e0			=	100e-1	
	// 100000e-2	/	100e0			=	1000e-2

	var src			= this;
	var tgt			= divisor;
	var src_integer	= src.integer;
	var tgt_integer	= tgt.integer;
	var newScale	= src._scale - tgt._scale;

	// 100e-2 / 3e-1 = 1 / 0.3 -> 100 / 30
	if(src._scale > tgt._scale) {
		// src._scale に合わせる
		tgt_integer = tgt_integer.multiply(getDigit(  newScale ));
	}
	// 1e-1 / 3e-2 = 0.1 / 0.03 -> 10 / 3
	else if(src._scale < tgt._scale) {
		// tgt._scale に合わせる
		src_integer = src_integer.multiply(getDigit( -newScale ));
	}

	// とりあえず計算結果だけ作ってしまう
	var new_integer = src_integer.divide(tgt_integer);
	var sign		= new_integer.signum();
	if(sign !== 0) {
		var text		= new_integer.toString(10).replace(/^\-/, "");
		// 指定した桁では表すことができない
		if((mc.getPrecision() !== 0) && (text.length > mc.getPrecision())) {
			throw "ArithmeticException";
		}
		// 結果の優先スケール に合わせる (this.scale() - divisor.scale())
		if(text.length <= (-newScale)) {
			// 合わせることができないので、0をできる限り削る = stripTrailingZerosメソッド
			var zeros			= text.match(/0+$/);
			var zero_length		= (zeros !== null) ? zeros[0].length : 0;
			var sign_text		= sign >= 0 ? "" : "-";
			return(new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), -zero_length));
		}
	}

	var output = new BigDecimal(new_integer);
	output = output.setScale(newScale, RoundingMode.UP);
	output = output.round(mc);
	return(output);
};

BigDecimal.prototype.divideAndRemainder = function(divisor, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(divisor instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}

	// 1000e0		/	1e2				=	1000e-2	... 0e0
	// 1000e0		/	10e1			=	100e-1	... 0e0
	// 1000e0		/	100e0			=	10e0	... 0e0
	// 1000e0		/	1000e-1			=	1e1		... 0e0
	// 1000e0		/	10000e-2		=	1e1		... 0e-1
	// 1000e0		/	100000e-3		=	1e1		... 0e-2

	// 10e2			/	100e0			=	1e1		... 0e1
	// 100e1		/	100e0			=	1e1		... 0e1
	// 1000e0		/	100e0			=	10e0	... 0e0
	// 10000e-1		/	100e0			=	100e-1	... 0e-1
	// 100000e-2	/	100e0			=	1000e-2	... 0e-2

	var result_divide, result_remaind;
	result_divide	= this.divideToIntegralValue(divisor, mc);
	result_remaind	= this.subtract(result_divide.multiply(divisor, mc), mc);

	var output = [result_divide, result_remaind];
	return(output);
};

BigDecimal.prototype.divide = function(divisor, p1, p2) {
	if(!(divisor instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	var src				= this;
	var tgt				= divisor;
	var roundingMode	= null;
	var mc				= MathContext.UNLIMITED;
	var newScale		= 0;
	var isPriorityScale	= false;
	var parm;
	if(arguments.length === 1) {
		newScale		 = src.scale() - tgt.scale();
		isPriorityScale	= true;
	}
	else if(arguments.length === 2) {
		parm = p1;
		newScale		= src.scale();
		isPriorityScale	= true;
		if(parm instanceof MathContext) {
			mc = parm;
			roundingMode = mc.getRoundingMode();
		}
		else {
			roundingMode	= RoundingMode.getRoundingMode(arguments[0]);
		}
	}
	else if(arguments.length === 3) {
		if((typeof p1 === "number")||(p1 instanceof Number)) {
			newScale = p1;
		}
		else {
			throw "scale is not Integer";
		}
		parm = p2;
		if(parm instanceof MathContext) {
			mc = parm;
			roundingMode = mc.getRoundingMode();
		}
		else {
			roundingMode	= RoundingMode.getRoundingMode(arguments[0]);
		}
	}
	else {
		throw "The argument is over.";
	}
	if(tgt.compareTo(BigDecimal.ZERO) === 0) {
		throw "ArithmeticException";
	}
	var i;
	var newsrc = src;
	var result_map = [];
	var result, result_divide, result_remaind, all_result;
	all_result = BigDecimal.ZERO;
	var precision = mc.getPrecision();
	var check_max = precision !== 0 ? (precision + 8) : 0x3FFFF;
	for(i = 0; i < check_max; i++) {
		result = newsrc.divideAndRemainder(tgt, MathContext.UNLIMITED);
		result_divide	= result[0];
		result_remaind	= result[1];
		all_result = all_result.add(result_divide.scaleByPowerOfTen(-i), MathContext.UNLIMITED);
		if(result_remaind.compareTo(BigDecimal.ZERO) !== 0) {
			if(precision === 0) {	// 精度無限大の場合は、循環小数のチェックが必要
				if(result_map[result_remaind._getUnsignedIntegerString()]) {
					throw "ArithmeticException " + all_result + "[" + result_remaind._getUnsignedIntegerString() + "]";
				}
				else {
					result_map[result_remaind._getUnsignedIntegerString()] = true;
				}
			}
			newsrc = result_remaind.scaleByPowerOfTen(1);
		}
		else {
			break;
		}
	}
	if(isPriorityScale) {
		// 優先スケールの場合は、スケールの変更に失敗する可能性あり
		try {
			all_result = all_result.setScale(newScale);
		}
		catch(e) {
		}
	}
	else {
		all_result = all_result.setScale(newScale);
	}
	all_result = all_result.round(mc);
	return all_result;
};

BigDecimal.prototype.toBigInteger = function() {
	var x = this.toPlainString().replace(/\.\d*$/, "");
	return(new BigInteger(x.toPlainString()));
};

BigDecimal.prototype.toBigIntegerExact = function() {
	var x = this.setScale(0, RoundingMode.UNNECESSARY);
	return(new BigInteger(x.toPlainString()));
};

BigDecimal.prototype.longValue = function() {
	var x = this.toBigInteger();
	x = x.longValue();
	return(x);
};

BigDecimal.prototype.longValueExact = function() {
	var x = this.toBigIntegerExact();
	x = x.longValue();
	return x;
};

BigDecimal.prototype.intValue = function() {
	var x = this.toBigInteger();
	x = x.intValue();
	return(x & 0xFFFFFFFF);
};

BigDecimal.prototype.intValueExact = function() {
	var x = this.toBigIntegerExact();
	x = x.longValue();
	if((x < -2147483648) || (2147483647 < x)) {
		throw "ArithmeticException";
	}
	return x;
};

BigDecimal.prototype.floatValue = function() {
	var p = this.precision();
	if(MathContext.DECIMAL32.getPrecision() < p) {
		return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
	}
	return parseFloat(p.toEngineeringString());
};

BigDecimal.prototype.doubleValue = function() {
	var p = this.precision();
	if(MathContext.DECIMAL64.getPrecision() < p) {
		return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
	}
	return parseFloat(p.toEngineeringString());
};

BigDecimal.prototype.pow = function(n, mc) {
	if(Math.abs(n) > 999999999) {
		throw "ArithmeticException";
	}
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	if((mc.getPrecision() === 0) && (n < 0)) {
		throw "ArithmeticException";
	}
	if((mc.getPrecision() > 0) && (n > mc.getPrecision())) {
		throw "ArithmeticException";
	}
	var x, y;
	x = this.clone();
	y = BigDecimal.ONE;
	while(n !== 0) {
		if((n & 1) !== 0) {
			y = y.multiply(x, MathContext.UNLIMITED);
		}
		x = x.multiply(x, MathContext.UNLIMITED);
		n >>>= 1;
	}
	return(y.round(mc));
};

BigDecimal.ZERO					= new BigDecimal(0);
BigDecimal.ONE					= new BigDecimal(1);
BigDecimal.TEN					= new BigDecimal(10);
BigDecimal.ROUND_CEILING		= RoundingMode.CEILING;
BigDecimal.ROUND_DOWN			= RoundingMode.DOWN;
BigDecimal.ROUND_FLOOR			= RoundingMode.FLOOR;
BigDecimal.ROUND_HALF_DOWN		= RoundingMode.HALF_DOWN;
BigDecimal.ROUND_HALF_EVEN		= RoundingMode.HALF_EVEN;
BigDecimal.ROUND_HALF_UP		= RoundingMode.HALF_UP;
BigDecimal.ROUND_UNNECESSARY	= RoundingMode.UNNECESSARY;
BigDecimal.ROUND_UP				= RoundingMode.UP;

BigDecimal.valueOf = function(val, scale) {
	if(arguments.length === 1) {
		return new BigDecimal(val);
	}
	else if(arguments.length === 2) {
		if((typeof val === "number") && (val === Math.floor(val))) {
			return new BigDecimal(new BigInteger(val), scale);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	else {
		throw "IllegalArgumentException";
	}
	return null;
};