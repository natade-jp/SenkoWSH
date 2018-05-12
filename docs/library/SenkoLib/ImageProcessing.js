"use strict";

﻿/* global System, ImageData */

﻿/**
 * SenkoLib ImageProcessing.js
 *  画像処理ライブラリの基本ライブラリ
 *  色(ImgColor) と 画像データ(ImgData) の定義を行います。
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
 * 色クラス
 * /////////////////////////////////////////////////////////
 */
var ImgColor = function() {
};
ImgColor.prototype.getColor = function() {
	return null;
};
ImgColor.prototype.clone = function() {
	return null;
};
ImgColor.prototype.zero = function() {
	return null;
};
ImgColor.prototype.one = function() {
	return null;
};
ImgColor.prototype.add = function() {
	return null;
};
ImgColor.prototype.sub = function() {
	return null;
};
ImgColor.prototype.mul = function() {
	return null;
};
ImgColor.prototype.div = function() {
	return null;
};
ImgColor.prototype.exp = function() {
	return null;
};
ImgColor.prototype.log = function() {
	return null;
};
ImgColor.prototype.pow = function() {
	return null;
};
ImgColor.prototype.baselog = function() {
	return null;
};
ImgColor.prototype.table = function() {
	return null;
};
ImgColor.prototype.random = function() {
	return null;
};
ImgColor.prototype.luminance = function() {
	return null;
};
ImgColor.prototype.addColor = function() {
	return null;
};
ImgColor.prototype.subColor = function() {
	return null;
};
ImgColor.prototype.mulColor = function() {
	return null;
};
ImgColor.prototype.divColor = function() {
	return null;
};
ImgColor.prototype.maxColor = function() {
	return null;
};
ImgColor.prototype.minColor = function() {
	return null;
};
ImgColor.normType = {
	/**
	 * マンハッタン距離を使用する
	 * @type Number
	 */
	Manhattan : 0,

	/**
	 * ユーグリッド距離を使用する
	 * @type Number
	 */
	Eugrid : 1
};
ImgColor.prototype.norm = function() {
	return null;
};
ImgColor.prototype.normFast = function() {
	return null;
};
ImgColor.prototype.normColor = function(c, normType) {
	return this.subColor(c).norm(normType);
};
ImgColor.prototype.normColorFast = function(c, normType) {
	return this.subColor(c).normFast(normType);
};
ImgColor.prototype.getBlendAlpha = function() {
	return null;
};
ImgColor.prototype.setBlendAlpha = function() {
	return null;
};
ImgColor.prototype.exchangeColorAlpha = function() {
	return null;
};
ImgColor.prototype.equals = function() {
	return false;
};
ImgColor.ipLerp = function(v0, v1, x) {
	var delta = v1.subColor(v0);
	return v0.addColor(delta.mul(x));
};
ImgColor.ipCosine = function(v0, v1, x) {
	return ImgColor.ipLerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
};
ImgColor.ipHermite2p3 = function(v0, v1, x) {
	return ImgColor.ipLerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
};
ImgColor.ipHermite2p5 = function(v0, v1, x) {
	return ImgColor.ipLerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
};
ImgColor.ipHermite4p = function(v0, v1, v2, v3, x) {
	var P = v3.subColor(v2).subColor(v0.subColor(v1));
	var Q = v0.subColor(v1).subColor(P);
	var R = v2.subColor(v0);
	var S = v1;
	return  P.mul(x * x * x).addColor(Q.mul(x * x)).addColor(R.mul(x)).addColor(S);
};
ImgColor.funcInBicubic = function(d, a) {
	if(d <= 1.0) {
		return 1.0 - ((a + 3.0) * d * d) + ((a + 2.0) * d * d * d);
	}
	else {
		return (-4.0 * a) + (8.0 * a * d) - (5.0 * a * d * d) + (a * d * d * d);
	}
};
ImgColor.ipBicubic = function(v0, v1, v2, v3, x, a) {
	var w0, w1, w2, w3, c;
	w0 = ImgColor.funcInBicubic(x + 1, a);
	w1 = ImgColor.funcInBicubic(x    , a);
	w2 = ImgColor.funcInBicubic(1 - x, a);
	w3 = ImgColor.funcInBicubic(2 - x, a);
	c = v0.mul(w0).addColor(v1.mul(w1)).addColor(v2.mul(w2)).addColor(v3.mul(w3));
	return c.mul(1.0 / (w0 + w1 + w2 + w3));
};
ImgColor.ipBicubicSoft = function(v0, v1, v2, v3, x) {
	return ImgColor.ipBicubic(v0, v1, v2, v3, x, -0.5);
};
ImgColor.ipBicubicNormal = function(v0, v1, v2, v3, x) {
	return ImgColor.ipBicubic(v0, v1, v2, v3, x, -1.0);
};
ImgColor.ipBicubicSharp = function(v0, v1, v2, v3, x) {
	return ImgColor.ipBicubic(v0, v1, v2, v3, x, -1.2);
};
ImgColor.ipBicubic2D = function(va, nx, ny, a) {
	var output = va[0][0].zero();
	var x, y, y_weight, weight, sum = 0.0;
	for(y = 0; y < 4; y++) {
		y_weight = ImgColor.funcInBicubic(Math.abs(- ny + y - 1), a);
		for(x = 0; x < 4; x++) {
			weight  = ImgColor.funcInBicubic(Math.abs(- nx + x - 1), a);
			weight *= y_weight;
			sum    += weight;
			output = output.addColor(va[y][x].mul(weight));
		}
	}
	output = output.mul(1.0 / sum);
	return output;
};
ImgColor.ipBicubic2DSoft = function(va, nx, ny) {
	return ImgColor.ipBicubic2D(va, nx, ny, -0.5);
};
ImgColor.ipBicubic2DNormal = function(va, nx, ny) {
	return ImgColor.ipBicubic2D(va, nx, ny, -1.0);
};
ImgColor.ipBicubic2DSharp = function(va, nx, ny) {
	return ImgColor.ipBicubic2D(va, nx, ny, -1.2);
};
ImgColor.brendNone = function(x, y, alpha) {
	return y;
};
ImgColor.brendAlpha = function(x, y, alpha) {
	var x_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = ImgColor.ipLerp(x, y, y_alpha);
	return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
};
ImgColor.brendAdd = function(x, y, alpha) {
	var x_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = x.addColor(y.mul(y_alpha));
	return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
};
ImgColor.brendSub = function(x, y, alpha) {
	var new_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = x.subColor(y.mul(y_alpha));
	return x.setBlendAlpha(new_alpha);
};
ImgColor.brendRevSub = function(x, y, alpha) {
	var new_alpha = y.getBlendAlpha();
	var x_alpha = x.getBlendAlpha() * alpha;
	y = y.subColor(x.mul(x_alpha));
	return y.setBlendAlpha(new_alpha);
};
ImgColor.brendMul = function(x, y, alpha) {
	var new_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = x.mulColor(y.mul(y_alpha).div(255.0));
	return x.setBlendAlpha(new_alpha);
};

var ImgColorY = function(color) {
	this.y = color;
};
ImgColorY.prototype = new ImgColor();
ImgColorY.prototype.getColor = function() {
	return this.y;
};
ImgColorY.prototype.clone = function() {
	return new ImgColorY(this.y);
};
ImgColorY.prototype.zero = function() {
	return new ImgColorY(0.0);
};
ImgColorY.prototype.one = function() {
	return new ImgColorY(1.0);
};
ImgColorY.prototype.add = function(x) {
	return new ImgColorY(this.y + x);
};
ImgColorY.prototype.sub = function(x) {
	return new ImgColorY(this.y - x);
};
ImgColorY.prototype.mul = function(x) {
	return new ImgColorY(this.y * x);
};
ImgColorY.prototype.div = function(x) {
	return new ImgColorY(this.y / x);
};
ImgColorY.prototype.exp = function() {
	return new ImgColorY(Math.exp(this.y));
};
ImgColorY.prototype.log = function() {
	return new ImgColorY(Math.log(this.y));
};
ImgColorY.prototype.pow = function(base) {
	return new ImgColorY(Math.pow(base, this.y));
};
ImgColorY.prototype.baselog = function(base) {
	return new ImgColorY(Math.log(this.y) / Math.log(base));
};
ImgColorY.prototype.table = function(table) {
	return new ImgColorY(table[Math.floor(this.y)]);
};
ImgColorY.prototype.random = function() {
	return new ImgColorY(Math.random() * 256);
};
ImgColorY.prototype.luminance = function() {
	return this.y;
};
ImgColorY.prototype.addColor = function(c) {
	return new ImgColorY(this.y + c.y);
};
ImgColorY.prototype.subColor = function(c) {
	return new ImgColorY(this.y - c.y);
};
ImgColorY.prototype.mulColor = function(c) {
	return new ImgColorY(this.y * c.y);
};
ImgColorY.prototype.divColor = function(c) {
	return new ImgColorY(this.y / c.y);
};
ImgColorY.prototype.maxColor = function(c) {
	return new ImgColorY(Math.max(c.y, this.y));
};
ImgColorY.prototype.minColor = function(c) {
	return new ImgColorY(Math.min(c.y, this.y));
};
ImgColorY.prototype.norm = function() {
	return Math.abs(this.y);
};
ImgColorY.prototype.normFast = function() {
	return Math.abs(this.y);
};
ImgColorY.prototype.getBlendAlpha = function() {
	return 1.0;
};
ImgColorY.prototype.setBlendAlpha = function() {
	return this;
};
ImgColorY.prototype.exchangeColorAlpha = function() {
	return this;
};
ImgColorY.prototype.equals = function(c) {
	return this.y === c.y;
};
ImgColorY.prototype.toString = function() {
	return "color(" + this.y + ")";
};
var ImgColorRGBA = function(color) {
	// ディープコピー
	this.rgba = [color[0], color[1], color[2], color[3]];
};
ImgColorRGBA.prototype = new ImgColor();
ImgColorRGBA.prototype.getColor = function() {
	return this.rgba;
};
ImgColorRGBA.prototype.clone = function() {
	return new ImgColorRGBA(this.rgba);
};
ImgColorRGBA.prototype.zero = function() {
	return new ImgColorRGBA([0.0, 0.0, 0.0, 0.0]);
};
ImgColorRGBA.prototype.one = function() {
	return new ImgColorRGBA([1.0, 1.0, 1.0, 1.0]);
};
ImgColorRGBA.prototype.add = function(x) {
	return new ImgColorRGBA([
		this.rgba[0] + x,	this.rgba[1] + x,
		this.rgba[2] + x,	this.rgba[3] + x ]);
};
ImgColorRGBA.prototype.sub = function(x) {
	return new ImgColorRGBA([
		this.rgba[0] - x,	this.rgba[1] - x,
		this.rgba[2] - x,	this.rgba[3] - x ]);
};
ImgColorRGBA.prototype.mul = function(x) {
	return new ImgColorRGBA([
		this.rgba[0] * x,	this.rgba[1] * x,
		this.rgba[2] * x,	this.rgba[3] * x ]);
};
ImgColorRGBA.prototype.div = function(x) {
	return new ImgColorRGBA([
		this.rgba[0] / x,	this.rgba[1] / x,
		this.rgba[2] / x,	this.rgba[3] / x ]);
};
ImgColorRGBA.prototype.exp = function() {
	return new ImgColorRGBA([
		Math.exp(this.rgba[0]),	Math.exp(this.rgba[1]),
		Math.exp(this.rgba[2]),	Math.exp(this.rgba[3]) ]);
};
ImgColorRGBA.prototype.log = function() {
	return new ImgColorRGBA([
		Math.log(this.rgba[0]),	Math.log(this.rgba[1]),
		Math.log(this.rgba[2]),	Math.log(this.rgba[3]) ]);
};
ImgColorRGBA.prototype.pow = function(base) {
	return new ImgColorRGBA([
		Math.pow(base, this.rgba[0]),	Math.pow(base, this.rgba[1]),
		Math.pow(base, this.rgba[2]),	Math.pow(base, this.rgba[3]) ]);
};
ImgColorRGBA.prototype.baselog = function(base) {
	var x = 1.0 / Math.log(base);
	return new ImgColorRGBA([
		Math.log(this.rgba[0]) * x,	Math.log(this.rgba[1]) * x,
		Math.log(this.rgba[2]) * x,	Math.log(this.rgba[3]) * x ]);
};
ImgColorRGBA.prototype.table = function(table) {
	return new ImgColorRGBA([
		table[Math.round(this.rgba[0])], table[Math.round(this.rgba[1])],
		table[Math.round(this.rgba[2])], table[Math.round(this.rgba[3])] ]);
};
ImgColorRGBA.prototype.random = function() {
	return new ImgColorRGBA([
		Math.floor(Math.random() * 256), Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256), Math.floor(Math.random() * 256) ]);
};
ImgColorRGBA.prototype.luminance = function() {
	return 0.2126 * this.rgba[0] + 0.7152 * this.rgba[1] + 0.0722 * this.rgba[2];
};
ImgColorRGBA.prototype.addColor = function(c) {
	return new ImgColorRGBA([
		this.rgba[0] + c.rgba[0],	this.rgba[1] + c.rgba[1],
		this.rgba[2] + c.rgba[2],	this.rgba[3] + c.rgba[3] ]);
};
ImgColorRGBA.prototype.subColor = function(c) {
	return new ImgColorRGBA([
		this.rgba[0] - c.rgba[0],	this.rgba[1] - c.rgba[1],
		this.rgba[2] - c.rgba[2],	this.rgba[3] - c.rgba[3] ]);
};
ImgColorRGBA.prototype.mulColor = function(c) {
	return new ImgColorRGBA([
		this.rgba[0] * c.rgba[0],	this.rgba[1] * c.rgba[1],
		this.rgba[2] * c.rgba[2],	this.rgba[3] * c.rgba[3] ]);
};
ImgColorRGBA.prototype.divColor = function(c) {
	return new ImgColorRGBA([
		this.rgba[0] / c.rgba[0],	this.rgba[1] / c.rgba[1],
		this.rgba[2] / c.rgba[2],	this.rgba[3] / c.rgba[3] ]);
};
ImgColorRGBA.prototype.maxColor = function(c) {
	return new ImgColorRGBA([
		Math.max(c.rgba[0], this.rgba[0]),Math.max(c.rgba[1], this.rgba[1]),
		Math.max(c.rgba[2], this.rgba[2]),Math.max(c.rgba[3], this.rgba[3])]);
};
ImgColorRGBA.prototype.minColor = function(c) {
	return new ImgColorRGBA([
		Math.min(c.rgba[0], this.rgba[0]),Math.min(c.rgba[1], this.rgba[1]),
		Math.min(c.rgba[2], this.rgba[2]),Math.min(c.rgba[3], this.rgba[3])]);
};
ImgColorRGBA.prototype.norm = function(normType) {
	if(normType === ImgColor.normType.Manhattan) {
		return (Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2])) / 3;
	}
	else if(normType === ImgColor.normType.Eugrid) {
		return Math.sqrt(this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2]) / 3;
	}
};
ImgColorRGBA.prototype.normFast = function(normType) {
	if(normType === ImgColor.normType.Manhattan) {
		return Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2]);
	}
	else if(normType === ImgColor.normType.Eugrid) {
		return this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2];
	}
};
ImgColorRGBA.prototype.getBlendAlpha = function() {
	return this.rgba[3] / 255.0;
};
ImgColorRGBA.prototype.setBlendAlpha = function(x) {
	var color = this.clone();
	color.rgba[3] = x * 255.0;
	return color;
};
ImgColorRGBA.prototype.exchangeColorAlpha = function(color) {
	return new ImgColorRGBA( [ this.rgba[0], this.rgba[1], this.rgba[2], color.rgba[3] ]);
};
ImgColorRGBA.prototype.getRRGGBB = function() {
	return (this.rgba[0] << 16) | (this.rgba[1] << 8) | (this.rgba[2] & 0xff);
};
ImgColorRGBA.prototype.getRed = function() {
	return (this.rgba[0]);
};
ImgColorRGBA.prototype.getGreen = function() {
	return (this.rgba[1]);
};
ImgColorRGBA.prototype.getBlue = function() {
	return (this.rgba[2]);
};
ImgColorRGBA.prototype.equals = function(c) {
	return	(this.rgba[0] === c.rgba[0]) &&
			(this.rgba[1] === c.rgba[1]) &&
			(this.rgba[2] === c.rgba[2]) &&
			(this.rgba[3] === c.rgba[3]) ;
};
ImgColorRGBA.prototype.toString = function() {
	return "color(" + this.rgba[0] + "," + this.rgba[1] + "," + this.rgba[2] + "," + this.rgba[3] + ")";
};
ImgColorRGBA.prototype.mulMatrix = function(m) {
	var color = new ImgColorRGBA();
	color.rgba[0] =	this.rgba[0] * m[0][0] +
					this.rgba[1] * m[0][1] +
					this.rgba[2] * m[0][2] +
					this.rgba[3] * m[0][3];
	color.rgba[1] =	this.rgba[0] * m[1][0] +
					this.rgba[1] * m[1][1] +
					this.rgba[2] * m[1][2] +
					this.rgba[3] * m[1][3];
	color.rgba[2] =	this.rgba[0] * m[2][0] +
					this.rgba[1] * m[2][1] +
					this.rgba[2] * m[2][2] +
					this.rgba[3] * m[2][3];
	color.rgba[3] =	this.rgba[0] * m[3][0] +
					this.rgba[1] * m[3][1] +
					this.rgba[2] * m[3][2] +
					this.rgba[3] * m[3][3];
	return color;
};

/**
 * /////////////////////////////////////////////////////////
 * 指定した部分の色を取得するクラス
 * xとyは中に納まらなくてもよいが、離散値を使用すること
 * 
 * ImgWrapNone	はみでた色は null
 * ImgWrapClamp	はみでた色は最も近い位置の色にする
 * ImgWrapRepeat	はみでた色は反対側の方向から取得する
 * /////////////////////////////////////////////////////////
 */
var ImgWrap = function() {
};
ImgWrap.prototype._init = function(width, height) {
	this.setSize(width, height);
};
ImgWrap.prototype.clone = function() {
	var func = this.getPixelPosition;
	var x = new ImgWrap();
	x._init(this.width, this.height);
	x.getPixelPosition = func;
	return x;
};
ImgWrap.prototype.setSize = function(width, height) {
	this.width  = width;
	this.height = height;
};
ImgWrap.prototype.getPixelPosition = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return [x, y];
	}
	else {
		return null;
	}
};
var ImgWrapNone = function(width, height) {
	ImgWrap.prototype._init.call(this, width, height);
};
ImgWrapNone.prototype = new ImgWrap();
var ImgWrapClamp = function(width, height) {
	ImgWrap.prototype._init.call(this, width, height);
};
ImgWrapClamp.prototype = new ImgWrap();
ImgWrapClamp.prototype.getPixelPosition = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return [x, y];
	}
	// はみ出た場合は中にむりやり収める
	x = ~~Math.floor(Math.min(Math.max(0, x), this.width  - 1));
	y = ~~Math.floor(Math.min(Math.max(0, y), this.height - 1));
	return [x, y];
};
var ImgWrapRepeat = function(width, height) {
	ImgWrap.prototype._init.call(this, width, height);
};
ImgWrapRepeat.prototype = new ImgWrap();
ImgWrapRepeat.prototype.getPixelPosition = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return [x, y];
	}
	var x_times = Math.floor(x / this.width);
	var y_times = Math.floor(y / this.height);
	// リピート
	x -= Math.floor(this.width  * x_times);
	y -= Math.floor(this.height * y_times);
	if(x < 0) {
		x += this.width;
	}
	if(y < 0) {
		y += this.height;
	}
	return [x, y];
};



/**
 * /////////////////////////////////////////////////////////
 * 画像データクラス
 * ImgDataRGBA   32bit整数 0xRRGGBBAA で管理
 * ImgDataY 32bit浮動小数点で管理
 * /////////////////////////////////////////////////////////
 */

var ImgData = function() {
};
ImgData.wrapmode = {
	INSIDE			: "INSIDE",
	CLAMP			: "CLAMP",
	REPEAT			: "REPEAT"
};
ImgData.filtermode = {
	NEAREST_NEIGHBOR	: "NEAREST_NEIGHBOR",
	BILINEAR			: "BILINEAR",
	COSINE				: "COSINE",
	HERMITE4_3			: "HERMITE4_3",
	HERMITE4_5			: "HERMITE4_5",
	HERMITE16			: "HERMITE16",
	BICUBIC				: "BICUBIC",
	BICUBIC_SOFT		: "BICUBIC_SOFT",
	BICUBIC_NORMAL		: "BICUBIC_NORMAL",
	BICUBIC_SHARP		: "BICUBIC_SHARP"
};

ImgData.brendtype = {
	NONE				: "NONE",
	ALPHA				: "ALPHA",
	ADD					: "ADD",
	SUB					: "SUB",
	REVSUB				: "REVSUB",
	MUL					: "MUL"
};

ImgData.prototype._init = function() {
	this.setWrapMode(ImgData.wrapmode.INSIDE);
	this.setFilterMode(ImgData.filtermode.NEAREST_NEIGHBOR);
	this.setBlendType(ImgData.brendtype.NONE);
	this.globalAlpha = 1.0;
};
ImgData.prototype._copyData = function(x) {
	x.setWrapMode(this.getWrapMode());
	x.setFilterMode(this.getFilterMode());
	x.setBlendType(this.getBlendType());
	x.setSize(this.width, this.height);
	x.data.set(this.data);
	x.globalAlpha = this.globalAlpha;
};
ImgData.prototype.clone = function() {
	var x = new ImgData();
	this._copyData(x);
	return x;
};

/**
 * 画面外の色を選択する方法を選ぶ
 * @param {ImgData.wrapmode} _wrapmode
 * @returns {undefined}
 */
ImgData.prototype.setWrapMode = function(_wrapmode) {
	this._wrapmode = _wrapmode;
	if(_wrapmode === ImgData.wrapmode.INSIDE) {
		this.wrapper = new ImgWrapNone(this.width, this.height);
	}
	else if(_wrapmode === ImgData.wrapmode.CLAMP) {
		this.wrapper = new ImgWrapClamp(this.width, this.height);
	}
	else if(_wrapmode === ImgData.wrapmode.REPEAT) {
		this.wrapper = new ImgWrapRepeat(this.width, this.height);
	}
};

/**
 * 画面外の色を選択する方法を取得する
 * @returns {ImgData.wrapmode}
 */
ImgData.prototype.getWrapMode = function() {
	return this._wrapmode;
};

/**
 * 実数で色を選択した場合に、どのように色を補完するか選択する
 * @param {ImgData.filtermode} iptype
 * @returns {undefined}
 */
ImgData.prototype.setFilterMode = function(iptype) {
	this.iptype	= iptype;
	if(iptype === ImgData.filtermode.NEAREST_NEIGHBOR) {
		this.ipfunc	= ImgColor.ipLerp;
		this.ipn	= 1;
	}
	else if(iptype === ImgData.filtermode.BILINEAR) {
		this.ipfunc = ImgColor.ipLerp;
		this.ipn	= 2;
	}
	else if(iptype === ImgData.filtermode.COSINE) {
		this.ipfunc = ImgColor.ipCosine;
		this.ipn	= 2;
	}
	else if(iptype === ImgData.filtermode.HERMITE4_3) {
		this.ipfunc = ImgColor.ipHermite2p3;
		this.ipn	= 2;
	}
	else if(iptype === ImgData.filtermode.HERMITE4_5) {
		this.ipfunc = ImgColor.ipHermite2p5;
		this.ipn	= 2;
	}
	else if(iptype === ImgData.filtermode.HERMITE16) {
		this.ipfunc = ImgColor.ipHermite4p;
		this.ipn	= 4;
	}
	else if(iptype === ImgData.filtermode.BICUBIC) {
		this.ipfunc = ImgColor.ipBicubic2DNormal;
		this.ipn	= 16;
	}
	else if(iptype === ImgData.filtermode.BICUBIC_SOFT) {
		this.ipfunc = ImgColor.ipBicubicSoft;
		this.ipn	= 4;
	}
	else if(iptype === ImgData.filtermode.BICUBIC_NORMAL) {
		this.ipfunc = ImgColor.ipBicubicNormal;
		this.ipn	= 4;
	}
	else if(iptype === ImgData.filtermode.BICUBIC_SHARP) {
		this.ipfunc = ImgColor.ipBicubicSharp;
		this.ipn	= 4;
	}
};

/**
 * 実数で色を選択した場合に、どのように色を補完するか取得する
 * @returns {ImgData.filtermode}
 */
ImgData.prototype.getFilterMode = function() {
	return this.iptype;
};

/**
 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
 * @param {ImgData.brendtype} _blendtype
 * @returns {undefined}
 */
ImgData.prototype.setBlendType = function(_blendtype) {
	this._blendtype = _blendtype;
	if(_blendtype === ImgData.brendtype.NONE) {
		this.blendfunc = ImgColor.brendNone;
	}
	else if(_blendtype === ImgData.brendtype.ALPHA) {
		this.blendfunc = ImgColor.brendAlpha;
	}
	else if(_blendtype === ImgData.brendtype.ADD) {
		this.blendfunc = ImgColor.brendAdd;
	}
	else if(_blendtype === ImgData.brendtype.SUB) {
		this.blendfunc = ImgColor.brendSub;
	}
	else if(_blendtype === ImgData.brendtype.REVSUB) {
		this.blendfunc = ImgColor.brendRevSub;
	}
	else if(_blendtype === ImgData.brendtype.MUL) {
		this.blendfunc = ImgColor.brendMul;
	}
};

/**
 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか取得する
 * @returns {ImgData.brendtype}
 */
ImgData.prototype.getBlendType = function() {
	return this._blendtype;
};

/**
 * データのサイズを変更します。ただし、変更後が中身が初期化されます。
 * 以前と同一の画像の場合は初期化されません。
 * @param {type} width
 * @param {type} height
 * @returns {undefined}
 */
ImgData.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		this.wrapper.setSize(width, height);
		return;
	}
	this.width	= width;
	this.height	= height;
	this.wrapper.setSize(width, height);
	this.data	= new Uint8ClampedArray(this.width * this.height * 4);
};

/**
 * 中身をクリアします。
 * @returns {undefined}
 */
ImgData.prototype.clear = function() {
	if(this.data) {
		this.data.fill(0);
	}
};


/**
 * x と y の座標にある色を取得する。
 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
 * @param {number} x
 * @param {number} y
 * @returns {ImgColorRGBA}
 */
ImgData.prototype.getPixelInside = function(x, y) {
	var p = (y * this.width + x) * 4;
	var c = new ImgColorRGBA([
		this.data[p],
		this.data[p + 1],
		this.data[p + 2],
		this.data[p + 3]
	]);
	return c;
};

/**
 * x と y の座標にある色を設定する。
 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
 * @param {type} x
 * @param {type} y
 * @param {type} color
 * @returns {undefined}
 */
ImgData.prototype.setPixelInside = function(x, y, color) {
	var p = (y * this.width + x) * 4;
	this.data[p]     = color.getColor()[0];
	this.data[p + 1] = color.getColor()[1];
	this.data[p + 2] = color.getColor()[2];
	this.data[p + 3] = color.getColor()[3];
};

/**
 * x と y の座標にある色を取得する。
 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
 * @param {type} x
 * @param {type} y
 * @returns {ImgColor}
 */
ImgData.prototype.getPixel = function(x, y) {
	var p = this.wrapper.getPixelPosition(x, y);
	if(p) {
		return this.getPixelInside(p[0], p[1]);
	}
	return this.getPixelInside(0, 0).zero();
};

/**
 * x と y の座標にある色を設定する。
 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
 * @param {type} x
 * @param {type} y
 * @param {type} color
 * @returns {undefined}
 */
ImgData.prototype.setPixel = function(x, y, color) {
	var p = this.wrapper.getPixelPosition(x, y);
	if(p) {
		if(this._blendtype === ImgData.brendtype.NONE) {
			this.setPixelInside(p[0], p[1], color);
		}
		else {
			var mycolor = this.getPixelInside(p[0], p[1]);
			var newcolor = this.blendfunc(mycolor, color, this.globalAlpha);
			this.setPixelInside(p[0], p[1], newcolor);
		}
	}
};

/**
 * x と y の座標にある色を取得する。
 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
 * @param {type} x
 * @param {type} y
 * @returns {ImgColor}
 */
ImgData.prototype.getColor = function(x, y) {
	var rx = Math.floor(x);
	var ry = Math.floor(y);
	if(	(this.ipn === 1) ||
		((rx === x) && (ry === y))) {
		return this.getPixel(rx, ry);
	}
	else if(this.ipn === 2) {
		var nx = x - rx;
		var ny = y - ry;
		var c0, c1;
		var n0, n1;
		c0 = this.getPixel(rx    , ry    );
		c1 = this.getPixel(rx + 1, ry    );
		n0  = this.ipfunc(c0, c1 , nx);
		c0 = this.getPixel(rx    , ry + 1);
		c1 = this.getPixel(rx + 1, ry + 1);
		n1  = this.ipfunc(c0, c1 , nx);
		return this.ipfunc( n0, n1, ny );
	}
	else if(this.ipn === 4) {
		var nx = x - rx;
		var ny = y - ry;
		var c0, c1, c2, c3;
		var n0, n1, n2, n3;
		c0 = this.getPixel(rx - 1, ry - 1);
		c1 = this.getPixel(rx    , ry - 1);
		c2 = this.getPixel(rx + 1, ry - 1);
		c3 = this.getPixel(rx + 2, ry - 1);
		n0 = this.ipfunc(c0, c1, c2, c3, nx);
		c0 = this.getPixel(rx - 1, ry    );
		c1 = this.getPixel(rx    , ry    );
		c2 = this.getPixel(rx + 1, ry    );
		c3 = this.getPixel(rx + 2, ry    );
		n1 = this.ipfunc(c0, c1, c2, c3, nx);
		c0 = this.getPixel(rx - 1, ry + 1);
		c1 = this.getPixel(rx    , ry + 1);
		c2 = this.getPixel(rx + 1, ry + 1);
		c3 = this.getPixel(rx + 2, ry + 1);
		n2 = this.ipfunc(c0, c1, c2, c3, nx);
		c0 = this.getPixel(rx - 1, ry + 2);
		c1 = this.getPixel(rx    , ry + 2);
		c2 = this.getPixel(rx + 1, ry + 2);
		c3 = this.getPixel(rx + 2, ry + 2);
		n3 = this.ipfunc(c0, c1, c2, c3, nx);
		return this.ipfunc( n0, n1, n2, n3, ny );
	}
	else if(this.ipn === 16) {
		var nx = x - rx;
		var ny = y - ry;
		var ix, iy;
		var cdata = [];
		for(iy = -1; iy < 3; iy++) {
			var cx = [];
			for(ix = -1; ix < 3; ix++) {
				cx[cx.length] = this.getPixel(rx + ix, ry + iy);
			}
			cdata[cdata.length] = cx;
		}
		return this.ipfunc( cdata, nx, ny );
	}
	return null;
};

/**
 * 座標系は、0-1を使用して、テクスチャとみたてて色を取得します。
 * @param {type} u
 * @param {type} v
 * @returns {ImgColor}
 */
ImgData.prototype.getColorUV = function(u, v) {
	return this.getColor(u * this.width, v * this.height);
};

/**
 * x と y の座標にある色を設定する。
 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
 * @param {type} x
 * @param {type} y
 * @param {type} color
 * @returns {undefined}
 */
ImgData.prototype.setColor = function(x, y, color) {
	this.setPixel(Math.floor(x), Math.floor(y), color);
};


/**
 * Canvas型の drawImage と同じ使用方法で ImgData をドローする
 * ImgDataRGBA データの上には、ImgDataRGBA のみ書き込み可能
 * ImgDataY    データの上には、ImgDataY    のみ書き込み可能
 * @param {ImgData} image
 * @param {number} sx
 * @param {number} sy
 * @param {number} sw
 * @param {number} sh
 * @param {number} dx
 * @param {number} dy
 * @param {number} dw
 * @param {number} dh
 * @returns {undefined}
 */
ImgData.prototype.drawImgData = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	if(!(image instanceof ImgData)) {
		throw "IllegalArgumentException";
	}
	if(arguments.length === 3) {
		dx = sx;
		dy = sy;
		dw = image.width;
		dh = image.height;
		sx = 0;
		sy = 0;
		sw = image.width;
		sh = image.height;
	}
	else if(arguments.length === 5) {
		dx = sx;
		dy = sy;
		dw = sw;
		dh = sh;
		sx = 0;
		sy = 0;
		sw = image.width;
		sh = image.height;
	}
	else if(arguments.length === 9) {
	}
	else {
		throw "IllegalArgumentException";
	}
	var delta_w = sw / dw;
	var delta_h = sh / dh;
	var src_x, src_y;
	var dst_x, dst_y;
	
	src_y = sy;
	for(dst_y = dy; dst_y < (dy + dh); dst_y++) {
		src_x = sx;
		for(dst_x = dx; dst_x < (dx + dw); dst_x++) {
			var color = image.getColor(src_x, src_y);
			if(color) {
				this.setColor(dst_x, dst_y, color);
			}
			src_x += delta_w;
		}
		src_y += delta_h;
	}
};

/**
 * 
/**
 * 全画素に指定した関数の操作を行う
 * @param {function} callback callback(color, x, y, this) 実行したいコールバック関数
 * @returns {undefined}
 */
ImgData.prototype.forEach = function(callback) {
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			callback(this.getPixelInside(x, y), x, y, this);
		}
	}
};
var ImgDataRGBA = function() {
	ImgData.prototype._init.call(this);
	if(arguments.length === 1) {
		var image = arguments[0];
		this.putImageData(image);
	}
	else if(arguments.length === 2) {
		var width  = arguments[0];
		var height = arguments[1];
		ImgData.prototype.setSize.call(this, width, height);
	}
};
ImgDataRGBA.prototype = new ImgData();
ImgDataRGBA.prototype.clone = function() {
	var x = new ImgDataRGBA(this.width, this.height);
	this._copyData(x);
	return x;
};
ImgDataRGBA.prototype.putDataY = function(imagedata, n) {
	if(!(imagedata instanceof ImgDataY)) {
		throw "IllegalArgumentException";
	}
	this.setSize(imagedata.width, imagedata.height);
	if(n === undefined) {
		n = 0;
	}
	var p = 0, i = 0;
	for(; i < imagedata.data.length; i++) {
		this.data[p + n] = Math.floor(imagedata.data[i]);
		p += 4;
	}
};
ImgDataRGBA.prototype.putDataYToR = function(imagedata) {
	this.putDataS(imagedata, 0);
};
ImgDataRGBA.prototype.putDataYToG = function(imagedata) {
	this.putDataS(imagedata, 1);
};
ImgDataRGBA.prototype.putDataYToB = function(imagedata) {
	this.putDataS(imagedata, 2);
};
ImgDataRGBA.prototype.putDataYToA = function(imagedata) {
	this.putDataS(imagedata, 3);
};
ImgDataRGBA.prototype.putImageData = function(imagedata) {
	if(	(imagedata instanceof ImageData) ||
		(imagedata instanceof ImgDataRGBA)) {
		this.setSize(imagedata.width, imagedata.height);
		this.data.set(imagedata.data);
	}
	else if(imagedata instanceof ImgDataY) {
		this.putImageData(imagedata.getImageData());
	}
	else {
		throw "IllegalArgumentException";
	}
};
ImgDataRGBA.prototype.getImageData = function() {
	var canvas, context;
	canvas = document.createElement("canvas");
	canvas.width  = this.width;
	canvas.height = this.height;
	context = canvas.getContext("2d");
	var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
	imagedata.data.set(this.data);
	return imagedata;
};
ImgDataRGBA.prototype.grayscale = function() {
	this.forEach(function(color, x, y, data) {
		var luminance = ~~color.luminance();
		var newcolor = new ImgColorRGBA( [luminance, luminance, luminance, color.rgba[3]] );
		data.setPixelInside(x, y, newcolor);
	});
};
var ImgDataY = function() {
	ImgData.prototype._init.call(this);
	if(arguments.length === 1) {
		var image = arguments[0];
		this.putImageData(image);
	}
	else if(arguments.length === 2) {
		var width  = arguments[0];
		var height = arguments[1];
		this.setSize(width, height);
	}
};
ImgDataY.prototype = new ImgData();
ImgDataY.prototype.clone = function() {
	var x = new ImgDataY(this.width, this.height);
	this._copyData(x);
	return x;
};
ImgDataY.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		return;
	}
	this.width	= width;
	this.height	= height;
	this.wrapper.setSize(width, height);
	this.data	= new Float32Array(this.width * this.height);
};
ImgDataY.prototype.getPixelInside = function(x, y) {
	var p = y * this.width + x;
	return new ImgColorY(this.data[p]);
};
ImgDataY.prototype.setPixelInside = function(x, y, color) {
	var p = y * this.width + x;
	this.data[p]     = color.getColor();
};
ImgDataY.prototype.putImageData = function(imagedata, n) {
	if(	(imagedata instanceof ImageData) ||
		(imagedata instanceof ImgDataRGBA)) {
		this.setSize(imagedata.width, imagedata.height);
		if(n === undefined) {
			n = 0;
		}
		var p = 0, i = 0;
		for(; i < this.data.length; i++) {
			this.data[i] = imagedata.data[p + n];
			p += 4;
		}
	}
	else if(imagedata instanceof ImgDataY) {
		this.setSize(imagedata.width, imagedata.height);
		this.data.set(imagedata.data);
	}
	else {
		throw "IllegalArgumentException";
	}
};
ImgDataY.prototype.putImageDataR = function(imagedata) {
	this.putImageData(imagedata, 0);
};
ImgDataY.prototype.putImageDataG = function(imagedata) {
	this.putImageData(imagedata, 1);
};
ImgDataY.prototype.putImageDataB = function(imagedata) {
	this.putImageData(imagedata, 2);
};
ImgDataY.prototype.putImageDataA = function(imagedata) {
	this.putImageData(imagedata, 3);
};
ImgDataY.prototype.getImageData = function() {
	var canvas, context;
	canvas = document.createElement("canvas");
	canvas.width  = this.width;
	canvas.height = this.height;
	context = canvas.getContext("2d");
	var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
	var p = 0, i = 0;
	for(; i < this.data.length; i++) {
		var x = Math.floor(this.data[i]);
		imagedata.data[p + 0] = x;
		imagedata.data[p + 1] = x;
		imagedata.data[p + 2] = x;
		imagedata.data[p + 3] = 255;
		p += 4;
	}
	return imagedata;
};

