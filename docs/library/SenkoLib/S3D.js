/* global System, Text, Blob, File, Element, ImageData */

﻿/**
 * S3D.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  NYSL Version 0.9982 / The MIT License の Multi-licensing
 *  NYSL Version 0.9982 http://www.kmonos.net/nysl/
 *  The MIT License https://ja.osdn.net/projects/opensource/wiki/licenses%2FMIT_license
 *
 * DEPENDENT LIBRARIES:
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
			this.x * tgt.m11 + this.y * tgt.m21 + this.z * tgt.m31 + tgt.mtx,
			this.x * tgt.m12 + this.y * tgt.m22 + this.z * tgt.m32 + tgt.mty,
			this.x * tgt.m13 + this.y * tgt.m23 + this.z * tgt.m33 + tgt.mtz
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
 * 3x4行列（ 回転などの直交行列に、移動行列を入れたハイブリッド行列、DirectX準拠 ）
 * @param {type} m11
 * @param {type} m12
 * @param {type} m13
 * @param {type} m21
 * @param {type} m22
 * @param {type} m23
 * @param {type} m31
 * @param {type} m32
 * @param {type} m33
 * @param {type} mtx
 * @param {type} mty
 * @param {type} mtz
 * @returns {S3Matrix}
 */
var S3Matrix = function(m11, m12, m13, m21, m22, m23, m31, m32, m33, mtx, mty, mtz) {
	if(arguments.length === 0) {
		this.m11 = 0.0;	this.m12 = 0.0;	this.m13 = 0.0;
		this.m21 = 0.0;	this.m22 = 0.0;	this.m23 = 0.0;
		this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 0.0;
		this.mtx = 0.0;	this.mty = 0.0;	this.mtz = 0.0;
	}
	else if(arguments.length === 9) {
		this.m11 = m11;	this.m12 = m12;	this.m13 = m13;
		this.m21 = m21;	this.m22 = m22;	this.m23 = m23;
		this.m31 = m31;	this.m32 = m32;	this.m33 = m33;
		this.mtx = 0.0;	this.mty = 0.0;	this.mtz = 0.0;
	}
	else if(arguments.length === 12) {
		this.m11 = m11;	this.m12 = m12;	this.m13 = m13;
		this.m21 = m21;	this.m22 = m22;	this.m23 = m23;
		this.m31 = m31;	this.m32 = m32;	this.m33 = m33;
		this.mtx = mtx;	this.mty = mty;	this.mtz = mtz;
	}
};

S3Vector.prototype.clone = function() {
	return new S3Matrix(
		this.m11, this.m12, this.m13,
		this.m21, this.m22, this.m23,
		this.m31, this.m32, this.m33,
		this.mtx, this.mty, this.mtz
	);
};
S3Matrix.prototype.mul = function(tgt) {
	if(tgt instanceof S3Matrix) {
		var A = this; var B = tgt;
		return new S3Matrix(
			A.m11 * B.m11 + A.m12 * B.m21 + A.m13 * B.m31,
			A.m11 * B.m12 + A.m12 * B.m22 + A.m13 * B.m32,
			A.m11 * B.m13 + A.m12 * B.m23 + A.m13 * B.m33,
			A.m21 * B.m11 + A.m22 * B.m21 + A.m23 * B.m31,
			A.m21 * B.m12 + A.m22 * B.m22 + A.m23 * B.m32,
			A.m21 * B.m13 + A.m22 * B.m23 + A.m23 * B.m33,
			A.m31 * B.m11 + A.m32 * B.m21 + A.m33 * B.m31,
			A.m31 * B.m12 + A.m32 * B.m22 + A.m33 * B.m32,
			A.m31 * B.m13 + A.m32 * B.m23 + A.m33 * B.m33,
			A.mtx * B.m11 + A.mty * B.m21 + A.mtz * B.m31 + B.mtx,
			A.mtx * B.m12 + A.mty * B.m22 + A.mtz * B.m32 + B.mty,
			A.mtx * B.m13 + A.mty * B.m23 + A.mtz * B.m33 + B.mtz
		);
	}
	else {
		return new S3Matrix(
			this.m11 * tgt, this.m12 * tgt, this.m13 * tgt,
			this.m21 * tgt, this.m22 * tgt, this.m23 * tgt,
			this.m31 * tgt, this.m32 * tgt, this.m33 * tgt,
			this.mtx * tgt, this.mty * tgt, this.mtz * tgt
		);
	}
};
S3Matrix.prototype.det = function() {
	var A = this;
	var out;
	out  = A.m11 * A.m22 * A.m33;
	out += A.m21 * A.m32 * A.m13;
	out += A.m31 * A.m12 * A.m23;
	out -= A.m11 * A.m32 * A.m23;
	out -= A.m31 * A.m22 * A.m13;
	out -= A.m21 * A.m12 * A.m33;
	return out;
};
S3Matrix.prototype.transposed = function() {
	return new S3Matrix(
		this.m11, this.m21, this.m31,
		this.m12, this.m22, this.m32,
		this.m13, this.m23, this.m33,
		this.mtx, this.mty, this.mtz
	);
};
S3Matrix.prototype.inverse = function() {
	var A = this;
	var det = A.det();
	if(det === 0.0) {
		return( null );
	}
	var B = new S3Matrix();
	B.m11 = A.m22 * A.m33 - A.m23 * A.m32;
	B.m12 = A.m13 * A.m32 - A.m12 * A.m33;
	B.m13 = A.m12 * A.m23 - A.m13 * A.m22;
	B.m21 = A.m23 * A.m31 - A.m21 * A.m33;
	B.m22 = A.m11 * A.m33 - A.m13 * A.m31;
	B.m23 = A.m13 * A.m21 - A.m11 * A.m23;
	B.m31 = A.m21 * A.m32 - A.m22 * A.m31;
	B.m32 = A.m12 * A.m31 - A.m11 * A.m32;
	B.m33 = A.m11 * A.m22 - A.m12 * A.m21;
	B = B.mul(1.0 / det);
	B.mtx = - A.mtx * B.m11 - A.mty * B.m21 - A.mtz * B.m31;
	B.mty = - A.mtx * B.m12 - A.mty * B.m22 - A.mtz * B.m32;
	B.mtz = - A.mtx * B.m13 - A.mty * B.m23 - A.mtz * B.m33;
	return B;
};
S3Matrix.prototype.toString = function() {
	return "[" +
		"[" + this.m11 + " " + this.m21 + " " + this.m31 + "]\n" + 
		" [" + this.m12 + " " + this.m22 + " " + this.m32 + "]\n" + 
		" [" + this.m13 + " " + this.m23 + " " + this.m33 + "]\n" + 
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
 * X軸回転・仰俯角（ぎょうふかく）・垂直角・ピッチに対応。
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
 * Y軸回転・水平回転・水平角・ヘディングに対応。左手座標系。
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
 * Z軸回転・レンズ回転・回転角・バンクに対応。左手座標系。
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

/**
 回転行列を作成します。
 ヘディング × ピッチ × バンク の 順番です。
 Z軸 × X軸 × Y軸 の 順番です。
 * @param {double} z
 * @param {double} x
 * @param {double} y
 * @returns {S3Matrix}
 */
S3Matrix.getRotateZXY = function(z, x, y) {
	return S3Matrix.getRotateZ(z).mul(S3Matrix.getRotateX(x)).mul(S3Matrix.getRotateY(y));
};
