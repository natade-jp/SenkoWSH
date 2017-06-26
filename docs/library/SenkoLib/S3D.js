"use strict";

﻿/**
 * SenkoLib S3D.js
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
	this.z = z;
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
S3Vector.prototype.perspective = function() {
	if(this.w === 0.0) {
		throw "divide error";
	}
	return new S3Vector(
		this.x / this.w,
		this.y / this.w,
		this.z / this.w,
		1.0
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
S3Vector.prototype.normalize = function() {
	var b = this.x * this.x + this.y * this.y + this.z * this.z;
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
S3Vector.prototype.toString = function() {
	return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]T";
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
	return B.sub(A).cross(C.sub(A)).normalize();
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
	else if(arguments.length === 16) {
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
S3Matrix.prototype.det = function() {
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
S3Matrix.prototype.inverse = function() {
	var A = this;
	var det = A.det();
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

var S3SystemMode = {
	OPEN_GL	: 0,
	DIRECT_X	: 1
};

var S3DepthMode = {
	/**
	 * Z値の範囲などの依存関係をOpenGL準拠
	 * @type Number
	 */
	OPEN_GL	: 0,
	/**
	 * Z値の範囲などの依存関係をDirecX準拠
	 * @type Number
	 */
	DIRECT_X	: 1
};

var S3DimensionMode = {
	/**
	 * 右手系
	 * @type Number
	 */
	RIGHT_HAND	: 0,
	/**
	 * 左手系
	 * @type Number
	 */
	LEFT_HAND	: 1
};

var S3VectorMode = {
	/**
	 * 値を保持するベクトルを縦ベクトルとみなす
	 * @type Number
	 */
	VECTOR4x1	: 0,
	/**
	 * 値を保持するベクトルを横ベクトルとみなす
	 * @type Number
	 */
	VECTOR1x4	: 1
};

var S3System = function() {
	this.setSystemMode(S3SystemMode.OPEN_GL);
};

S3System.prototype.setSystemMode = function(mode) {
	this.systemmode = mode;
	if(this.systemmode === S3SystemMode.OPEN_GL) {
		this.depthmode		= S3DepthMode.OPEN_GL;
		this.dimensionmode	= S3DimensionMode.RIGHT_HAND;
		this.vectormode		= S3VectorMode.VECTOR4x1;
	}
	else {
		this.depthmode		= S3DepthMode.DIRECT_X;
		this.dimensionmode	= S3DimensionMode.LEFT_HAND;
		this.vectormode		= S3VectorMode.VECTOR1x4;
	}
};

S3System.prototype.setCanvas = function(canvas) {
	this.canvas = canvas;
};

/**
 * ビューポート行列を作成する
 * @param {Number} x 描写する左上の座標X
 * @param {Number} y 描写する左上の座標Y
 * @param {Number} Width 描写幅
 * @param {Number} Height 描写幅
 * @param {Number} MinZ 深度値の変換
 * @param {Number} MaxZ 深度値の変換
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixViewport = function(x, y, Width, Height, MinZ, MaxZ) {
	if(MinZ === undefined) {
		MinZ = 0.0;
	}
	if(MaxZ === undefined) {
		MaxZ = 1.0;
	}
	
	var M = new S3Matrix();
	M.m00 =  Width/2; M.m01 =       0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =      0.0; M.m11 =  Height/2; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =      0.0; M.m21 =       0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =x+Width/2; M.m31 =y+Height/2; M.m32 = 0.0; M.m33 = 1.0;
	
	if(this.depthmode === S3DepthMode.DIRECT_X) {
		M.m22 = MinZ - MaxZ;
		M.m32 = MinZ;
	}
	else if(this.depthmode === S3DepthMode.OPEN_GL) {
		M.m22 = (MinZ - MaxZ) / 2;
		M.m32 = (MinZ + MaxZ) / 2;
	}
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 視体積の上下方向の視野角を求める
 * @param {Number} zoomY
 * @returns {Number}
 */
S3System.calcFovY = function(zoomY) {
	return(2.0 * Math.atan(1.0 / zoomY));
};

/**
 * アスペクト比を求める
 * @param {Number} width
 * @param {Number} height
 * @returns {Number}
 */
S3System.calcAspect = function(width, height) {
	return(width / height);
};

/**
 * パースペクティブ射影行列を作成する
 * @param {Number} fovY 視体積の上下方向の視野角（0度から180度）
 * @param {Number} Aspect 近平面、遠平面のアスペクト比（Width / Height）
 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixPerspectiveFov = function(fovY, Aspect, Far, Near) {
	var arc = S3Math.radius(fovY);
	var zoomY = 1.0 / Math.tan(arc / 2.0);
	var zoomX = zoomY / Aspect;
	var M = new S3Matrix();
	M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 1.0;
	var Delta = Far - Near;
	if(Delta === 0.0) {
		throw "divide error";
	}
	if(this.depthmode === S3DepthMode.DIRECT_X) {
		M.m22 = Far / Delta;
		M.m32 = - Far * Near / Delta;
	}
	else if(this.depthmode === S3DepthMode.OPEN_GL) {
		M.m22 = (Far + Near) / Delta;
		M.m32 = - 2.0 * Far * Near / Delta;
	}
	if(this.dimensionmode === S3DimensionMode.RIGHT_HAND) {
		M.m22 = - M.m22;
		M.m23 = - M.m23;
	}
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * ビュートランスフォーム行列を作成する
 * @param {S3Vector} eye カメラの座標の位置ベクトル
 * @param {S3Vector} at カメラの注視点の位置ベクトル
 * @param {S3Vector} up カメラの上への方向ベクトル
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixLookAt = function(eye, at, up) {
	var X, Y, Z;
	if(up === undefined) {
		up = new S3Vector(0.0, 1.0, 0.0);
	}
	// Z ベクトルの作成
	Z = eye.getDirectionNormalized(at);
	if(this.dimensionmode === S3DimensionMode.RIGHT_HAND) {
		// 右手系なら反転
		Z = Z.negate();
	}
	// X, Y ベクトルの作成
	X = up.cross(Z).normalize();
	Y = Z.cross(X);
	var M = new S3Matrix();
	M.m00 = X.x; M.m01 = Y.x; M.m02 = Z.x; M.m03 = 0.0;
	M.m10 = X.y; M.m11 = Y.y; M.m12 = Z.y; M.m13 = 0.0;
	M.m20 = X.z; M.m21 = Y.z; M.m22 = Z.z; M.m23 = 0.0;
	M.m30 = -X.dot(eye); M.m31 = -Y.dot(eye); M.m32 = -Z.dot(eye); M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 単位行列を作成します。
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixIdentity = function() {
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return M;
};

/**
 * 平行移動行列を作成します。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixTranslate = function(x, y, z) {
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 =   x; M.m31 =   y; M.m32 =   z; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 拡大縮小行列を作成します。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixScale = function(x, y, z) {
	var M = new S3Matrix();
	M.m00 =   x; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 =   y; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 =   z; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * X軸周りの回転行列を作成します。
 * @param {Number} degree 角度を度数法で指定
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateX = function(degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * Y軸周りの回転行列を作成します。
 * @param {Number} degree 角度を度数法で指定
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateY = function(degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * Z軸周りの回転行列を作成します。
 * @param {Number} degree 角度を度数法で指定
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateZ = function(degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 縦型、横型を踏まえて掛け算します。
 * @param {S3Matrix} A
 * @param {S3Matrix|S3Vector} B
 * @returns {S3Matrix|S3Vector}
 */
S3System.prototype.mulMatrix = function(A, B) {
	if(B instanceof S3Matrix) {
		// 横型の場合は、v[AB]=u
		// 縦型の場合は、[BA]v=u
		return (this.vectormode === S3VectorMode.VECTOR4x1) ? B.mul(A) : A.mul(B);
	}
	else if(B instanceof S3Vector) {
		// 横型の場合は、[vA]=u
		// 縦型の場合は、[Av]=u
		return (this.vectormode === S3VectorMode.VECTOR4x1) ? A.mul(B) : B.mul(A);
	}
	else {
		throw "IllegalArgumentException";
	}
};

/**
 * 航空機の姿勢制御（ロール・ピッチ・ヨー）の順序で回転
 * @param {Number} z
 * @param {Number} x
 * @param {Number} y
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateZXY = function(z, x, y) {
	var Z = this.getMatrixRotateZ(z);
	var X = this.getMatrixRotateX(x);
	var Y = this.getMatrixRotateY(y);
	return this.mulMatrix(this.mulMatrix(Z, X), Y);
};

/**
 * 頂点 (immutable)
 * @param {S3Vector} position
 * @returns {S3Vertex}
 */
var S3Vertex = function(position) {
	this.position	= position.clone();
};
S3Vertex.prototype.clone = function() {
	return new S3Vertex(this.position);
};

/**
 * 3角ポリゴンのインデックス (immutable)
 * @param {Number} i1
 * @param {Number} i2
 * @param {Number} i3
 * @returns {S3Index}
 */
var S3TriangleIndex = function(i1, i2, i3) {
	this.i1	= i1;
	this.i2	= i2;
	this.i3	= i3;
};
S3TriangleIndex.prototype.clone = function() {
	return new S3TriangleIndex(this.i1, this.i2, this.i3);
};

/**
 * 立体物 (mutable)
 * @param {Array} vertex
 * @param {Array} index
 * @returns {S3Mesh}
 */
var S3Mesh = function(vertex, index) {
	this.vertex		= [];
	this.index		= [];
	if(arguments.length !== 0) {
		this.addVertex(vertex);
		this.addIndex(index);
	}
};
S3Mesh.prototype.clone = function() {
	return new S3Mesh(this.vertex, this.index);
};
S3Mesh.prototype.addVertex = function(vertex) {
	if(vertex instanceof S3Vertex) {
		this.vertex[this.vertex.length] = vertex.clone();
	}
	else {
		var i = 0;
		for(i = 0; i < vertex.length; i++) {
			this.vertex[this.vertex.length] = vertex[i].clone();
		}
	}
};
S3Mesh.prototype.addTriangleIndex = function(index) {
	if(index instanceof S3TriangleIndex) {
		this.index[this.index.length] = index.clone();
	}
	else {
		var i = 0;
		for(i = 0; i < index.length; i++) {
			this.index[this.index.length] = index[i].clone();
		}
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
	this.roll	= (z === undefined) ? 0.0 : z;
	this.pitch	= (x === undefined) ? 0.0 : x;
	this.yaw	= (y === undefined) ? 0.0 : y;
	this._normalize();
};
S3Angles.PI		= 180.0;
S3Angles.PIOVER2= S3Angles.PI / 2.0;
S3Angles.PILOCK	= S3Angles.PIOVER2 - 0.0001;
S3Angles.PI2	= 2.0 * S3Angles.PI;
S3Angles.toPeriodicAngle = function(x) {
	if(x>0) {
		return x - S3Angles.PI2 * parseInt(( x + S3Angles.PI) / S3Angles.PI2);
	}
	else {
		return x + S3Angles.PI2 * parseInt((-x + S3Angles.PI) / S3Angles.PI2);
	}
};
S3Angles.prototype.addX = function(x) {
	return new S3Angles(this.roll, this.pitch + x, this.yaw);
};
S3Angles.prototype.addY = function(y) {
	return new S3Angles(this.roll, this.pitch, this.yaw + y);
};
S3Angles.prototype.addZ = function(z) {
	return new S3Angles(this.roll + z, this.pitch, this.yaw);
};
S3Angles.prototype.setX = function(x) {
	return new S3Angles(this.roll, x, this.yaw);
};
S3Angles.prototype.setY = function(y) {
	return new S3Angles(this.roll, this.pitch, y);
};
S3Angles.prototype.setZ = function(z) {
	return new S3Angles(z, this.pitch, this.yaw);
};
S3Angles.prototype.toString = function() {
	return "angles[" + this.roll + "," + this.pitch + "," + this.yaw + "]";
};
/**
 * 正準オイラー角に正規化
 * @returns {S3Angles}
 */
S3Angles.prototype._normalize = function() {
	//X軸ピッチを-180度から180度にする
	this.pitch = S3Angles.toPeriodicAngle(this.pitch);
	//X軸ピッチが-90度から90度の中に含まれていない場合。
	if(this.pitch < - S3Angles.PIOVER2) {
		this.pitch = - S3Angles.PI - this.pitch;
		this.yaw  += S3Angles.PI;
		this.roll += S3Angles.PI;
	}
	else if(this.pitch > S3Angles.PIOVER2) {
		this.pitch = S3Angles.PI - this.pitch;
		this.yaw  += S3Angles.PI;
		this.roll += S3Angles.PI;
	}
	//ジンバルロックをチェック 90度付近
	if(Math.abs(this.pitch) > S3Angles.PILOCK) {
		this.yaw  += this.roll;
		this.roll = 0;
	}
	else {
		this.roll = S3Angles.toPeriodicAngle(this.roll);
	}
	this.yaw = S3Angles.toPeriodicAngle(this.yaw);
};

/**
 * 色々な情報をいれたモデル (mutable)
 * @returns {S3Model}
 */
var S3Model = function() {
	this.angles		= new S3Angles();
	this.scale		= new S3Vector(1, 1, 1);
	this.position	= new S3Vector(0, 0, 0);
	this.mesh		= new S3Mesh();
};

/**
 * カメラ (mutable)
 * @returns {S3Camera}
 */
var S3Camera = function() {
	this.init();
};
S3Camera.prototype.init = function() {
	this.fovY		= 45;
	this.eye		= new S3Vector(0, 0, 0);
	this.center		= new S3Vector(0, 0, 1);
	this.dimensionmode = S3DimensionMode.RIGHT_HAND;
};
S3Camera.prototype.clone = function() {
	var camera = new S3Camera();
	camera.fovY		= this.fovY;
	camera.eye		= this.eye;
	camera.center	= this.center;
	camera.dimensionmode	= this.dimensionmode;
	return camera;
};
S3Camera.prototype.setFovY = function(fovY) {
	this.fovY = fovY;
};
S3Camera.prototype.setEye = function(eye) {
	this.eye = eye.clone();
};
S3Camera.prototype.setCenter = function(center) {
	this.center = center.clone();
};
S3Camera.prototype.getDistance = function() {
	return this.center.getDistance(this.eye);
};
S3Camera.prototype.setDistance = function(distance) {
	var direction = this.center.getDirectionNormalized(this.eye);
	this.eye = this.center.add(direction.mul(distance));
};
S3Camera.prototype.getRotateY = function() {
	var ray = this.center.getDirection(this.eye);
	return S3Math.degrees(Math.atan2(ray.x, ray.z));
};
S3Camera.prototype.setRotateY = function(deg) {
	var rad = S3Math.radius(deg);
	var ray = this.center.getDirection(this.eye);
	var length = Math.sqrt(ray.x * ray.x + ray.z * ray.z);
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	var x2 = - length * sin;
	var z2 = + length * cos;
	this.eye = new S3Vector(
		this.center.x - x2,
		this.center.y,
		this.center.z + z2,
	);
};
S3Camera.prototype.addRotateY = function(deg) {
	this.setRotateY(this.getRotateY() + deg);
};
S3Camera.prototype.getRotateX = function() {
	var ray = this.center.getDirection(this.eye);
	return S3Math.degrees(Math.atan2( ray.y, ray.z ));
};
S3Camera.prototype.setRotateX = function(deg) {
	var rad = S3Math.radius(deg);
	var ray = this.center.getDirection(this.eye);
	var length = Math.sqrt(ray.y * ray.y + ray.z * ray.z);
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	var y2 = - length * sin;
	var z2 = + length * cos;
	this.eye = new S3Vector(
		this.center.x,
		this.center.y - y2,
		this.center.z + z2,
	);
};
S3Camera.prototype.addRotateX = function(deg) {
	this.setRotateX(this.getRotateX() + deg);
};
S3Camera.prototype.translateAbsolute = function(v) {
	this.eye	= this.eye.add(v);
	this.center	= this.center.add(v);
};
S3Camera.prototype.translateRelative = function(v) {
	var up = new S3Vector(0.0, 1.0, 0.0);
	// Z ベクトルの作成
	Z = this.eye.getDirectionNormalized(this.center);
	if(this.dimensionmode === S3DimensionMode.RIGHT_HAND) {
		// 右手系なら反転
		Z = Z.negate();
	}
	// X, Y ベクトルの作成
	X = up.cross(Z).normalize();
	Y = Z.cross(X);
	// 移動
	X = X.mul(v.x);
	Y = Y.mul(v.y);
	Z = Z.mul(v.z);
	this.translateAbsolute(X.add(Y).add(Z));
};

/**
 * 描写するときのシーン (mutable)
 * @returns {S3Scene}
 */
var S3Scene = function() {
	this.camera		= new S3Camera();
	this.model		= [];
};
S3Scene.prototype.clearModel = function() {
	this.model		= [];
};
S3Scene.prototype.setCamera = function(camera) {
	this.camera = camera.clone();
};
S3Scene.prototype.addModel = function(model) {
	this.model[this.model.length] = model;
};

S3System.prototype.getMatrixWorldTransform = function(model) {
	// 回転行列
	var R = this.getMatrixRotateZXY(model.angles.roll, model.angles.pitch, model.angles.yaw);
	// スケーリング
	var S = this.getMatrixScale(model.scale.x, model.scale.y, model.scale.z);
	// 移動行列
	var T = this.getMatrixTranslate(model.position.x, model.position.y, model.position.z);
	// ワールド変換行列を作成する
	var W = this.mulMatrix(this.mulMatrix(S, R), T);
	return W;
};

S3System.prototype.drawScene = function(scene) {
	var i = 0;
	// ビューイング変換行列を作成する
	var L = this.getMatrixLookAt(scene.camera.eye, scene.camera.center);
	// 射影トランスフォーム行列
	var aspect = S3System.calcAspect(this.canvas.width, this.canvas.height);
	var P = this.getMatrixPerspectiveFov(scene.camera.fovY, aspect, 0, 1000 );
	// ビューポート行列
	var V = this.getMatrixViewport(0, 0, this.canvas.width, this.canvas.height);
	
	var context = this.canvas.getContext("2d");
	context.strokeStyle = "rgb(0,0,0)";
	context.lineWidth = 1.0;
	
	for(i = 0; i < scene.model.length; i++) {
		var m = scene.model[i];
		var W = this.getMatrixWorldTransform(m);
		var M = this.mulMatrix(this.mulMatrix(W, L), P);
		var newvertex = [];
		for(i = 0; i < m.mesh.vertex.length; i++) {
			var p = m.mesh.vertex[i].position;
			p = this.mulMatrix(M, p);
			p = p.perspective();
			p = this.mulMatrix(V, p);
			newvertex[newvertex.length] = p;
		}
		for(i = 0; i < m.mesh.index.length; i++) {
			var index = m.mesh.index[i];
			context.beginPath();
			context.moveTo( newvertex[index.i1].x , newvertex[index.i1].y );
			context.lineTo( newvertex[index.i2].x , newvertex[index.i2].y );
			context.lineTo( newvertex[index.i3].x , newvertex[index.i3].y );
			context.closePath();
			context.stroke();
		}
	}
};