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
			this.x * tgt.m00 + this.y * tgt.m10 + this.z * tgt.m20 + tgt.m30,
			this.x * tgt.m01 + this.y * tgt.m11 + this.z * tgt.m21 + tgt.m31,
			this.x * tgt.m02 + this.y * tgt.m12 + this.z * tgt.m22 + tgt.m32
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
 * @param {type} m00
 * @param {type} m01
 * @param {type} m02
 * @param {type} m10
 * @param {type} m11
 * @param {type} m12
 * @param {type} m20
 * @param {type} m21
 * @param {type} m22
 * @param {type} m30
 * @param {type} m31
 * @param {type} m32
 * @returns {S3Matrix}
 */
var S3Matrix = function(m00, m01, m02, m10, m11, m12, m20, m21, m22, m30, m31, m32) {
	if(arguments.length === 0) {
		this.m00 = 0.0;	this.m01 = 0.0;	this.m02 = 0.0;
		this.m10 = 0.0;	this.m11 = 0.0;	this.m12 = 0.0;
		this.m20 = 0.0;	this.m21 = 0.0;	this.m22 = 0.0;
		this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;
	}
	else if(arguments.length === 9) {
		this.m00 = m00;	this.m01 = m01;	this.m02 = m02;
		this.m10 = m10;	this.m11 = m11;	this.m12 = m12;
		this.m20 = m20;	this.m21 = m21;	this.m22 = m22;
		this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;
	}
	else if(arguments.length === 12) {
		this.m00 = m00;	this.m01 = m01;	this.m02 = m02;
		this.m10 = m10;	this.m11 = m11;	this.m12 = m12;
		this.m20 = m20;	this.m21 = m21;	this.m22 = m22;
		this.m30 = m30;	this.m31 = m31;	this.m32 = m32;
	}
};

S3Vector.prototype.clone = function() {
	return new S3Matrix(
		this.m00, this.m01, this.m02,
		this.m10, this.m11, this.m12,
		this.m20, this.m21, this.m22,
		this.m30, this.m31, this.m32
	);
};
S3Matrix.prototype.mul = function(tgt) {
	if(tgt instanceof S3Matrix) {
		var A = this; var B = tgt;
		var b00 = A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20;
		var b01 = A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21;
		var b02 = A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22;
		var b10 = A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20;
		var b11 = A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21;
		var b12 = A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22;
		var b20 = A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20;
		var b21 = A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21;
		var b22 = A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22;
		var b30 = A.m30 * B.m00 + A.m31 * B.m10 + A.m32 * B.m20 + B.m30;
		var b31 = A.m30 * B.m01 + A.m31 * B.m11 + A.m32 * B.m21 + B.m31;
		var b32 = A.m30 * B.m02 + A.m31 * B.m12 + A.m32 * B.m22 + B.m32;
		return new S3Matrix(
			b00, b01, b02,
			b10, b11, b12,
			b20, b21, b22,
			b30, b31, b32
		);
	}
	else {
		return new S3Matrix(
			this.m00 * tgt, this.m01 * tgt, this.m02 * tgt,
			this.m10 * tgt, this.m11 * tgt, this.m12 * tgt,
			this.m20 * tgt, this.m21 * tgt, this.m22 * tgt,
			this.m30 * tgt, this.m31 * tgt, this.m32 * tgt
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
S3Matrix.prototype.transposed = function() {
	return new S3Matrix(
		this.m00, this.m10, this.m20,
		this.m01, this.m11, this.m21,
		this.m02, this.m12, this.m22,
		this.m30, this.m31, this.m32
	);
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
	B.m30 = - A.m30 * B.m00 - A.m31 * B.m10 - A.m32 * B.m20;
	B.m31 = - A.m30 * B.m01 - A.m31 * B.m11 - A.m32 * B.m21;
	B.m32 = - A.m30 * B.m02 - A.m31 * B.m12 - A.m32 * B.m22;
	return B;
};
S3Matrix.prototype.toString = function() {
	return "[" +
		"[" + this.m00 + " " + this.m10 + " " + this.m20 + "]\n" + 
		" [" + this.m01 + " " + this.m11 + " " + this.m21 + "]\n" + 
		" [" + this.m02 + " " + this.m12 + " " + this.m22 + "]\n" + 
		" [" + this.m30 + " " + this.m31 + " " + this.m32 + "]]";
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
 * DirectX準拠。左手座標系。
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
 * DirectX準拠。左手座標系。
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
 * DirectX準拠。左手座標系。
 * @param {double} rad
 * @returns {S3Matrix}
 */
S3Matrix.getRotateY = function(rad) {
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
