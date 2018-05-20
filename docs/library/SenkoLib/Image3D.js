﻿"use strict";

﻿/* global ImgColorRGBA, ImgDataY, ImgData */

﻿/**
 * SenkoLib Image3D.js
 *  画像処理ライブラリの中の3D系画像処理
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 * 
 * DEPENDENT LIBRARIES:
 *  ImageProcessing.js
 */

/**
 * 画像処理ライブラリ用のベクトルクラス
 * @param {type} x
 * @param {type} y
 * @param {type} z
 * @returns {ImgVector}
 */
var ImgVector = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
 * クロス積
 * @param {ImgVector} tgt
 * @returns {ImgVector}
 */
ImgVector.prototype.cross = function(tgt) {
	return new ImgVector(
		this.y * tgt.z - this.z * tgt.y,
		this.z * tgt.x - this.x * tgt.z,
		this.x * tgt.y - this.y * tgt.x
	);
};

/**
 * ターゲットへのベクトル
 * @param {ImgVector} tgt
 * @returns {ImgVector}
 */
ImgVector.prototype.getDirection = function(tgt) {
	return new ImgVector(
		tgt.x - this.x,
		tgt.y - this.y,
		tgt.z - this.z
	);
};

/**
 * ターゲットへの方向ベクトル
 * @returns {ImgVector}
 */
ImgVector.prototype.normalize = function() {
	var b = this.x * this.x + this.y * this.y + this.z * this.z;
	b = Math.sqrt(1.0 / b);
	return new ImgVector(
		this.x * b,
		this.y * b,
		this.z * b
	);
};

/**
 * 方向ベクトルから、RGBの画素へ変換
 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
 * @returns {ImgColorRGBA}
 */
ImgVector.prototype.getNormalMapColor = function() {
	return new ImgColorRGBA([
		Math.round((1.0 + this.x) * 127.5),
		Math.round((1.0 - this.y) * 127.5),
		Math.round((1.0 + this.z) * 127.5),
		255
	]);
};

/**
 * RGBの画素から方向ベクトルへの変換
 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
 * @returns {ImgVector}
 */
ImgColorRGBA.prototype.getNormalVector = function() {
	return new ImgVector(
		  (this.rgba[0] / 128.0) - 1.0,
		- (this.rgba[1] / 128.0) + 1.0,
		  (this.rgba[2] / 128.0) - 1.0
	);
};

/**
 * ノーマルマップを作成する
 * @returns {ImgColorRGBA}
 */
ImgDataY.prototype.getNormalMap = function() {
	if(this.getWrapMode() === ImgData.wrapmode.INSIDE) {
		// 端の値を取得できないのでエラー
		throw "not inside";
	}
	
	var output = new ImgDataRGBA(this.width, this.height);
	var x, y;
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var x1 = new ImgVector(x - 1, y, this.getPixel(x - 1, y).getColor());
			var x2 = new ImgVector(x + 1, y, this.getPixel(x + 1, y).getColor());
			var x3 = x1.getDirection(x2);
			var y1 = new ImgVector(x, y - 1, this.getPixel(x, y - 1).getColor());
			var y2 = new ImgVector(x, y + 1, this.getPixel(x, y + 1).getColor());
			var y3 = y1.getDirection(y2);
			var n  = x3.cross(y3).normalize();
			output.setPixelInside(x, y, n.getNormalMapColor());
		}
	}
	return output;
};

/**
 * ノーマルマップに対して、環境マッピングする
 * @param {ImgColorRGBA} texture
 * @returns {ImgColorRGBA}
 */
ImgDataY.prototype.filterEnvironmentMapping = function(texture) {
};
