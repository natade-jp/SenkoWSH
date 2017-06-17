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
 * 4x4行列を作成します
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

var S3DepthMode = {
	/**
	 * Z値の範囲などの依存関係をOpenGL準拠
	 * @type Number
	 */
	OPENG_GL	: 0,
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
	this.depthmode		= S3DepthMode.OPENG_GL;
	this.dimensionmode	= S3DimensionMode.RIGHT_HAND;
	this.vectormode		= S3VectorMode.VECTOR4x1;
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
	else if(MaxZ === undefined) {
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
	else if(this.depthmode === S3DepthMode.OPENG_GL) {
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
	var zoomY = 1.0 / Math.tan(fovY / 2.0);
	var zoomX = zoomY / Aspect;
	var M = new S3Matrix();
	M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 1.0;
	var Delta = Far - Near;
	
	if(this.depthmode === S3DepthMode.DIRECT_X) {
		M.m22 = Far / Delta;
		M.m32 = - Far * Near / Delta;
	}
	else if(this.depthmode === S3DepthMode.OPENG_GL) {
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
 * @param {Number} rad
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateX = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * Y軸周りの回転行列を作成します。
 * @param {Number} rad
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateY = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

/**
 * Z軸周りの回転行列を作成します。
 * @param {Number} rad
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateZ = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
};

