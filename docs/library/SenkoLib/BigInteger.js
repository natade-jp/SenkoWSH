/* global Random */

﻿/**
 * SenkoLib BigInteger.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 *
 * DEPENDENT LIBRARIES:
 *  素数関連のメソッドは Random.js が必要
 *  ない場合は、依存した機能が動作しません。
 */

// 16ビットごとに管理
// 16ビット*16ビットで32ビットのため
var BigInteger = function() {
	this.element     = [];
	this.sign        = 0;
	if((arguments.length === 2) && (typeof Random !== "undefined") && (arguments[1] instanceof Random)) {
		this.sign = 1;
		var len = arguments[0];
		var random = arguments[1];
		var size = ((len - 1) >> 4) + 1;
		var r;
		if(len === 0) {
			return;
		}
		for(var i = 0, j = 0; i < size; i++) {
			if(j === 0) {
				r = random.nextInt(); // 32ビットずつ作成する
				this.element[i] = r & 0xFFFF;
				j = 1;
			}
			else {
				this.element[i] = (r >>> 16) & 0xFFFF;
				j = 0;
			}
		}
		// 1～15ビット余る場合は、16ビットずつ作成しているので削る
		if((len % 16) !== 0) {
			this.element[this.element.length - 1] &= (1 << (len % 16)) - 1;
		}
		// 最後のビットに 0 をたくさん作成していると、
		// 0のみのデータになる可能性があるためメモリを修正
		this._memory_reduction();
	}
	else if(arguments.length === 3) {
		if(typeof Random === "undefined") {
			return;
		}
		while(true) {
			var x = new BigInteger(arguments[0], arguments[2]);
			if(x.isProbablePrime(arguments[1])) {
				this.element = x.element;
				this.sign = x.sign;
				break;
			}
		}
	}
	else if(arguments.length >= 1) {
		this.sign = 1;
		var obj = arguments[0];
		if(obj instanceof BigInteger) {
			for(var i = 0; i < arguments[0].element.length; i++) {
				this.element[i] = arguments[0].element[i];
			}
			this.sign = arguments[0].sign;
		}
		else if((typeof obj === "number")||(obj instanceof Number)) {
			var x = arguments[0];
			if(x < 0) {
				this.sign = -1;
				x = -x;
			}
			this.element = this._number_to_binary_number(x);
		}
		else if((typeof obj === "string")||(obj instanceof String)) {
			var x = arguments[0].replace(/\s/g, "").toLowerCase();
			var buff = x.match(/^[\-\+]+/);
			if(buff !==  null) {
				buff = buff[0];
				x = x.substring(buff.length, x.length);
				if(buff.indexOf("-") !==  -1) {
					this.sign = -1;
				}
			}
			if(arguments.length === 2) {
				this.element = this._string_to_binary_number(x, arguments[1]);
			}
			else if(/^0x/.test(x)) {
				this.element = this._string_to_binary_number(x.substring(2, x.length), 16);
			}
			else if(/^0b/.test(x)) {
				this.element = this._string_to_binary_number(x.substring(2, x.length), 2);
			}
			else if(/^0/.test(x)) {
				this.element = this._string_to_binary_number(x.substring(1, x.length), 8);
			}
			else {
				this.element = this._string_to_binary_number(x, 10);
			}
			// "0"の場合がある為
			if((this.element.length === 1)&&(this.element[0] === 0)) {
				this.element = [];
			}
		}
	}
};

BigInteger.prototype.equals = function(x) {
	if(!(x instanceof BigInteger)) {
		x = new BigInteger(x);
	}
	if(this.signum() !==  x.signum()) {
		return(false);
	}
	if(this.element.length !==  x.element.length) {
		return(false);
	}
	for(var i = 0;i < x.element.length; i++) {
		if(this.element[i] !==  x.element[i]) {
			return(false);
		}
	}
	return(true);
};

BigInteger.prototype.toString = function(radix) {
	if(arguments.length === 0) {
		radix = 10;
	}
	// int型で扱える数値で toString が可能なので、
	// せっかくだからより大きな進数で計算していけば、あとでtoStringする回数が減るテクニック
	// 2進数であれば、2^n乗で計算しても問題がない 4進数や8進数で計算して、2進数に戻せば巡回少数なし
	// v0.03 出来る限りまとめてn進数変換する
	var max_num = 0x3FFFFFFF;
	//                        max_num > radix^x
	// floor(log max_num / log radix) = x
	var keta = Math.floor( Math.log(max_num) / Math.log(radix) );
	var calcradix = Math.round(Math.pow(radix, keta));
	// zeros = "00000000...."
	var zeros = [];
	var i;
	for(i = 0; i < keta; i++) {
		zeros[i] = "0";
	}
	zeros = zeros.join("");
	// v0.03ここまで
	var x = this._binary_number_to_string(this.element, calcradix);
	var y = [];
	var z = "";
	if(this.signum() < 0) {
		y[y.length] = "-";
	}
	for(i = x.length - 1;i >= 0; i--) {
		z = x[i].toString(radix);
		if(i < (x.length - 1)) {
			y[y.length] = zeros.substring(0, keta - z.length);
		}
		y[y.length] = z;
	}
	return(y.join(""));
};

// 内部計算用
BigInteger.prototype.getShort = function(n) {
	if((n < 0) || (this.element.length <= n)) {
		return(0);
	}
	return(this.element[n]);
};

BigInteger.prototype.byteValue = function() {
	var x = this.getShort(0);
	x &= 0xFF;
	if((x > 0)&&(this.sign < 0)) {
		x = -x;
	}
	return(x);
};

BigInteger.prototype.shortValue = function() {
	var x = this.getShort(0);
	x &= 0xFFFF;
	if((x > 0)&&(this.sign < 0)) {
		x = -x;
	}
	return(x);
};

BigInteger.prototype.intValue = function() {
	var x = this.getShort(0) + (this.getShort(1) << 16);
	x &= 0xFFFFFFFF;
	if((x > 0)&&(this.sign < 0)) {
		x = -x;
	}
	return(x);
};

BigInteger.prototype.longValue = function() {
	var x = 0;
	for(var i = 3; i >= 0; i--) {
		x *= 65536;
		x += this.getShort(i);
	}
	if(this.sign < 0) {
		x = -x;
	}
	return(x);
};

BigInteger.prototype.floatValue = function() {
	return(parseFloat(this.toString()));
};

BigInteger.prototype.doubleValue = function() {
	return(parseFloat(this.toString()));
};

BigInteger.prototype.clone = function() {
	var y = new BigInteger();
	y.element = this.element.slice(0);
	y.sign    = this.sign;
	return(y);
};

BigInteger.prototype.getLowestSetBit = function() {
	for(var i = 0;i < this.element.length;i++) {
		if(this.element[i] !==  0) {
			var x = this.element[i];
			for(var j = 0; j < 16; j++) {
				if(((x >>> j) & 1) !==  0) {
					return(i * 16 + j);
				}
			}
		}
	}
	return(-1);
};

BigInteger.prototype.bitLength = function() {
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !==  0) {
			var x = this.element[i];
			for(var j = 15; j >= 0; j--) {
				if(((x >>> j) & 1) !==  0) {
					return(i * 16 + j + 1);
				}
			}
		}
	}
	return(0);
};

BigInteger.prototype.bitCount = function() {
	var target;
	if(this.sign >= 0) {
		target = this;
	}
	else {
		target = this.add(new BigInteger(1));
	}
	var len = target.bitLength();
	var bit = 0;
	var count = 0;
	for(var i = 0;bit < len;i++) {
		var x = target.element[i];
		for(var j = 0;((j < 16) && (bit < len));j++, bit++) {
			if(((x >>> j) & 1) !==  0) {
				count = count + 1;
			}
		}
	}
	return(count);
};

// 内部計算用
// 負の場合は、2の補数表現を作成します
BigInteger.prototype.getTwosComplement = function(len) {
	var y = this.clone();
	if(y.sign >= 0) {
		return(y);
	}
	else {
		// 正にする
		y.sign = 1;
		// ビットの数が存在しない場合は数える
		if(arguments.length === 0) {
			len = y.bitLength();
		}
		var e = y.element;
		var bit = 0;
		// ビット反転後
		for(var i = 0; i < e.length; i++) {
			e[i] ^= 0xFFFF;
		}
		// 1～15ビット余る場合は、16ビットずつ作成しているので削る
		// nビットのマスク（なお負の値を表す最上位ビットは削除する）
		if((len % 16) !== 0) {
			e[e.length - 1] &= (1 << (len % 16)) - 1;
		}
		// 1を加算
		y._add(new BigInteger(1));
		return(y);
	}
};

BigInteger.prototype._and = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var e1  = this, e2 = val;
	var s1  = e1.signum(), s2 = e2.signum();
	var len = Math.max(e1.bitLength(), e2.bitLength());
	// 引数が負の場合は、2の補数
	e1 = e1.getTwosComplement(len).element;
	e2 = e2.getTwosComplement(len).element;
	var size = Math.max(e1.length, e2.length);
	this.element = [];
	for(var i = 0;i < size;i++) {
		var x1 = (i >= e1.length) ? 0 : e1[i];
		var x2 = (i >= e2.length) ? 0 : e2[i];
		this.element[i] = x1 & x2;
	}
	if(this.bitLength() === 0) {
		this.element = [];
		this.sign = 0;
	}
	if((s1 === 1)||(s2 === 1)) {
		this.sign = 1;
	}
	// 出力が負の場合は、2の補数
	else if(this.sign === -1) {
		this.element = this.getTwosComplement(len).element;
	}
	return(this);
};

BigInteger.prototype.and = function(val) {
	return(this.clone()._and(val));
};

BigInteger.prototype._or = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var e1  = this, e2 = val;
	var s1  = e1.signum(), s2 = e2.signum();
	var len = Math.max(e1.bitLength(), e2.bitLength());
	// 引数が負の場合は、2の補数
	e1 = e1.getTwosComplement(len).element;
	e2 = e2.getTwosComplement(len).element;
	var size = Math.max(e1.length, e2.length);
	this.element = [];
	for(var i = 0;i < size;i++) {
		var x1 = (i >= e1.length) ? 0 : e1[i];
		var x2 = (i >= e2.length) ? 0 : e2[i];
		this.element[i] = x1 | x2;
	}
	this.sign = ((s1 === -1)||(s2 === -1)) ? -1 : Math.max(s1, s2);
	// 出力が負の場合は、2の補数
	if(this.sign === -1) {
		this.element = this.getTwosComplement(len).element;
	}
	return(this);
};

BigInteger.prototype.or = function(val) {
	return(this.clone()._or(val));
};

BigInteger.prototype._xor = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var e1  = this, e2 = val;
	var s1  = e1.signum(), s2 = e2.signum();
	var len = Math.max(e1.bitLength(), e2.bitLength());
	// 引数が負の場合は、2の補数
	e1 = e1.getTwosComplement(len).element;
	e2 = e2.getTwosComplement(len).element;
	var size = Math.max(e1.length, e2.length);
	this.element = [];
	for(var i = 0;i < size;i++) {
		var x1 = (i >= e1.length) ? 0 : e1[i];
		var x2 = (i >= e2.length) ? 0 : e2[i];
		this.element[i] = x1 ^ x2;
	}
	this.sign = ((s1 !== 0)&&(s1 !== s2)) ? -1 : 1;
	// 出力が負の場合は、2の補数
	if(this.sign === -1) {
		this.element = this.getTwosComplement(len).element;
	}
	return(this);
};

BigInteger.prototype.xor = function(val) {
	return(this.clone()._xor(val));
};

BigInteger.prototype._not = function() {
	return(this._add(new BigInteger(1))._negate());
};

BigInteger.prototype.not = function() {
	return(this.clone()._not());
};

BigInteger.prototype._andNot = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	return(this._and(val.not()));
};

BigInteger.prototype.andNot = function(val) {
	return(this.clone()._andNot(val));
};

BigInteger.prototype._number_to_binary_number = function(x) {
	if(x > 0xFFFFFFFF) {
		return(this._string_to_binary_number(x.toFixed(), 10));
	}
	var y = [];
	while(x !==  0) {
		y[y.length] = x & 1;
		x >>>= 1;
	}
	x = [];
	for(var i = 0; i < y.length; i++) {
		x[i >>> 4] |= y[i] << (i & 0xF);
	}
	return(x);
};

BigInteger.prototype._string_to_binary_number = function(text, radix) {
	// 下の変換をすることで、2進数での変換時に内部のforの繰り返す回数が減る
	// v0.03 出来る限りまとめてn進数変換する
	var max_num = 0x3FFFFFFF;
	var keta = Math.floor( Math.log(max_num) / Math.log(radix) );
	var calcradix = Math.round(Math.pow(radix, keta));
	var x = [], y = [];
	var len = Math.ceil(text.length / keta);
	var offset = text.length;
	for(var i = 0; i < len; i++ ) {
		offset -= keta;
		if(offset >= 0) {
			x[i] = parseInt(text.substring(offset, offset + keta), radix);
		}
		else {
			x[i] = parseInt(text.substring(0, offset + keta), radix);
		}
	}
	radix = calcradix;
	// v0.03ここまで
	// 2で割っていくアルゴリズムで2進数に変換する
	while(x.length !==  0) {
		// 2で割っていく
		// 隣の桁でたcarryはradix進数をかけて桁上げしてる
		var carry = 0;
		for(var i = x.length - 1; i >= 0; i--) {
			var a = x[i] + carry * radix;
			x[i]  = a >>> 1;
			carry = a & 1;
		}
		// 1余るかどうかをテストする
		y[y.length] = carry;
		// xが0になっている部分は削除していく
		if(x[x.length - 1] === 0) {
			x.pop();
		}
	}
	// メモリ節約のため1つの変数（16ビット）に収めるだけ収めていく
	x = [];
	for(var i = 0; i < y.length; i++) {
		x[i >>> 4] |= y[i] << (i & 0xF);
	}
	return(x);
};

BigInteger.prototype._binary_number_to_string = function(binary, radix) {
	var add = function(x1, x2, y) {
		var size = x1.length;
		var carry = 0;
		for(var i = 0; i < size; i++) {
			y[i] = x1[i] + ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
			if(y[i] >= radix) {
				carry = 1;
				y[i] -= radix;
			}
			else {
				carry = 0;
			}
		}
		if(carry === 1) {
			y[size] = 1;
		}
	};
	var y = [0];
	var t = [1];
	for(var i = 0;i < binary.length;i++) {
		for(var j = 0; j < 16; j++) {
			if((binary[i] >>> j) & 1) {
				add(t, y, y);
			}
			add(t, t, t);
		}
	}
	return(y);
};

BigInteger.prototype._memory_allocation = function(n) {
	var elementsize = this.element.length << 4;
	if(elementsize < n) {
		var addsize = (((n - elementsize - 1) & 0xFFFFFFF0) >>> 4) + 1;
		for(var i = 0;i < addsize;i++) {
			this.element[this.element.length] = 0;
		}
	}
};

BigInteger.prototype._memory_reduction = function() {
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !==  0) {
			if(i < this.element.length - 1) {
				this.element.splice(i + 1, this.element.length - i - 1);
			}
			return;
		}
	}
	this.sign = 0;
	this.element = [];
};

// ユークリッド互除法（非再帰）
// x = this, y = val としたとき gcd(x,y)を返す
BigInteger.prototype.gcd = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var x = this, y = val, z;
	while(y.signum() !== 0) {
		z = x.remainder(y);
		x = y;
		y = z;
	}
	return(x);
};

// 拡張ユークリッド互除法（非再帰）
// x = this, y = valとしたとき、 a*x + b*y = c = gcd(x, y) の[a, b, c]を返す
BigInteger.prototype.extgcd = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var ONE  = new BigInteger(1);
	var ZERO = new BigInteger(0);
	var r0 = this, r1 = val, r2, q1;
	var a0 = ONE,  a1 = ZERO, a2;
	var b0 = ZERO, b1 = ONE,  b2;
	while(r1.signum() !== 0) {
		var y = r0.divideAndRemainder(r1);
		q1 = y[0];
		r2 = y[1];
		a2 = a0.subtract(q1.multiply(a1));
		b2 = b0.subtract(q1.multiply(b1));
		a0 = a1;
		a1 = a2;
		b0 = b1;
		b1 = b2;
		r0 = r1;
		r1 = r2;
	}
	return([a0, b0, r0]);
};

BigInteger.prototype._abs = function() {
	// -1 -> 1, 0 -> 0, 1 -> 1
	this.sign *= this.sign;
	return(this);
};

BigInteger.prototype.abs = function() {
	return(this.clone()._abs());
};


BigInteger.prototype._negate = function() {
	this.sign *= -1;
	return(this);
};

BigInteger.prototype.negate = function() {
	return(this.clone()._negate());
};

BigInteger.prototype.signum = function() {
	if(this.element.length === 0) {
		return(0);
	}
	return(this.sign);
};

BigInteger.prototype.compareToAbs = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	if(this.element.length < val.element.length) {
		return(-1);
	}
	else if(this.element.length > val.element.length) {
		return(1);
	}
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !== val.element[i]) {
			var x = this.element[i] - val.element[i];
			return( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
		}
	}
	return(0);
};

BigInteger.prototype.compareTo = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	if(this.signum() !== val.signum()) {
		if(this.sign > val.sign) {
			return(1);
		}
		else {
			return(-1);
		}
	}
	else if(this.signum() === 0) {
		return(0);
	}
	return(this.compareToAbs(val) * this.sign);
};

BigInteger.prototype.max = function(val) {
	if(this.compareTo(val) >= 0) {
		return(this.clone());
	}
};

BigInteger.prototype.min = function(val) {
	if(this.compareTo(val) >= 0) {
		return(val.clone());
	}
};

BigInteger.prototype._shift = function(n) {
	if(n === 0) {
		return(this);
	}
	var x = this.element;
	// 1ビットなら専用コードで高速計算
	if(n === 1) {
		var i = x.length - 1;
		if((x[i] & 0x8000) !==  0) {
			x[x.length] = 1;
		}
		for(;i >= 0;i--) {
			x[i] <<= 1;
			x[i]  &= 0xFFFF;
			if((i > 0) && ((x[i - 1] & 0x8000) !==  0)) {
				x[i] += 1;
			}
		}
	}
	else if(n === -1) {
		for(var i = 0;i < x.length;i++) {
			x[i] >>>= 1;
			if((i < x.length - 1) && ((x[i + 1] & 1) !==  0)) {
				x[i] |= 0x8000;
			}
		}
		if(x[x.length - 1] === 0) {
			x.pop();
		}
	}
	else {
		// 16ビット単位なら配列を追加削除する高速計算
		if(n >= 16) {
			var m = n >>> 4;
			for(var i = x.length - 1; i >= 0; i--) {
				x[i + m] = x[i];
			}
			for(var i = m - 1; i >= 0; i--) {
				x[i] = 0;
			}
			n &= 0xF;
		}
		else if(n <= -16){
			var m = (-n) >>> 4;
			x.splice(0, m);
			n += m << 4;
		}
		if(n !== 0) {
			// 15ビット以内ならビット演算でまとめて操作
			if(0 < n) {
				var carry = 0;
				for(var i = 0; i < x.length; i++) {
					x[i] = (x[i] << n) + carry;
					if(x[i] > 0xFFFF) {
						carry = x[i] >>> 16;
						x[i] &= 0xFFFF;
					}
					else {
						carry = 0;
					}
				}
				if(carry !== 0) {
					x[x.length] = carry;
				}
			}
			else {
				n = -n;
				for(var i = 0; i < x.length; i++) {
					if(i !== x.length - 1) {
						x[i] += x[i + 1] << 16;
						x[i] >>>= n;
						x[i] &= 0xFFFF;
					}
					else {
						x[i] >>>= n;
					}
				}
				if(x[x.length - 1] === 0) {
					x.pop();
				}
			}
		}
	}
	return(this);
};

BigInteger.prototype.shift = function(n) {
	return(this.clone()._shift(n));
};

BigInteger.prototype.shiftLeft = function(n) {
	return(this.shift(n));
};

BigInteger.prototype.shiftRight = function(n) {
	return(this.shift(-n));
};

BigInteger.prototype._add = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var o1 = this;
	var o2 = val;
	var x1 = o1.element;
	var x2 = o2.element;
	if(o1.sign === o2.sign) {
		//足し算
		this._memory_allocation(x2.length << 4);
		var carry = 0;
		for(var i = 0; i < x1.length; i++) {
			x1[i] += ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
			if(x1[i] > 0xFFFF) {
				carry = 1;
				x1[i] &= 0xFFFF;
			}
			else {
				carry = 0;
			}
		}
		if(carry !== 0) {
			x1[x1.length] = carry;
		}
	}
	else {
		// 引き算
		var compare = o1.compareToAbs(o2);
		if(compare === 0) {
			this.element = [];
			this.sign = 1;
			return(this);
		}
		else if(compare === -1) {
			this.sign = o2.sign;
			var swap = x1;
			x1 = x2.slice(0);
			x2 = swap;
		}
		var carry = 0;
		for(var i = 0; i < x1.length; i++) {
			x1[i] -= ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
			if(x1[i] < 0) {
				x1[i] += 0x10000;
				carry  = 1;
			}
			else {
				carry  = 0;
			}
		}
		this.element = x1;
		this._memory_reduction();
	}
	return(this);
};

BigInteger.prototype.add = function(val) {
	return(this.clone()._add(val));
};

BigInteger.prototype._subtract = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var sign = val.sign;
	var out  = this._add(val._negate());
	val.sign = sign;
	return(out);
};

BigInteger.prototype.subtract = function(val) {
	return(this.clone()._subtract(val));
};

BigInteger.prototype._multiply = function(val) {
	var x = this.multiply(val);
	this.element = x.element;
	this.sign    = x.sign;
	return(this);
};

BigInteger.prototype.multiply = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var out  = new BigInteger();
	var buff = new BigInteger();
	var o1 = this;
	var o2 = val;
	var x1 = o1.element;
	var x2 = o2.element;
	var y  = out.element;
	for(var i = 0; i < x1.length; i++) {
		buff.element = [];
		// x3 = x1[i] * x2
		var x3 = buff.element;
		var carry = 0;
		for(var j = 0; j < x2.length; j++) {
			x3[j] = x1[i] * x2[j] + carry;
			if(x3[j] > 0xFFFF) {
				carry = x3[j] >>> 16;
				x3[j] &= 0xFFFF;
			}
			else {
				carry = 0;
			}
		}
		if(carry !== 0) {
			x3[x3.length] = carry;
		}
		// x3 = x3 << (i * 16)
		//buff._shift(i << 4);
		for(var j = x3.length - 1; j >= 0; j--) {
			x3[j + i] = x3[j];
		}
		for(var j = i - 1; j >= 0; j--) {
			x3[j] = 0;
		}
		// y = y + x3 (out._add(buff))
		//out._add(buff);
		carry = 0;
		out._memory_allocation(x3.length << 4);
		for(var j = i; j < y.length; j++) {
			y[j] += ((x3.length >= (j + 1)) ? x3[j] : 0) + carry;
			if(y[j] > 0xFFFF) {
				carry = 1;
				y[j] &= 0xFFFF;
			}
			else {
				carry = 0;
			}
		}
		if(carry !== 0) {
			y[y.length] = carry;
		}
	}
	out.sign = this.sign * val.sign;
	return(out);
};

BigInteger.prototype._divideAndRemainder = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var out = [];
	if(val.signum() === 0) {
		out[0] = 1 / 0;
		out[1] = 0 / 0;
		return(out);
	}
	var compare = this.compareToAbs(val);
	if(compare < 0) {
		out[0] = new BigInteger(0);
		out[1] = this.clone();
		return(out);
	}
	else if(compare === 0) {
		out[0] = new BigInteger(1);
		out[0].sign = this.sign * val.sign;
		out[1] = new BigInteger(0);
		return(out);
	}
	var size = this.bitLength() - val.bitLength();
	var x1 = this.clone()._abs();
	var x2 = val.shift(size)._abs();
	var y  = new BigInteger();
	var ONE = new BigInteger(1);
	for(var i = 0; i <= size; i++) {
		if(x1.compareToAbs(x2) >= 0) {
			x1._subtract(x2);
			y._add(ONE);
		}
		if(i === size) {
			break;
		}
		x2._shift(-1);
		y._shift(1);
	}
	out[0] = y;
	out[0].sign = this.sign * val.sign;
	out[1] = x1;
	out[1].sign = this.sign;
	return(out);
};

BigInteger.prototype.divideAndRemainder = function(val) {
	return(this.clone()._divideAndRemainder(val));
};

BigInteger.prototype._divide = function(val) {
	return(this._divideAndRemainder(val)[0]);
};

BigInteger.prototype.divide = function(val) {
	return(this.clone()._divide(val));
};

BigInteger.prototype._remainder = function(val) {
	return(this._divideAndRemainder(val)[1]);
};

BigInteger.prototype.remainder = function(val) {
	return(this.clone()._remainder(val));
};

BigInteger.prototype._mod = function(val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	if(val.signum() < 0) {
		return null;
	}
	var y = this._divideAndRemainder(val);
	if(y[1] instanceof BigInteger) {
		if(y[1].signum() >= 0) {
			return(y[1]);
		}
		else {
			return(y[1]._add(val));
		}
	}
	return(null);
};

BigInteger.prototype.mod = function(val) {
	return(this.clone()._mod(val));
};

BigInteger.prototype._setBit = function(n) {
	this._memory_allocation(n + 1);
	this.element[n >>> 4] |= 1 << (n & 0xF);
	return(this);
};

BigInteger.prototype.setBit = function(n) {
	return(this.clone()._setBit(n));
};

BigInteger.prototype._flipBit = function(n) {
	this._memory_allocation(n + 1);
	this.element[n >>> 4] ^= 1 << (n & 0xF);
	return(this);
};

BigInteger.prototype.flipBit = function(n) {
	return(this.clone()._flipBit(n));
};

BigInteger.prototype.clearBit = function(n) {
	var y = this.clone();
	y.element[n >>> 4] &= ~(1 << (n & 0xF));
	y._memory_reduction();
	return(y);
};

BigInteger.prototype.testBit = function(n) {
	return((this.element[n >>> 4] >>> (n & 0xF)) & 1);
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

BigInteger.prototype.modPow = function(exponent, m) {
	m = new BigInteger(m);
	var x, y, e;
	x = new BigInteger(this);
	y = new BigInteger(1);
	e = new BigInteger(exponent);
	while(e.element.length !== 0) {
		if((e.element[0] & 1) !== 0) {
			y = y.multiply(x).mod(m);
		}
		x = x.multiply(x).mod(m);
		e._shift(-1);
	}
	return(y);
};

BigInteger.prototype.modInverse = function(m) {
	m = new BigInteger(m);
	var y = this.extgcd(m);
	var ONE  = new BigInteger(1);
	if(y[2].compareTo(ONE) !== 0) {
		return(null);
	}
	// 正にするため remainder ではなく mod を使用する
	return(y[0]._add(m)._mod(m));
};

BigInteger.prototype.isProbablePrime = function(certainty) {
	var e = this.element;
	//0, 1, 2 -> true
	if( (e.length === 0) || ((e.length === 1)&&(e[0] <= 2)) ) {
		return(true);
	}
	//even number -> false
	else if( ((e[0] & 1) === 0) || (certainty <= 0) ) {
		return(false);
	}
	if(typeof Random === "undefined") {
		return(false);
	}
	// ミラーラビン素数判定法
	// かなり処理が重たいです。まあお遊び程度に使用という感じで。
	certainty	= certainty >> 1;
	var ZERO	= new BigInteger(0);
	var ONE		= new BigInteger(1);
	var n		= this;
	var LEN		= n.bitLength();
	var n_1		= n.subtract(ONE);
	var s 		= n_1.getLowestSetBit();
	var d 		= n_1.shift(-s);
	var a, random = new Random();
	var isComposite;
	for(var i = 0; i < certainty; i++ ) {
		//[ 1, n - 1] の範囲から a を選択
		do {
			a = new BigInteger( LEN, random );
		} while(( a.compareTo(ZERO) === 0 )||( a.compareTo(n) !== -1 ));
		// a^d != 1 mod n
		a = a.modPow(d, n);
		if( a.compareTo(ONE) === 0 ) {
			continue;
		}
		// x ^ 4 % 2 = ((x ^ 2 % 2) ^ 2 % 2) のように分解しておく
		isComposite = true;
		for(var j = 0; j <= s; j++) {
			if(a.compareTo(n_1) === 0) {
				isComposite = false;
				break;
			}
			if(j < s) {
				a = a.multiply(a)._mod(n);
			}
		}
		if(isComposite) {
			return(false);
		}
	}
	return(true);
};

BigInteger.prototype.nextProbablePrime = function() {
	if(typeof Random === "undefined") {
		return(new BigInteger(0));
	}
	var x = this.clone();
	var ONE	= new BigInteger(1);
	while(true) {
		x._add(ONE);
		if(x.isProbablePrime(100)) {
			break;
		}
	}
	return(x);
};

BigInteger.ONE = new BigInteger(1);
BigInteger.TEN = new BigInteger(10);
BigInteger.ZERO = new BigInteger(0);
BigInteger.valueOf = function(x){
	return(new BigInteger(x));
};
BigInteger.probablePrime = function(bitLength, rnd){
	return(new BigInteger(bitLength ,100 ,rnd));
};
