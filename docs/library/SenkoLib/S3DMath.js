"use strict";

﻿/**
 * SenkoLib S3DMath.js
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

// 3DCG を作るうえで必要な計算用ライブラリ
// S3Math   追加計算関数
// S3Vector ベクトル (immutable)
// S3Matrix 行列 (immutable)
// S3Angles オイラー角 (immutable)

var S3Math =  {
	EPSILON: 2.2204460492503130808472633361816E-16,
	clamp: function(x, min, max) {
		return (x < min) ? min : (x > max) ? max : x;
	},
	step: function(edge, x) {
		return edge > x ? 1 : 0;
	},
	mix: function(v0, v1, x) {
		return v0 + (v1 - v0) * x;
	},
	smoothstep: function(v0, v1, x) {
		var s = x * x * (3.0 - 2.0 * x);
		return v0 + (v1 - v0) * s;
	},
	equals: function(x1, x2) {
		return Math.abs(x1 - x2) < S3Math.EPSILON;
	},
	mod: function(x, y) {
		return x - y * parseInt(x / y);
	},
	sign: function(x) {
		return x >= 0.0 ? 1.0 : -1.0;
	},
	fract: function(x) {
		return x - floor(x);
	},
	rsqrt: function(x) {
		return Math.sqrt(1.0 / x);
	},
	radius: function(degree) {
		return (degree / 360.0) * (2.0 * Math.PI);
	},
	degrees: function(rad) {
		return rad / (2.0 * Math.PI) * 360.0;
	}
};

/**
 * /////////////////////////////////////////////////////////
 * 3D ベクトル
 * /////////////////////////////////////////////////////////
 */

/**
 * 3DCG用 のベクトルクラス (immutable)
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w (遠近除算用のため掛け算以外で使用されません)
 * @returns {S3Vector}
 */
var S3Vector = function(x, y, z, w) {
	this.x = x;
	this.y = y;
	if(z === undefined) {
		this.z = 0.0;
	}
	else {
		this.z = z;
	}
	if(w === undefined) {
		this.w = 1.0;
	}
	else {
		this.w = w;
	}
};
S3Vector.prototype.clone = function() {
	return new S3Vector(this.x, this.y, this.z, this.w);
};
S3Vector.prototype.cross = function(tgt) {
	return new S3Vector(
		this.y * tgt.z - this.z * tgt.y,
		this.z * tgt.x - this.x * tgt.z,
		this.x * tgt.y - this.y * tgt.x,
		1.0
	);
};
S3Vector.prototype.dot = function(tgt) {
	return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
};
S3Vector.prototype.add = function(tgt) {
	return new S3Vector(
		this.x + tgt.x,
		this.y + tgt.y,
		this.z + tgt.z,
		1.0
	);
};
S3Vector.prototype.sub = function(tgt) {
	return new S3Vector(
		this.x - tgt.x,
		this.y - tgt.y,
		this.z - tgt.z,
		1.0
	);
};
S3Vector.prototype.mul = function(tgt) {
	if(tgt instanceof S3Vector) {
		return new S3Vector(
			this.x * tgt.x,
			this.y * tgt.y,
			this.z * tgt.z,
			1.0
		);
	}
	else if(tgt instanceof S3Matrix) {
		// 横ベクトル×行列＝横ベクトル
		var v = this;
		var A = tgt;
		// vA = u なので、各項を行列の列ごとで掛け算する
		return new S3Vector(
			v.x * A.m00 + v.y * A.m10 + v.z * A.m20 + v.w * A.m30,
			v.x * A.m01 + v.y * A.m11 + v.z * A.m21 + v.w * A.m31,
			v.x * A.m02 + v.y * A.m12 + v.z * A.m22 + v.w * A.m32,
			v.x * A.m03 + v.y * A.m13 + v.z * A.m23 + v.w * A.m33
		);
	}
	else if(typeof tgt === "number") {
		return new S3Vector(
			this.x * tgt,
			this.y * tgt,
			this.z * tgt,
			1.0
		);
	}
	else {
		throw "IllegalArgumentException";
	}
};
S3Vector.prototype.setX = function(x) {
		return new S3Vector(x, this.y, this.z, this.w);
};
S3Vector.prototype.setY = function(y) {
		return new S3Vector(this.x, y, this.z, this.w);
};
S3Vector.prototype.setZ = function(z) {
		return new S3Vector(this.x, this.y, z, this.w);
};
S3Vector.prototype.setW = function(w) {
		return new S3Vector(this.x, this.y, this.z, w);
};
S3Vector.prototype.dot = function(tgt) {
	return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
};
S3Vector.prototype.max = function(tgt) {
	return new S3Vector(
		Math.max(this.x, tgt.x),
		Math.max(this.y, tgt.y),
		Math.max(this.z, tgt.z),
		Math.max(this.w, tgt.w)
	);
};
S3Vector.prototype.min = function(tgt) {
	return new S3Vector(
		Math.min(this.x, tgt.x),
		Math.min(this.y, tgt.y),
		Math.min(this.z, tgt.z),
		Math.min(this.w, tgt.w)
	);
};

S3Vector.prototype.equals = function(tgt) {
	return (
		S3Math.equals(this.x, tgt.x) &&
		S3Math.equals(this.y, tgt.y) &&
		S3Math.equals(this.z, tgt.z) &&
		S3Math.equals(this.w, tgt.w)
	);
};
S3Vector.prototype.mix = function(tgt, alpha) {
	return new S3Vector(
		S3Math.mix(this.x, tgt.x, alpha),
		S3Math.mix(this.y, tgt.y, alpha),
		S3Math.mix(this.z, tgt.z, alpha),
		S3Math.mix(this.w, tgt.w, alpha)
	);
};
S3Vector.prototype.norm = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
S3Vector.prototype.normFast = function() {
	return this.x * this.x + this.y * this.y + this.z * this.z;
};
S3Vector.prototype.normalize = function() {
	var b = this.normFast();
	if(b === 0.0) {
		throw "divide error";
	}
	b = Math.sqrt(1.0 / b);
	return new S3Vector(
		this.x * b,
		this.y * b,
		this.z * b,
		1.0
	);
};
S3Vector.prototype.negate = function() {
	return new S3Vector(
		- this.x,
		- this.y,
		- this.z,
		1.0
	);
};
S3Vector.prototype.toString = function(num) {
	if(num === 1) {
		return "[" + this.x + "]T";
	}
	else if(num === 2) {
		return "[" + this.x + "," + this.y + "]T";
	}
	else if(num === 3) {
		return "[" + this.x + "," + this.y + "," + this.z + "]T";
	}
	else {
		return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]T";
	}
};
S3Vector.prototype.toInstanceArray = function(Instance, dimension) {
	if(dimension === 1) {
		return new Instance([this.x]);
	}
	else if(dimension === 2) {
		return new Instance([this.x, this.y]);
	}
	else if(dimension === 3) {
		return new Instance([this.x, this.y, this.z]);
	}
	else {
		return new Instance([this.x, this.y, this.z, this.w]);
	}
};
S3Vector.prototype.pushed = function(array, num) {
	if(num === 1) {
		array.push(this.x);
	}
	else if(num === 2) {
		array.push(this.x);
		array.push(this.y);
	}
	else if(num === 3) {
		array.push(this.x);
		array.push(this.y);
		array.push(this.z);
	}
	else {
		array.push(this.x);
		array.push(this.y);
		array.push(this.z);
		array.push(this.w);
	}
};

/**
 * tgt への方向ベクトルを取得する
 * @param {S3Vector} tgt
 * @returns {S3Vector}
 */
S3Vector.prototype.getDirection = function(tgt) {
	return tgt.sub(this);
};

/**
 * tgt への正規方向ベクトルを取得する
 * @param {S3Vector} tgt
 * @returns {S3Vector}
 */
S3Vector.prototype.getDirectionNormalized = function(tgt) {
	return tgt.sub(this).normalize();
};

/**
 * 指定した位置までの距離を取得する
 * @param {S3Vector} tgt
 * @returns {Number}
 */
S3Vector.prototype.getDistance = function(tgt) {
	return this.getDirection(tgt).norm();
};

/**
 * A, B, C の3点を通る平面の法線OUTを求めます。
 * @param {S3Vector} A
 * @param {S3Vector} B
 * @param {S3Vector} C
 * @returns {S3Vector}
 */
S3Vector.getNormalVector = function(A, B, C) {
	var v1 = A.getDirection(B);
	var v2 = A.getDirection(C);
	var normal = v1.cross(v2);
	try {
		return normal.normalize();
	}
	catch (e) {
		return null;
	}
};

/**
 * A, B, C の3点が時計回りなら true をかえす。
 * 時計回りでも反時計回りでもないと null を返す
 * @param {S3Vector} A
 * @param {S3Vector} B
 * @param {S3Vector} C
 * @returns {Boolean}
 */
S3Vector.isClockwise = function(A, B, C) {
	var v1 = A.getDirection(B).setZ(0);
	var v2 = A.getDirection(C).setZ(0);
	var type = v1.cross(v2).z;
	if(type === 0) {
		return null;
	}
	else if(type > 0) {
		return true;
	}
	else {
		return false;
	}
};

/**
 * /////////////////////////////////////////////////////////
 * 4x4 行列
 * /////////////////////////////////////////////////////////
 */

/**
 * 4x4行列  (immutable)
 * 引数は、MATLAB と同じように行で順番に定義していきます。
 * この理由は、行列を初期化する際に見た目が分かりやすいためです。
 * 9個の引数なら3x3行列、16個の引数なら4x4行列として扱います。
 * @param {Number} m00
 * @param {Number} m01
 * @param {Number} m02
 * @param {Number} m03
 * @param {Number} m10
 * @param {Number} m11
 * @param {Number} m12
 * @param {Number} m13
 * @param {Number} m20
 * @param {Number} m21
 * @param {Number} m22
 * @param {Number} m23
 * @param {Number} m30
 * @param {Number} m31
 * @param {Number} m32
 * @param {Number} m33
 * @returns {S3Matrix}
 */
var S3Matrix = function(
		m00, m01, m02, m03,		// row 1
		m10, m11, m12, m13,		// row 2
		m20, m21, m22, m23,		// row 3
		m30, m31, m32, m33 ) {	// row 4
	if(arguments.length === 0) {
		this.m00 = 0.0;	this.m01 = 0.0;	this.m02 = 0.0;	this.m03 = 0.0;
		this.m10 = 0.0;	this.m11 = 0.0;	this.m12 = 0.0;	this.m13 = 0.0;
		this.m20 = 0.0;	this.m21 = 0.0;	this.m22 = 0.0;	this.m23 = 0.0;
		this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 0.0;
	}
	else if(arguments.length === 9) {
		// 3x3行列
		this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = 0.0;
		this.m10 = m03;	this.m11 = m10;	this.m12 = m11;	this.m13 = 0.0;
		this.m20 = m12;	this.m21 = m13;	this.m22 = m20;	this.m23 = 0.0;
		this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 1.0;
	}
	else if(arguments.length === 16) {
		// 4x4行列
		this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = m03;
		this.m10 = m10;	this.m11 = m11;	this.m12 = m12;	this.m13 = m13;
		this.m20 = m20;	this.m21 = m21;	this.m22 = m22;	this.m23 = m23;
		this.m30 = m30;	this.m31 = m31;	this.m32 = m32;	this.m33 = m33;
	}
	else {
		throw "IllegalArgumentException";
	}
};
S3Matrix.prototype.equals = function(tgt) {
	return (
		S3Math.equals(this.m00, tgt.m00) &&
		S3Math.equals(this.m01, tgt.m01) &&
		S3Math.equals(this.m02, tgt.m02) &&
		S3Math.equals(this.m03, tgt.m03) &&
		S3Math.equals(this.m10, tgt.m10) &&
		S3Math.equals(this.m11, tgt.m11) &&
		S3Math.equals(this.m12, tgt.m12) &&
		S3Math.equals(this.m13, tgt.m13) &&
		S3Math.equals(this.m20, tgt.m20) &&
		S3Math.equals(this.m21, tgt.m21) &&
		S3Math.equals(this.m22, tgt.m22) &&
		S3Math.equals(this.m23, tgt.m23) &&
		S3Math.equals(this.m30, tgt.m30) &&
		S3Math.equals(this.m31, tgt.m31) &&
		S3Math.equals(this.m32, tgt.m32) &&
		S3Math.equals(this.m33, tgt.m33)
	);
};
S3Matrix.prototype.clone = function() {
	return new S3Matrix(
		this.m00, this.m01, this.m02, this.m03,
		this.m10, this.m11, this.m12, this.m13,
		this.m20, this.m21, this.m22, this.m23,
		this.m30, this.m31, this.m32, this.m33
	);
};
S3Matrix.prototype.transposed = function() {
	return new S3Matrix(
		this.m00, this.m10, this.m20, this.m30,
		this.m01, this.m11, this.m21, this.m31,
		this.m02, this.m12, this.m22, this.m32,
		this.m03, this.m13, this.m23, this.m33
	);
};

/**
 * 掛け算します。
 * @param {S3Vector|S3Matrix} tgt 行列、縦ベクトル
 * @returns {S3Vector|S3Matrix}
 */
S3Matrix.prototype.mul = function(tgt) {
	if(tgt instanceof S3Matrix) {
		var A = this; var B = tgt;
		var C = new S3Matrix();
		// 行列クラスのコンストラクタを変更しても問題がないように
		// 後で代入を行っております。
		C.m00 = A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20 + A.m03 * B.m30;
		C.m01 = A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21 + A.m03 * B.m31;
		C.m02 = A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22 + A.m03 * B.m32;
		C.m03 = A.m00 * B.m03 + A.m01 * B.m13 + A.m02 * B.m23 + A.m03 * B.m33;
		C.m10 = A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20 + A.m13 * B.m30;
		C.m11 = A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21 + A.m13 * B.m31;
		C.m12 = A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22 + A.m13 * B.m32;
		C.m13 = A.m10 * B.m03 + A.m11 * B.m13 + A.m12 * B.m23 + A.m13 * B.m33;
		C.m20 = A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20 + A.m23 * B.m30;
		C.m21 = A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21 + A.m23 * B.m31;
		C.m22 = A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22 + A.m23 * B.m32;
		C.m23 = A.m20 * B.m03 + A.m21 * B.m13 + A.m22 * B.m23 + A.m23 * B.m33;
		C.m30 = A.m30 * B.m00 + A.m31 * B.m10 + A.m32 * B.m20 + A.m33 * B.m30;
		C.m31 = A.m30 * B.m01 + A.m31 * B.m11 + A.m32 * B.m21 + A.m33 * B.m31;
		C.m32 = A.m30 * B.m02 + A.m31 * B.m12 + A.m32 * B.m22 + A.m33 * B.m32;
		C.m33 = A.m30 * B.m03 + A.m31 * B.m13 + A.m32 * B.m23 + A.m33 * B.m33;
		return C;
	}
	else if(tgt instanceof S3Vector) {
		var A = this;
		var v = tgt;
		// 行列×縦ベクトル＝縦ベクトル
		// Av = u なので、各項を行列の行ごとで掛け算する
		return new S3Vector(
			A.m00 * v.x + A.m01 * v.y + A.m02 * v.z + A.m03 * v.w,
			A.m10 * v.x + A.m11 * v.y + A.m12 * v.z + A.m13 * v.w,
			A.m20 * v.x + A.m21 * v.y + A.m22 * v.z + A.m23 * v.w,
			A.m30 * v.x + A.m31 * v.y + A.m32 * v.z + A.m33 * v.w
		);
	}
	else {
		throw "IllegalArgumentException";
	}
};
S3Matrix.prototype.det3 = function() {
	var A = this;
	var out;
	out  = A.m00 * A.m11 * A.m22;
	out += A.m10 * A.m21 * A.m02;
	out += A.m20 * A.m01 * A.m12;
	out -= A.m00 * A.m21 * A.m12;
	out -= A.m20 * A.m11 * A.m02;
	out -= A.m10 * A.m01 * A.m22;
	return out;
};
S3Matrix.prototype.inverse3 = function() {
	var A = this;
	var det = A.det3();
	if(det === 0.0) {
		return( null );
	}
	var id = 1.0 / det;
	var B = A.clone();
	B.m00 = (A.m11 * A.m22 - A.m12 * A.m21) * id;
	B.m01 = (A.m02 * A.m21 - A.m01 * A.m22) * id;
	B.m02 = (A.m01 * A.m12 - A.m02 * A.m11) * id;
	B.m10 = (A.m12 * A.m20 - A.m10 * A.m22) * id;
	B.m11 = (A.m00 * A.m22 - A.m02 * A.m20) * id;
	B.m12 = (A.m02 * A.m10 - A.m00 * A.m12) * id;
	B.m20 = (A.m10 * A.m21 - A.m11 * A.m20) * id;
	B.m21 = (A.m01 * A.m20 - A.m00 * A.m21) * id;
	B.m22 = (A.m00 * A.m11 - A.m01 * A.m10) * id;
	return B;
};
S3Matrix.prototype.det4 = function() {
	var A = this;
	var out;
	out  = A.m00 * A.m11 * A.m22 * A.m33;
	out += A.m00 * A.m12 * A.m23 * A.m31;
	out += A.m00 * A.m13 * A.m21 * A.m32;
	out += A.m01 * A.m10 * A.m23 * A.m32;
	out += A.m01 * A.m12 * A.m20 * A.m33;
	out += A.m01 * A.m13 * A.m22 * A.m30;
	out += A.m02 * A.m10 * A.m21 * A.m33;
	out += A.m02 * A.m11 * A.m23 * A.m30;
	out += A.m02 * A.m13 * A.m20 * A.m31;
	out += A.m03 * A.m10 * A.m22 * A.m31;
	out += A.m03 * A.m11 * A.m20 * A.m32;
	out += A.m03 * A.m12 * A.m21 * A.m30;
	out -= A.m00 * A.m11 * A.m23 * A.m32;
	out -= A.m00 * A.m12 * A.m21 * A.m33;
	out -= A.m00 * A.m13 * A.m22 * A.m31;
	out -= A.m01 * A.m10 * A.m22 * A.m33;
	out -= A.m01 * A.m12 * A.m23 * A.m30;
	out -= A.m01 * A.m13 * A.m20 * A.m32;
	out -= A.m02 * A.m10 * A.m23 * A.m31;
	out -= A.m02 * A.m11 * A.m20 * A.m33;
	out -= A.m02 * A.m13 * A.m21 * A.m30;
	out -= A.m03 * A.m10 * A.m21 * A.m32;
	out -= A.m03 * A.m11 * A.m22 * A.m30;
	out -= A.m03 * A.m12 * A.m20 * A.m31;
	return out;
};
S3Matrix.prototype.inverse4 = function() {
	var A = this;
	var det = A.det4();
	if(det === 0.0) {
		return( null );
	}
	var id = 1.0 / det;
	var B = new S3Matrix();
	B.m00 = (A.m11*A.m22*A.m33 + A.m12*A.m23*A.m31 + A.m13*A.m21*A.m32 - A.m11*A.m23*A.m32 - A.m12*A.m21*A.m33 - A.m13*A.m22*A.m31) * id;
	B.m01 = (A.m01*A.m23*A.m32 + A.m02*A.m21*A.m33 + A.m03*A.m22*A.m31 - A.m01*A.m22*A.m33 - A.m02*A.m23*A.m31 - A.m03*A.m21*A.m32) * id;
	B.m02 = (A.m01*A.m12*A.m33 + A.m02*A.m13*A.m31 + A.m03*A.m11*A.m32 - A.m01*A.m13*A.m32 - A.m02*A.m11*A.m33 - A.m03*A.m12*A.m31) * id;
	B.m03 = (A.m01*A.m13*A.m22 + A.m02*A.m11*A.m23 + A.m03*A.m12*A.m21 - A.m01*A.m12*A.m23 - A.m02*A.m13*A.m21 - A.m03*A.m11*A.m22) * id;
	B.m10 = (A.m10*A.m23*A.m32 + A.m12*A.m20*A.m33 + A.m13*A.m22*A.m30 - A.m10*A.m22*A.m33 - A.m12*A.m23*A.m30 - A.m13*A.m20*A.m32) * id;
	B.m11 = (A.m00*A.m22*A.m33 + A.m02*A.m23*A.m30 + A.m03*A.m20*A.m32 - A.m00*A.m23*A.m32 - A.m02*A.m20*A.m33 - A.m03*A.m22*A.m30) * id;
	B.m12 = (A.m00*A.m13*A.m32 + A.m02*A.m10*A.m33 + A.m03*A.m12*A.m30 - A.m00*A.m12*A.m33 - A.m02*A.m13*A.m30 - A.m03*A.m10*A.m32) * id;
	B.m13 = (A.m00*A.m12*A.m23 + A.m02*A.m13*A.m20 + A.m03*A.m10*A.m22 - A.m00*A.m13*A.m22 - A.m02*A.m10*A.m23 - A.m03*A.m12*A.m20) * id;
	B.m20 = (A.m10*A.m21*A.m33 + A.m11*A.m23*A.m30 + A.m13*A.m20*A.m31 - A.m10*A.m23*A.m31 - A.m11*A.m20*A.m33 - A.m13*A.m21*A.m30) * id;
	B.m21 = (A.m00*A.m23*A.m31 + A.m01*A.m20*A.m33 + A.m03*A.m21*A.m30 - A.m00*A.m21*A.m33 - A.m01*A.m23*A.m30 - A.m03*A.m20*A.m31) * id;
	B.m22 = (A.m00*A.m11*A.m33 + A.m01*A.m13*A.m30 + A.m03*A.m10*A.m31 - A.m00*A.m13*A.m31 - A.m01*A.m10*A.m33 - A.m03*A.m11*A.m30) * id;
	B.m23 = (A.m00*A.m13*A.m21 + A.m01*A.m10*A.m23 + A.m03*A.m11*A.m20 - A.m00*A.m11*A.m23 - A.m01*A.m13*A.m20 - A.m03*A.m10*A.m21) * id;
	B.m30 = (A.m10*A.m22*A.m31 + A.m11*A.m20*A.m32 + A.m12*A.m21*A.m30 - A.m10*A.m21*A.m32 - A.m11*A.m22*A.m30 - A.m12*A.m20*A.m31) * id;
	B.m31 = (A.m00*A.m21*A.m32 + A.m01*A.m22*A.m30 + A.m02*A.m20*A.m31 - A.m00*A.m22*A.m31 - A.m01*A.m20*A.m32 - A.m02*A.m21*A.m30) * id;
	B.m32 = (A.m00*A.m12*A.m31 + A.m01*A.m10*A.m32 + A.m02*A.m11*A.m30 - A.m00*A.m11*A.m32 - A.m01*A.m12*A.m30 - A.m02*A.m10*A.m31) * id;
	B.m33 = (A.m00*A.m11*A.m22 + A.m01*A.m12*A.m20 + A.m02*A.m10*A.m21 - A.m00*A.m12*A.m21 - A.m01*A.m10*A.m22 - A.m02*A.m11*A.m20) * id;
	return B;
};
S3Matrix.prototype.toString = function() {
	return "[" +
		 "[" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "]\n" + 
		" [" + this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "]\n" + 
		" [" + this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "]\n" + 
		" [" + this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "]]";
};
S3Matrix.prototype.toInstanceArray = function(Instance, dimension) {
	if(dimension === 1) {
		return new Instance([this.m00]);
	}
	else if(dimension === 2) {
		return new Instance(
			[this.m00, this.m10,
			 this.m01, this.m11]);
	}
	else if(dimension === 3) {
		return new Instance(
			[this.m00, this.m10, this.m20,
			 this.m01, this.m11, this.m21,
			 this.m02, this.m12, this.m22]);
	}
	else {
		return new Instance(
			[this.m00, this.m10, this.m20, this.m30,
			 this.m01, this.m11, this.m21, this.m31,
			 this.m02, this.m12, this.m22, this.m32,
			 this.m03, this.m13, this.m23, this.m33]);
	}
};

/**
 * オイラー角 (immutable)
 * @param {Number} z ロール
 * @param {Number} x ピッチ
 * @param {Number} y ヨー
 * @returns {S3Angle}
 */
var S3Angles = function(z, x, y) {
	this.setRotateZXY(z, x, y);
};
S3Angles.PI		= 180.0;
S3Angles.PIOVER2= S3Angles.PI / 2.0;
S3Angles.PILOCK	= S3Angles.PIOVER2 - 0.0001;
S3Angles.PI2	= 2.0 * S3Angles.PI;
S3Angles._toPeriodicAngle = function(x) {
	if(x > S3Angles.PI) {
		return x - S3Angles.PI2 * parseInt(( x + S3Angles.PI) / S3Angles.PI2);
	}
	else if(x < -S3Angles.PI) {
		return x + S3Angles.PI2 * parseInt((-x + S3Angles.PI) / S3Angles.PI2);
	}
	return x;
};
S3Angles.prototype.clone = function() {
	var angles = new S3Angles();
	angles.roll		= this.roll;
	angles.pitch	= this.pitch;
	angles.yaw		= this.yaw;
	return angles;
};
S3Angles.prototype.setRotateZXY = function(z, x, y) {
	this.roll	= S3Angles._toPeriodicAngle(isNaN(z) ? 0.0 : z);
	this.pitch	= S3Angles._toPeriodicAngle(isNaN(x) ? 0.0 : x);
	this.yaw	= S3Angles._toPeriodicAngle(isNaN(y) ? 0.0 : y);
};
S3Angles.prototype.addRotateX = function(x) {
	return new S3Angles(this.roll, this.pitch + x, this.yaw);
};
S3Angles.prototype.addRotateY = function(y) {
	return new S3Angles(this.roll, this.pitch, this.yaw + y);
};
S3Angles.prototype.addRotateZ = function(z) {
	return new S3Angles(this.roll + z, this.pitch, this.yaw);
};
S3Angles.prototype.setRotateX = function(x) {
	return new S3Angles(this.roll, x, this.yaw);
};
S3Angles.prototype.setRotateY = function(y) {
	return new S3Angles(this.roll, this.pitch, y);
};
S3Angles.prototype.setRotateZ = function(z) {
	return new S3Angles(z, this.pitch, this.yaw);
};
S3Angles.prototype.toString = function() {
	return "angles[" + this.roll + "," + this.pitch + "," + this.yaw + "]";
};



