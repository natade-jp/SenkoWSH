/**
 * SenkoLib Random.js
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

// 「M系列乱数」
// 比較的長い 2^521 - 1通りを出力します。
// 詳細は、奥村晴彦 著『C言語によるアルゴリズム辞典』を参照
// 乱数はCでの動作と同じ値が出ることを確認。(seed = 1として1000番目の値が等しいことを確認)
//
// Javaの仕様に基づく48ビット線形合同法を実装仕様と思いましたが
// 「キャリー付き乗算」、「XorShift」、「線形合同法」などは
// 2つを組にしてプロットするといった使い方をすると、模様が見える可能性があるようで止めました。
// 有名で超高性能な「メルセンヌツイスタ」は、MITライセンスのため組み込みませんでした。

var Random = function() {
	this.x = [];
	for(var i = 0;i < 521;i++) {
		this.x[i] = 0;
	}
	if(arguments.length >= 1) {
		this.setSeed(arguments[0]);
	}
	else {
		// 線形合同法で適当に乱数を作成する
		var seed = ((new Date()).getTime() + Random.seedUniquifier) & 0xFFFFFFFF;
		Random.seedUniquifier = (Random.seedUniquifier + 1) & 0xFFFFFFFF;
		this.setSeed(seed);
	}
};

Random.prototype._unsigned32 = function(x) {
	return((x < 0) ? ((x & 0x7FFFFFFF) + 0x80000000) : x);
};

Random.prototype._multiplication32 = function(x1, x2) {
	var b = (x1 & 0xFFFF) * (x2 & 0xFFFF);
	var y = this._unsigned32(b);
	b = (x1 & 0xFFFF) * (x2 >>> 16);
	y = this._unsigned32(y + ((b & 0xFFFF) << 16));
	b = (x1 >>> 16) * (x2 & 0xFFFF);
	y = this._unsigned32(y + ((b & 0xFFFF) << 16));
	return(y & 0xFFFFFFFF);
};

Random.prototype._rnd521 = function() {
	var x = this.x;
	for(var i = 0; i < 32; i++) {
		x[i] ^= x[i + 489];
	}
	for(var i = 32; i < 521; i++) {
		x[i] ^= x[i - 32];
	}
};

Random.prototype.setSeed = function(seed) {
	// 伏見「乱数」東京大学出版会,1989 の方法により初期値を設定
	var u = 0;
	var x = this.x;
	// seedを使用して線形合同法でx[0-16]まで初期値を設定
	for(var i = 0; i <= 16; i++) {
		for(var j = 0; j < 32; j++) {
			seed = this._multiplication32(seed, 0x5D588B65) + 1;
			u = (u >>> 1) + ((seed < 0) ? 0x80000000 : 0);
		}
		x[i] = u;
	}
	// 残りのビットはx[i] = x[i-32] ^ x[i-521]で生成
	for(var i = 16; i < 521; i++) {
		u = (i === 16) ? i : (i - 17);
		x[i] = ((x[u] << 23) & 0xFFFFFFFF) ^ (x[i - 16] >>> 9) ^ x[i - 1];
	}
	// ビットをシャッフル
	for(var i = 0; i < 4; i++) {
		this._rnd521();
	}
	this.xi = 0;
	this.haveNextNextGaussian = false;
	this.nextNextGaussian = 0;
};

Random.prototype.genrand_int32 = function() {
	// 全て使用したら、再び混ぜる
	if(this.xi === 521) {
		this._rnd521();
		this.xi = 0;
	}
	var y = this._unsigned32(this.x[this.xi]);
	this.xi = this.xi + 1;
	return(y);
};

Random.prototype.next = function(bits) {
	if(bits === 0) {
		return(0);
	}
	else if(bits === 32) {
		return(this.genrand_int32());
	}
	else if(bits < 32) {
		// 線形合同法ではないため

		// 上位のビットを使用しなくてもいいがJavaっぽく。
		return(this.genrand_int32() >>> (32 - bits));
	}
	// double型のため、52ビットまでは、整数として出力可能
	else if(bits === 63) {
		// 正の値を出力するように調節
		return(this.next(32) * 0x80000000 + this.next(32));
	}
	else if(bits === 64) {
		return(this.next(32) * 0x100000000 + this.next(32));
	}
	else if(bits < 64) {
		return(this.genrand_int32() * (1 << (bits - 32)) + (this.genrand_int32()  >>> (64 - bits)));
	}
};

Random.prototype.nextBytes = function(y) {
	// 8ビットのために、32ビット乱数を1回回すのはもったいない
	for(var i = 0;i < y.length; i++) {
		y[i] = this.next(8);
	}
	return;
};

Random.prototype.nextInt = function() {
	if(arguments.length === 1) {
		var r, y, a = arguments[0];
		do {
			r = this._unsigned32(this.genrand_int32());
			y = r % a;
		} while((r - y + a) > 0x100000000 );
		return(y);
	}
	return(this.next(32) & 0xFFFFFFFF);
};

Random.prototype.nextLong = function() {
	return(this.next(64));
};

Random.prototype.nextBoolean = function() {
	// 1ビットのために、32ビット乱数を1回回すのはもったいない
	return(this.next(1) !== 0);
};

Random.prototype.nextFloat = function() {
	return(this.next(24) / 0x1000000);
};

Random.prototype.nextDouble = function() {
	var a1 = this.next(26) * 0x8000000 + this.next(27);
	var a2 = 0x8000000 * 0x4000000;
	return(a1 / a2);
};

Random.prototype.nextGaussian = function() {
	if(this.haveNextNextGaussian) {
		this.haveNextNextGaussian = false;
		return(this.nextNextGaussian);
	}
	var a = Math.sqrt( -2 * Math.log( this.nextDouble() ) );
	var b = 2 * Math.PI * this.nextDouble();
	var y = a * Math.sin(b);
	this.nextNextGaussian = a * Math.cos(b);
	this.haveNextNextGaussian = true;
	return(y);
};

Random.seedUniquifier = 0x87654321;

