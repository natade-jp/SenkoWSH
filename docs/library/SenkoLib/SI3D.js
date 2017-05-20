/* global SIColorRGBA, SIDataY */

﻿/**
 * SI3D.js
 *  3D系の画像処理を集めました。
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
 * 画像処理ライブラリ用のベクトルクラス
 * @param {type} x
 * @param {type} y
 * @param {type} z
 * @returns {SIVector}
 */
var SIVector = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
 * クロス積
 * @param {SIVector} tgt
 * @returns {SIVector}
 */
SIVector.prototype.cross = function(tgt) {
	return new SIVector(
		this.y * tgt.z - this.z * tgt.y,
		this.z * tgt.x - this.x * tgt.z,
		this.x * tgt.y - this.y * tgt.x
	);
};

/**
 * ターゲットへのベクトル
 * @param {SIVector} tgt
 * @returns {SIVector}
 */
SIVector.prototype.getDirection = function(tgt) {
	return new SIVector(
		tgt.x - this.x,
		tgt.y - this.y,
		tgt.z - this.z
	);
};

/**
 * ターゲットへの方向ベクトル
 * @returns {SIVector}
 */
SIVector.prototype.normalize = function() {
	var b = this.x * this.x + this.y * this.y + this.z * this.z;
	b = Math.sqrt(1.0 / b);
	return new SIVector(
		this.x * b,
		this.y * b,
		this.z * b
	);
};

/**
 * 方向ベクトルから、RGBの画素へ変換
 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
 * @returns {SIColorRGBA}
 */
SIVector.prototype.getNormalMapColor = function() {
	return new SIColorRGBA([
		Math.round((1.0 + this.x) * 127.5),
		Math.round((1.0 - this.y) * 127.5),
		Math.round((1.0 + this.z) * 127.5),
		255
	]);
};

/**
 * RGBの画素から方向ベクトルへの変換
 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
 * @returns {SIVector}
 */
SIColorRGBA.prototype.getNormalVector = function() {
	return new SIVector(
		  (this.rgba[0] / 128.0) - 1.0,
		- (this.rgba[1] / 128.0) + 1.0,
		  (this.rgba[2] / 128.0) - 1.0
	);
};

/**
 * ノーマルマップを作成する
 * @returns {SIColorRGBA}
 */
SIDataY.prototype.getNormalMap = function() {
	var output = new SIDataRGBA(this.width, this.height);
	var x, y;
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var x1 = new SIVector(x    , y, this.getPixel(x    , y).getColor());
			var x2 = new SIVector(x + 1, y, this.getPixel(x + 1, y).getColor());
			var x3 = x1.getDirection(x2);
			var y1 = new SIVector(x, y    , this.getPixel(x, y    ).getColor());
			var y2 = new SIVector(x, y + 1, this.getPixel(x, y + 1).getColor());
			var y3 = y1.getDirection(y2);
			var n  = x3.cross(y3).normalize();
			output.setPixelInside(x, y, n.getNormalMapColor());
		}
	}
	return output;
};

/**
 * ノーマルマップに対して、環境マッピングする
 * @param {SIColorRGBA} texture
 * @returns {SIColorRGBA}
 */
SIDataY.prototype.filterEnvironmentMapping = function(texture) {
};

