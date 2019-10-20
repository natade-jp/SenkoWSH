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
 * Multiply two 32-bit integers and output a 32-bit integer.
 * @param {number} x1 
 * @param {number} x2 
 * @returns {number}
 * @private
 * @ignore
 */
const multiplication32 = function(x1, x2) {
	let y = ((x1 & 0xFFFF) * (x2 & 0xFFFF)) >>> 0;
	let b = (x1 & 0xFFFF) * (x2 >>> 16);
	y = (y + ((b & 0xFFFF) << 16)) >>> 0;
	b = (x1 >>> 16) * (x2 & 0xFFFF);
	y = (y + ((b & 0xFFFF) << 16)) >>> 0;
	return y;
};

/**
 * 乱数
 */
export default class Random {
	
	/**
	 * 初期化
	 * @param {number} [seed] - Seed number for random number generation. If not specified, create from time.
	 */
	constructor(seed) {

		/**
		 * @type {number}
		 * @private
		 * @ignore
		 */
		this.x = 123456789;
		
		/**
		 * @type {number}
		 * @private
		 * @ignore
		 */
		this.y = 362436069;
		
		/**
		 * @type {number}
		 * @private
		 * @ignore
		 */
		this.z = 521288629;
		
		/**
		 * @type {number}
		 * @private
		 * @ignore
		 */
		this.w = 88675123;

		if(seed !== undefined) {
			this.setSeed(seed);
		}
		else {
			// 線形合同法で適当に乱数を作成する
			const new_seed = ((new Date()).getTime() + Random.seedUniquifier) & 0xFFFFFFFF;
			Random.seedUniquifier = (Random.seedUniquifier + 1) & 0xFFFFFFFF;
			this.setSeed(new_seed);
		}
	}

	/**
	 * シード値の初期化
	 * @param {number} seed
	 */
	setSeed(seed) {
		// seedを使用して線形合同法で初期値を設定
		let random_seed = seed;
		random_seed = (multiplication32(random_seed, 214013) + 2531011) >>> 0;
		this.z = random_seed;
		random_seed = (multiplication32(random_seed, 214013) + 2531011) >>> 0;
		this.w = random_seed;

		/**
		 * Is keep random numbers based on Gaussian distribution.
		 * @private
		 * @type {boolean}
		 */
		this.haveNextNextGaussian = false;
		
		/**
		 * Next random number based on Gaussian distribution.
		 * @private
		 * @type {number}
		 */
		this.nextNextGaussian = 0;
	}

	/**
	 * 32-bit random number.
	 * @returns {number} - 32ビットの乱数
	 * @private
	 */
	genrand_int32() {
		const t = this.x ^ (this.x << 11);
		this.x = this.y;
		this.y = this.z;
		this.z = this.w;
		this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
		return this.w;
	}

	/**
	 * 指定したビット長以下で表せられる乱数生成
	 * @param {number} bits - Required number of bits (up to 64 possible).
	 * @returns {number}
	 */
	next(bits) {
		if(bits === 0) {
			return 0;
		}
		else if(bits === 32) {
			return this.genrand_int32();
		}
		else if(bits < 32) {
			// 線形合同法ではないため
			// 上位のビットを使用しなくてもいいがJavaっぽく。
			return this.genrand_int32() >>> (32 - bits);
		}
		// double型のため、52ビットまでは、整数として出力可能
		else if(bits === 63) {
			// 正の値を出力するように調節
			return this.next(32) * 0x80000000 + this.next(32);
		}
		else if(bits === 64) {
			return this.next(32) * 0x100000000 + this.next(32);
		}
		else if(bits < 64) {
			return this.genrand_int32() * (1 << (bits - 32)) + (this.genrand_int32()  >>> (64 - bits));
		}
	}

	/**
	 * 8ビット長整数の乱数の配列
	 * @param {number} size - 必要な長さ
	 * @returns {Array<number>}
	 */
	nextBytes(size) {
		const y = new Array(size);
		// 配列yに乱数を入れる
		// 8ビットのために、32ビット乱数を1回回すのはもったいない
		for(let i = 0;i < y.length; i++) {
			y[i] = this.next(8);
		}
		return y;
	}

	/**
	 * 16ビット長整数の乱数
	 * @returns {number}
	 */
	nextShort() {
		return this.next(16);
	}

	/**
	 * 32ビット長整数の乱数
	 * @param {number} [x] - 指定した値未満の数値を作る
	 * @returns {number}
	 */
	nextInt(x) {
		if((x !== undefined) && (typeof x === "number")) {
			let r, y;
			do {
				r = this.genrand_int32() >>> 0;
				y = r % x;
			} while((r - y + x) > 0x100000000 );
			return y;
		}
		return this.next(32) | 0;
	}

	/**
	 * 64ビット長整数の乱数
	 * @returns {number}
	 */
	nextLong() {
		return this.next(64);
	}

	/**
	 * bool値の乱数
	 * @returns {boolean}
	 */
	nextBoolean() {
		// 1ビットのために、32ビット乱数を1回回すのはもったいない
		return (this.next(1) !== 0);
	}

	/**
	 * float精度の実数
	 * @returns {number}
	 */
	nextFloat() {
		return (this.next(24) / 0x1000000);
	}

	/**
	 * double精度の実数
	 * @returns {number}
	 */
	nextDouble() {
		const a1 = this.next(26) * 0x8000000 + this.next(27);
		const a2 = 0x8000000 * 0x4000000;
		return (a1 / a2);
	}

	/**
	 * ガウシアン分布に従う乱数
	 * @returns {number}
	 */
	nextGaussian() {
		if(this.haveNextNextGaussian) {
			this.haveNextNextGaussian = false;
			return this.nextNextGaussian;
		}
		// Box-Muller法
		const a = Math.sqrt( -2 * Math.log( this.nextDouble() ) );
		const b = 2 * Math.PI * this.nextDouble();
		const y = a * Math.sin(b);
		this.nextNextGaussian = a * Math.cos(b);
		this.haveNextNextGaussian = true;
		return y;
	}

}

/**
 * 乱数生成用の初期シード値
 * @type {number}
 * @private
 * @ignore
 */
Random.seedUniquifier = 0x87654321;

