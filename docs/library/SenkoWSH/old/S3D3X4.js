"use strict";

﻿/**
 * SenkoWSH S3D.js
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



/**
 * /////////////////////////////////////////////////////////
 * 3D ベクトル
 * /////////////////////////////////////////////////////////
 */

/**
 * 3DCG用 のベクトルクラス
 * @param {type} x
 * @param {type} y
 * @param {type} z
 * @returns {S3Vector}
 */
var S3Vector = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};
S3Vector.prototype.clone = function() {
	return new S3Vector(this.x, this.y, this.z);
};
S3Vector.prototype.cross = function(tgt) {
	return new S3Vector(
		this.y * tgt.z - this.z * tgt.y,
		this.z * tgt.x - this.x * tgt.z,
		this.x * tgt.y - this.y * tgt.x
	);
};
S3Vector.prototype.dot = function(tgt) {
	return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
};
S3Vector.prototype.add = function(tgt) {
	return new S3Vector(
		this.x + tgt.x,
		this.y + tgt.y,
		this.z + tgt.z
	);
};
S3Vector.prototype.sub = function(tgt) {
	return new S3Vector(
		this.x - tgt.x,
		this.y - tgt.y,
		this.z - tgt.z
	);
};
S3Vector.prototype.mul = function(tgt) {
	if(tgt instanceof S3Vector) {
		return new S3Vector(
			this.x * tgt.x,
			this.y * tgt.y,
			this.z * tgt.z
		);
	}
	else if(tgt instanceof S3Matrix) {
		return new S3Vector(
			this.x * tgt.m00 + this.y * tgt.m10 + this.z * tgt.m20 + tgt.mtx,
			this.x * tgt.m01 + this.y * tgt.m11 + this.z * tgt.m21 + tgt.mty,
			this.x * tgt.m02 + this.y * tgt.m12 + this.z * tgt.m22 + tgt.mtz
		);
	}
	else {
		return new S3Vector(
			this.x * tgt,
			this.y * tgt,
			this.z * tgt
		);
	}
};
S3Vector.prototype.norm = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
S3Vector.prototype.normalize = function() {
	var b = this.x * this.x + this.y * this.y + this.z * this.z;
	b = Math.sqrt(1.0 / b);
	return new S3Vector(
		this.x * b,
		this.y * b,
		this.z * b
	);
};
S3Vector.prototype.toString = function() {
	return "(" + this.x + "," + this.y + "," + this.z + ")";
};

/**
 * 逆ベクトルを取得する
 * @returns {S3Vector}
 */
S3Vector.prototype.getInverse = function() {
	return new S3Vector(
		- this.x,
		- this.y,
		- this.z
	);
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
 * @returns {double}
 */
S3Vector.prototype.getDistance = function(tgt) {
	return this.getDirection(tgt).norm();
};

/**
 * 右回り(時計回り)でA,B,Cの3点を通る平面の法線OUTを求めます。
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
 * 3x4 行列
 * /////////////////////////////////////////////////////////
 */

/**
 * 3x4行列（ 回転などの直交行列に、移動行列を入れたハイブリッド行列 ）
 * @param {type} m00
 * @param {type} m01
 * @param {type} m02
 * @param {type} m10
 * @param {type} m11
 * @param {type} m12
 * @param {type} m20
 * @param {type} m21
 * @param {type} m22
 * @param {type} mtx
 * @param {type} mty
 * @param {type} mtz
 * @returns {S3Matrix}
 */
var S3Matrix = function(
		m00, m01, m02,
		m10, m11, m12,
		m20, m21, m22,
		mtx, mty, mtz ) {
	if(arguments.length === 0) {
		this.m00 = 0.0;	this.m01 = 0.0;	this.m02 = 0.0;
		this.m10 = 0.0;	this.m11 = 0.0;	this.m12 = 0.0;
		this.m20 = 0.0;	this.m21 = 0.0;	this.m22 = 0.0;
		this.mtx = 0.0;	this.mty = 0.0;	this.mtz = 0.0;
	}
	else if(arguments.length === 9) {
		this.m00 = m00;	this.m01 = m01;	this.m02 = m02;
		this.m10 = m10;	this.m11 = m11;	this.m12 = m12;
		this.m20 = m20;	this.m21 = m21;	this.m22 = m22;
		this.mtx = 0.0;	this.mty = 0.0;	this.mtz = 0.0;
	}
	else if(arguments.length === 12) {
		this.m00 = m00;	this.m01 = m01;	this.m02 = m02;
		this.m10 = m10;	this.m11 = m11;	this.m12 = m12;
		this.m20 = m20;	this.m21 = m21;	this.m22 = m22;
		this.mtx = mtx;	this.mty = mty;	this.mtz = mtz;
	}
};

S3Vector.prototype.clone = function() {
	return new S3Matrix(
		this.m00, this.m01, this.m02,
		this.m10, this.m11, this.m12,
		this.m20, this.m21, this.m22,
		this.mtx, this.mty, this.mtz
	);
};
S3Matrix.prototype.transposed = function() {
	return new S3Matrix(
		this.m00, this.m10, this.m20,
		this.m01, this.m11, this.m21,
		this.m02, this.m12, this.m22,
		this.mtx, this.mty, this.mtz
	);
};
S3Matrix.prototype.mul = function(tgt) {
	if(tgt instanceof S3Matrix) {
		var A = this; var B = tgt;
		return new S3Matrix(
			A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20,
			A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21,
			A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22,
			A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20,
			A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21,
			A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22,
			A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20,
			A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21,
			A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22,
			A.mtx * B.m00 + A.mty * B.m10 + A.mtz * B.m20 + B.mtx,
			A.mtx * B.m01 + A.mty * B.m11 + A.mtz * B.m21 + B.mty,
			A.mtx * B.m02 + A.mty * B.m12 + A.mtz * B.m22 + B.mtz
		);
	}
	else if(typeof tgt === "number") {
		return new S3Matrix(
			this.m00 * tgt, this.m01 * tgt, this.m02 * tgt,
			this.m10 * tgt, this.m11 * tgt, this.m12 * tgt,
			this.m20 * tgt, this.m21 * tgt, this.m22 * tgt,
			this.mtx * tgt, this.mty * tgt, this.mtz * tgt
		);
	}
};
S3Matrix.prototype.det = function() {
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
S3Matrix.prototype.inverse = function() {
	var A = this;
	var det = A.det();
	if(det === 0.0) {
		return( null );
	}
	var B = new S3Matrix();
	B.m00 = A.m11 * A.m22 - A.m12 * A.m21;
	B.m01 = A.m02 * A.m21 - A.m01 * A.m22;
	B.m02 = A.m01 * A.m12 - A.m02 * A.m11;
	B.m10 = A.m12 * A.m20 - A.m10 * A.m22;
	B.m11 = A.m00 * A.m22 - A.m02 * A.m20;
	B.m12 = A.m02 * A.m10 - A.m00 * A.m12;
	B.m20 = A.m10 * A.m21 - A.m11 * A.m20;
	B.m21 = A.m01 * A.m20 - A.m00 * A.m21;
	B.m22 = A.m00 * A.m11 - A.m01 * A.m10;
	B = B.mul(1.0 / det);
	B.mtx = - A.mtx * B.m00 - A.mty * B.m10 - A.mtz * B.m20;
	B.mty = - A.mtx * B.m01 - A.mty * B.m11 - A.mtz * B.m21;
	B.mtz = - A.mtx * B.m02 - A.mty * B.m12 - A.mtz * B.m22;
	return B;
};
S3Matrix.prototype.toString = function() {
	return "[" +
		"[" + this.m00 + " " + this.m10 + " " + this.m20 + "]\n" + 
		" [" + this.m01 + " " + this.m11 + " " + this.m21 + "]\n" + 
		" [" + this.m02 + " " + this.m12 + " " + this.m22 + "]\n" + 
		" [" + this.mtx + " " + this.mty + " " + this.mtz + "]]";
};


/**
 * 単位行列を作成します。
 * @returns {S3Matrix}
 */
S3Matrix.getIdentity = function() {
	return new S3Matrix(
		1.0,	0.0,	0.0,
		0.0,	1.0,	0.0,
		0.0,	0.0,	1.0
	);
};

/**
 * 平行移動行列を作成します。
 * @param {double} x
 * @param {double} y
 * @param {double} z
 * @returns {S3Matrix}
 */
S3Matrix.getTranslate = function(x, y, z) {
	return new S3Matrix(
		1.0,	0.0,	0.0,
		0.0,	1.0,	0.0,
		0.0,	0.0,	1.0,
		x,		y,		z
	);
};

/**
 * 拡大縮小行列を作成します。
 * @param {double} x
 * @param {double} y
 * @param {double} z
 * @returns {S3Matrix}
 */
S3Matrix.getScale = function(x, y, z) {
	return new S3Matrix(
		x,		0.0,	0.0,
		0.0,	y,		0.0,
		0.0,	0.0,	z
	);
};

/**
 * X軸周りの回転行列を作成します。
 * @param {double} rad
 * @returns {S3Matrix}
 */
S3Matrix.getRotateX = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	return new S3Matrix(
		1.0,	0.0,	0.0,
		0.0,	cos,	sin,
		0.0,	-sin,	cos
	);
};

/**
 * Y軸周りの回転行列を作成します。
 * @param {double} rad
 * @returns {S3Matrix}
 */
S3Matrix.getRotateY = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	return new S3Matrix(
		cos,	0.0,	-sin,
		0.0,	1.0,	0.0,
		sin,	0.0,	cos
	);
};

/**
 * Z軸周りの回転行列を作成します。
 * @param {double} rad
 * @returns {S3Matrix}
 */
S3Matrix.getRotateZ = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	return new S3Matrix(
		cos,	sin,	0.0,
		-sin,	cos,	0.0,
		0.0,	0.0,	1.0
	);
};
