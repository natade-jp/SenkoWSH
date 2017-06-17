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
 * @param {type} w
 * @returns {S3Vector}
 */
var S3Vector = function(x, y, z, w) {
	this.x = x;
	this.y = y;
	this.z = z;
	if(w === undefined) {
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
	else {
		return new S3Vector(
			this.x * tgt,
			this.y * tgt,
			this.z * tgt,
			1.0
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
		this.z * b,
		1.0
	);
};
S3Vector.prototype.toString = function() {
	return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]T";
};

/**
 * 逆ベクトルを取得する
 * @returns {S3Vector}
 */
S3Vector.prototype.getInverse = function() {
	return new S3Vector(
		- this.x,
		- this.y,
		- this.z,
		1.0
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
 * 4x4 行列
 * /////////////////////////////////////////////////////////
 */

var S3Matrix = function(
		m00, m10, m20, m30,
		m01, m11, m21, m31,
		m02, m12, m22, m32,
		m03, m13, m23, m33 ) {
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
};

S3Matrix.prototype.clone = function() {
	return new S3Matrix(
		this.m00, this.m10, this.m20, this.m30,
		this.m01, this.m11, this.m21, this.m31,
		this.m02, this.m12, this.m22, this.m32,
		this.m03, this.m13, this.m23, this.m33
	);
};
S3Matrix.prototype.transposed = function() {
	return new S3Matrix(
		this.m00, this.m01, this.m02, this.m03,
		this.m10, this.m11, this.m12, this.m13,
		this.m20, this.m21, this.m22, this.m23,
		this.m30, this.m31, this.m32, this.m33
	);
};
S3Matrix.prototype.mul = function(tgt) {
	if(tgt instanceof S3Matrix) {
		var A = this; var B = tgt;
		return new S3Matrix(
			A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20 + A.m03 * B.m30,
			A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20 + A.m13 * B.m30,
			A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20 + A.m23 * B.m30,
			A.m30 * B.m00 + A.m31 * B.m10 + A.m32 * B.m20 + A.m33 * B.m30,
			A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21 + A.m03 * B.m31,
			A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21 + A.m13 * B.m31,
			A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21 + A.m23 * B.m31,
			A.m30 * B.m01 + A.m31 * B.m11 + A.m32 * B.m21 + A.m33 * B.m31,
			A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22 + A.m03 * B.m32,
			A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22 + A.m13 * B.m32,
			A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22 + A.m23 * B.m32,
			A.m30 * B.m02 + A.m31 * B.m12 + A.m32 * B.m22 + A.m33 * B.m32,
			A.m00 * B.m03 + A.m01 * B.m13 + A.m02 * B.m23 + A.m03 * B.m33,
			A.m10 * B.m03 + A.m11 * B.m13 + A.m12 * B.m23 + A.m13 * B.m33,
			A.m20 * B.m03 + A.m21 * B.m13 + A.m22 * B.m23 + A.m23 * B.m33,
			A.m30 * B.m03 + A.m31 * B.m13 + A.m32 * B.m23 + A.m33 * B.m33
		);
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
	var B = A.clone();
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
		1.0,	0.0,	0.0,	x,
		0.0,	1.0,	0.0,	y,
		0.0,	0.0,	1.0,	z,
		0.0,	0.0,	0.0,	1.0
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
		x,		0.0,	0.0,	0.0,
		0.0,	y,		0.0,	0.0,
		0.0,	0.0,	z,		0.0,
		0.0,	0.0,	0.0,	1.0
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
		1.0,	0.0,	0.0,	0.0,
		0.0,	cos,	-sin,	0.0,
		0.0,	sin,	cos,	0.0,
		0.0,	0.0,	0.0,	1.0
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
		cos,	0.0,	sin,	0.0,
		0.0,	1.0,	0.0,	0.0,
		-sin,	0.0,	cos,	0.0,
		0.0,	0.0,	0.0,	1.0
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
		cos,	-sin,	0.0,	0.0,
		sin,	cos,	0.0,	0.0,
		0.0,	0.0,	1.0,	0.0,
		0.0,	0.0,	0.0,	1.0
	);
};
