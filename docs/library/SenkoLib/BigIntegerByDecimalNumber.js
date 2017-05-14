/**
 * BigIntegerByDecimalNumber.js
 * 
 * VERSION:
 *  0.01
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  NYSL Version 0.9982 / The MIT License の Multi-licensing
 *  NYSL Version 0.9982 http://www.kmonos.net/nysl/
 *  The MIT License https://ja.osdn.net/projects/opensource/wiki/licenses%2FMIT_license
 *
 * HISTORY:
 *  2014/05/10 - v0.01 - natade - 	first release
 *							四則演算の実装済み
 *							文字列から10進数の変換が高速な最小限の BigInteger です。
 *							このスクリプトはテスト用です。 BigInteger.js を使ってください。
 *							簡単な計算、文字列変換多い場合等は、こっちのほうが進数変換がないため効率いいかも。
 *
 */

// 10進数を用いた最小限の機能を持つ BigInteger
var BigInteger = function() {
	this.element = [];
	this.sign  = 1;
	if(arguments.length === 1) {
		if(arguments[0] instanceof BigInteger) {
			for(var i = 0; i < arguments[0].element.length; i++) {
				this.element[i] = arguments[0].element[i];
			}
			this.sign = arguments[0].sign;
		}
		// 数字から変換
		else if(typeof arguments[0] === "number") {
			var x = arguments[0], ix;
			if(x >= 0) {
				this.sign = 1;
			}
			else {
				this.sign = -1;
				x = -x;
			}
			ix = Math.floor(x);
			for(var i = 0; ix !== 0; i++) {
				this.element[i] = ix % 10;
				ix = Math.floor(ix / 10);
			}
		}
		// 文字列から変換
		else if(typeof arguments[0] === "string") {
			var text = arguments[0].replace(/\s/g, "").toLowerCase();
			var buff;
			// + と -
			buff = text.match(/^[\-\+]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substring(buff.length, text.length);
				if(buff.indexOf("-") !== -1) {
					this.sign = -1;
				}
			}
			buff = text.match(/[1-9][0-9]*/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substring(buff.length, text.length);
				var j = buff.length - 1;
				for(var i = 0; i < buff.length; i++) {
					this.element[i] = buff.charCodeAt(j--) - 48;
				}
			}
			else {
				this.sign = 0;
				this.element = [];
			}
		}
	}
	this._normalize();
};

BigInteger.prototype._normalize = function() {
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !==  0) {
			if(i < this.element.length - 1) {
				this.element.splice(i + 1, this.element.length - i - 1);
			}
			return;
		}
		if(i === 0) {
			this.element = [];
		}
	}
	if(this.element.length === 0) {
		this.sign = 0;
	}
};

BigInteger.prototype.clone = function() {
	return(new BigInteger(this));
};

BigInteger.prototype.toString = function() {
	if((this.sign === 0)||(this.element.length === 0)) {
		return("0");
	}
	var output = "";
	if(this.sign < 0) {
		output += "-";
	}
	for(var i = this.element.length - 1;i >= 0; i--) {
		output += String.fromCharCode(this.element[i] + 48);
	}
	return(output);
};

BigInteger.prototype.equals = function(obj) {
	if(!(obj instanceof BigInteger)) {
		obj = new BigInteger(obj);
	}
	if(this.sign !== obj.sign) {
		return(false);
	}
	if(this.element.length !== obj.element.length) {
		return(false);
	}
	for(var i = 0;i < this.element.length; i++) {
		if(this.element[i] !== obj.element[i]) {
			return(false);
		}
	}
	return(true);
};

BigInteger.prototype.compareTo = function(obj) {
	if(!(obj instanceof BigInteger)) {
		obj = new BigInteger(obj);
	}
	if(this.sign !== obj.sign) {
		return(this.sign > obj.sign ? 1 : -1);
	}
	if(this.sign === 0) {
		return(0);
	}
	if(this.element.length !== obj.element.length) {
		return(this.element.length > obj.element.length ? this.sign : -this.sign);
	}
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !== obj.element[i]) {
			var x = this.element[i] - obj.element[i];
			return( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
		}
	}
	return(0);
};

BigInteger.prototype.compareToAbs = function(obj) {
	if(!(obj instanceof BigInteger)) {
		obj = new BigInteger(obj);
	}
	if(this.element.length !== obj.element.length) {
		return(this.element.length > obj.element.length ? this.sign : -this.sign);
	}
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !== obj.element[i]) {
			var x = this.element[i] - obj.element[i];
			return( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
		}
	}
	return(0);
};


BigInteger.prototype.negate = function() {
	var output = new BigInteger(this);
	output.sign *= -1;
	return(output);
};

BigInteger.prototype.abs = function() {
	var output = new BigInteger(this);
	if(output.sign < -1) {
		output.sign = 1;
	}
	return(output);
};

BigInteger.prototype._shift = function(x) {
	var output = this;
	var element = this.element;
	// 下記の条件はsign===0にしてはいけない、length!==0で確認すること。
	// 理由は、divideAndRemainderの計算内でshift計算を行うためである
	if(this.element.length !== 0) {
		if(x === 1) {
			element.reverse();
			element.push(0);
			element.reverse();
		}
		else if(x === -1) {
			if(element.length > 0) {
				element.shift();
			}
			else {
				element = [];
				output.sign = 0;
			}
		}
		else if(x > 0) {
			for(var i = element.length - 1; i >= 0; i--) {
				element[i + x] = element[i];
			}
			for(var i = 0; i < x; i++) {
				element[x - 1 - i] = 0;
			}
		}
		else if(x < 0) {
			x  = -x;
			var len = x > element.length ? 0 : element.length - x;
			for(var i = 0; i < len; i++) {
				element[i] = element[i + x];
			}
			x = element.length - x;
			x = 0 > x ? 0 : x;
			element.splice(x, element.length - x);
			if(element.length === 0) {
				output.sign = 0;
			}
		}
	}
	return(output);
};

BigInteger.prototype.shift = function(x) {
	return(this.clone()._shift(x));
};

BigInteger.prototype.add = function(augend) {
	var output = new BigInteger();
	var size, carry;
	var x1, x2, y;
	var o1, o2;
	if(!(augend instanceof BigInteger)) {
		augend = new BigInteger(augend);
	}
	o1 = this;
	o2 = augend;
	if(o1.sign === 0 || o2.sign === 0) {
		if(o1.sign === 0) {
			return(augend);
		}
		else {
			return(this.clone());
		}
	}
	if(o1.sign === o2.sign) { //足し算
		// abs(o1) + abs(o2)
		output.sign = o1.sign;
		carry = 0;
		size = (o1.element.length > o2.element.length) ? o1.element.length : o2.element.length;
		for(var i = 0; i < size; i++) {
			x1 = (o1.element.length >= (i + 1)) ? o1.element[i] : 0;
			x2 = (o2.element.length >= (i + 1)) ? o2.element[i] : 0;
			y  = x1 + x2 + carry;
			output.element[i] = y % 10;
			carry = Math.floor(y / 10);
		}
		if(carry === 1) {
			output.element[size] = 1;
		}
	}
	else { // 引き算
		// データの正規化
		var compare = o1.compareToAbs(o2);
		if(compare === 0) {
			return(output);
		}
		if(o1.sign > o2.sign) {
			if(compare === -1) {
				output.sign = -1;
				o1 = augend;
				o2 = this;
			}
			else {
				output.sign = 1;
			}
		}
		else {
			if(compare === 1) {
				output.sign = -1;
			}
			else {
				output.sign = 1;
				o1 = augend;
				o2 = this;
			}
		}
		// abs(o1) > abs(o2) で、 abs(o1) + abs(o2)
		carry = 0;
		size = (o1.element.length > o2.element.length) ? o1.element.length : o2.element.length;
		for(var i = 0; i < size; i++) {
			x1 = (o1.element.length >= (i + 1)) ? o1.element[i] : 0;
			x2 = (o2.element.length >= (i + 1)) ? o2.element[i] : 0;
			y  = 10 + x1 - x2 - carry;
			output.element[i] = y % 10;
			carry = y < 10 ? 1 : 0;
		}
		output._normalize();
	}
	return(output);
};

BigInteger.prototype.subtract = function(subtrahend) {
	return(this.add(subtrahend.negate()));
};

// 正の1ケタの整数値で掛け算します
BigInteger.prototype.mul1digit = function(x) {
	var output = new BigInteger();
	var size, carry, y;
	// abs(this) * x
	output.sign = this.sign;
	carry = 0;
	for(var i = 0; i < this.element.length; i++) {
		y = this.element[i] * x + carry;
		output.element[i] = y % 10;
		carry = Math.floor(y / 10);
	}
	if(carry !== 0) {
		output.element[this.element.length] = carry;
	}
	return(output);
};

BigInteger.prototype.multiply = function(multiplicand) {
	if(!(multiplicand instanceof BigInteger)) {
		multiplicand = new BigInteger(multiplicand);
	}
	var output = new BigInteger();
	for(var i = 0; i < multiplicand.element.length; i++) {
		output = output.add((this.mul1digit(multiplicand.element[i])).shift( i ));
	}
	output.sign = this.sign * multiplicand.sign;
	return(output);
};

BigInteger.prototype.divideAndRemainder = function(divisor) {
	divisor = new BigInteger(divisor);
	var out = [];
	if(divisor.sign === 0) {
		out[0] = 1 / 0;
		out[1] = 0 / 0;
		return(out);
	}
	switch(this.compareToAbs(divisor)) {
		case 0:
			out[0] = new BigInteger(1);
			out[1] = new BigInteger(0);
			out[0].sign = this.sign * divisor.sign;
			return(out);
		case -1:
			out[0] = new BigInteger(0);
			out[1] = this.clone();
			return(out);
	}
	var i, j;
	var out1_sign = this.sign * divisor.sign;
	var out2_sign = this.sign;
	var x1 = this.abs();
	var x2 = divisor.abs();
	var size = x1.element.length - x2.element.length + 1;
	var y1, y2 = x2.clone()._shift(size);
	var b = new BigInteger(0);
	for(i = 0; i < size; i++) {
		y1 = x2.clone()._shift(size - i);
		y2._shift(-1);
		b._shift(1);
		for(j = 0; j < 10; j++) {
			if(x1.compareToAbs(y1) >= 0) {
				x1 = x1.subtract(y1);
				if(j === 0) {
					b.element[0] = 1;
					b._shift(1);
				}
				else {
					b.element[0] = 10 - j;
				}
				break;
			}
			y1 = y1.subtract(y2);
		}
		if(x1.sign === 0) {
			b._shift(size - i - 1);
			break;
		}
	}
	b.sign  = out1_sign;
	x1.sign = out2_sign;
	out[0] = b;
	out[1] = x1;
	return(out);
};

BigInteger.prototype.divide = function(val) {
	return(this.divideAndRemainder(val)[0]);
};

BigInteger.prototype.remainder = function(val) {
	return(this.divideAndRemainder(val)[1]);
};

BigInteger.prototype.pow = function(n) {
	var x, y;
	x = new BigInteger(this);
	y = new BigInteger(1);
	while(n !== 0) {
		if((n & 1) !== 0) {
			y = y.multiply(x);
		}
		x = x.multiply(x);
		n >>>= 1;
	}
	return(y);
};

BigInteger.ONE = new BigInteger(1);
BigInteger.TEN = new BigInteger(10);
BigInteger.ZERO = new BigInteger(0);
BigInteger.valueOf = function(x){
	return(new BigInteger(x));
};

