/* global System, ImageData */

﻿/**
 * SImageProcessing.js
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
 * 色クラス
 * /////////////////////////////////////////////////////////
 */
var SIColor = function() {
};
SIColor.prototype.getColor = function() {
	return null;
};
SIColor.prototype.clone = function() {
	return null;
};
SIColor.prototype.zero = function() {
	return null;
};
SIColor.prototype.one = function() {
	return null;
};
SIColor.prototype.add = function() {
	return null;
};
SIColor.prototype.sub = function() {
	return null;
};
SIColor.prototype.mul = function() {
	return null;
};
SIColor.prototype.div = function() {
	return null;
};
SIColor.prototype.exp = function() {
	return null;
};
SIColor.prototype.log = function() {
	return null;
};
SIColor.prototype.pow = function() {
	return null;
};
SIColor.prototype.baselog = function() {
	return null;
};
SIColor.prototype.table = function() {
	return null;
};
SIColor.prototype.random = function() {
	return null;
};
SIColor.prototype.addColor = function() {
	return null;
};
SIColor.prototype.subColor = function() {
	return null;
};
SIColor.prototype.mulColor = function() {
	return null;
};
SIColor.prototype.divColor = function() {
	return null;
};
SIColor.prototype.maxColor = function() {
	return null;
};
SIColor.prototype.minColor = function() {
	return null;
};
SIColor.prototype.normManhattan = function() {
	return null;
};
SIColor.prototype.normEugrid = function() {
	return null;
};
SIColor.prototype.getBlendAlpha = function() {
	return null;
};
SIColor.prototype.setBlendAlpha = function() {
	return null;
};
SIColor.ipLerp = function(v0, v1, x) {
	var delta = v1.subColor(v0);
	return v0.addColor(delta.mul(x));
};
SIColor.ipCosine = function(v0, v1, x) {
	return SIColor.ipLerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
};
SIColor.ipHermite2p3 = function(v0, v1, x) {
	return SIColor.ipLerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
};
SIColor.ipHermite2p5 = function(v0, v1, x) {
	return SIColor.ipLerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
};
SIColor.ipHermite4p = function(v0, v1, v2, v3, x) {
	var P = v3.subColor(v2).subColor(v0.subColor(v1));
	var Q = v0.subColor(v1).subColor(P);
	var R = v2.subColor(v0);
	var S = v1;
	return  P.mul(x * x * x).addColor(Q.mul(x * x)).addColor(R.mul(x)).addColor(S);
};
SIColor.funcInBicubic = function(d, a) {
	if(d <= 1.0) {
		return 1.0 - ((a + 3.0) * d * d) + ((a + 2.0) * d * d * d);
	}
	else {
		return (-4.0 * a) + (8.0 * a * d) - (5.0 * a * d * d) + (a * d * d * d);
	}
};
SIColor.ipBicubic = function(va, nx, ny, a) {
	var output = va[0][0].zero();
	var x, y, y_weight, weight, sum = 0.0;
	for(y = 0; y < 4; y++) {
		y_weight = SIColor.funcInBicubic(Math.abs(- ny + y - 1), a);
		for(x = 0; x < 4; x++) {
			weight  = SIColor.funcInBicubic(Math.abs(- nx + x - 1), a);
			weight *= y_weight;
			sum    += weight;
			output = output.addColor(va[y][x].mul(weight));
		}
	}
	output = output.mul(1.0 / sum);
	return output;
};
SIColor.ipBicubicSoft = function(va, nx, ny) {
	return SIColor.ipBicubic(va, nx, ny, -0.5);
};
SIColor.ipBicubicNormal = function(va, nx, ny) {
	return SIColor.ipBicubic(va, nx, ny, -1.0);
};
SIColor.ipBicubicSharp = function(va, nx, ny) {
	return SIColor.ipBicubic(va, nx, ny, -1.2);
};
SIColor.brendNone = function(x, y, alpha) {
	return y;
};
SIColor.brendAlpha = function(x, y, alpha) {
	var x_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = SIColor.ipLerp(x, y, y_alpha);
	return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
};
SIColor.brendAdd = function(x, y, alpha) {
	var x_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = x.addColor(y.mul(y_alpha));
	return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
};
SIColor.brendSub = function(x, y, alpha) {
	var new_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = x.subColor(y.mul(y_alpha));
	return x.setBlendAlpha(new_alpha);
};
SIColor.brendRevSub = function(x, y, alpha) {
	var new_alpha = y.getBlendAlpha();
	var x_alpha = x.getBlendAlpha() * alpha;
	y = y.subColor(x.mul(x_alpha));
	return y.setBlendAlpha(new_alpha);
};
SIColor.brendMul = function(x, y, alpha) {
	var new_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha() * alpha;
	x = x.mulColor(y.mul(y_alpha).div(255.0));
	return x.setBlendAlpha(new_alpha);
};

var SIColorY = function(color) {
	this.y = color;
};
SIColorY.prototype = new SIColor();
SIColorY.prototype.getColor = function() {
	return this.y;
};
SIColorY.prototype.clone = function() {
	return new SIColorY(this.y);
};
SIColorY.prototype.zero = function() {
	return new SIColorY(0.0);
};
SIColorY.prototype.one = function() {
	return new SIColorY(1.0);
};
SIColorY.prototype.add = function(x) {
	return new SIColorY(this.y + x);
};
SIColorY.prototype.sub = function(x) {
	return new SIColorY(this.y - x);
};
SIColorY.prototype.mul = function(x) {
	return new SIColorY(this.y * x);
};
SIColorY.prototype.div = function(x) {
	return new SIColorY(this.y / x);
};
SIColorY.prototype.exp = function() {
	return new SIColorY(Math.exp(this.y));
};
SIColorY.prototype.log = function() {
	return new SIColorY(Math.log(this.y));
};
SIColorY.prototype.pow = function(base) {
	return new SIColorY(Math.pow(base, this.y));
};
SIColorY.prototype.baselog = function(base) {
	return new SIColorY(Math.log(this.y) / Math.log(base));
};
SIColorY.prototype.table = function(table) {
	return new SIColorY(table[Math.floor(this.y)]);
};
SIColorY.prototype.random = function() {
	return new SIColorY(Math.random() * 256);
};
SIColorY.prototype.addColor = function(c) {
	return new SIColorY(this.y + c.y);
};
SIColorY.prototype.subColor = function(c) {
	return new SIColorY(this.y - c.y);
};
SIColorY.prototype.mulColor = function(c) {
	return new SIColorY(this.y * c.y);
};
SIColorY.prototype.divColor = function(c) {
	return new SIColorY(this.y / c.y);
};
SIColorY.prototype.maxColor = function(c) {
	return new SIColorY(Math.max(c.y, this.y));
};
SIColorY.prototype.minColor = function(c) {
	return new SIColorY(Math.min(c.y, this.y));
};
SIColorY.prototype.normManhattan = function() {
	return Math.abs(this.y);
};
SIColorY.prototype.normEugrid = function() {
	return Math.abs(this.y);
};
SIColorY.prototype.getBlendAlpha = function() {
	return 1.0;
};
SIColorY.prototype.setBlendAlpha = function() {
	return this;
};
SIColorY.prototype.toString = function() {
	return "color(" + this.y + ")";
};
var SIColorRGBA = function(color) {
	// ディープコピー
	this.rgba = [color[0], color[1], color[2], color[3]];
};
SIColorRGBA.prototype = new SIColor();
SIColorRGBA.prototype.getColor = function() {
	return this.rgba;
};
SIColorRGBA.prototype.clone = function() {
	return new SIColorRGBA(this.rgba);
};
SIColorRGBA.prototype.zero = function() {
	return new SIColorRGBA([0.0, 0.0, 0.0, 0.0]);
};
SIColorRGBA.prototype.one = function() {
	return new SIColorRGBA([1.0, 1.0, 1.0, 1.0]);
};
SIColorRGBA.prototype.add = function(x) {
	return new SIColorRGBA([
		this.rgba[0] + x,	this.rgba[1] + x,
		this.rgba[2] + x,	this.rgba[3] + x ]);
};
SIColorRGBA.prototype.sub = function(x) {
	return new SIColorRGBA([
		this.rgba[0] - x,	this.rgba[1] - x,
		this.rgba[2] - x,	this.rgba[3] - x ]);
};
SIColorRGBA.prototype.mul = function(x) {
	return new SIColorRGBA([
		this.rgba[0] * x,	this.rgba[1] * x,
		this.rgba[2] * x,	this.rgba[3] * x ]);
};
SIColorRGBA.prototype.div = function(x) {
	return new SIColorRGBA([
		this.rgba[0] / x,	this.rgba[1] / x,
		this.rgba[2] / x,	this.rgba[3] / x ]);
};
SIColorRGBA.prototype.exp = function() {
	return new SIColorRGBA([
		Math.exp(this.rgba[0]),	Math.exp(this.rgba[1]),
		Math.exp(this.rgba[2]),	Math.exp(this.rgba[3]) ]);
};
SIColorRGBA.prototype.log = function() {
	return new SIColorRGBA([
		Math.log(this.rgba[0]),	Math.log(this.rgba[1]),
		Math.log(this.rgba[2]),	Math.log(this.rgba[3]) ]);
};
SIColorRGBA.prototype.pow = function(base) {
	return new SIColorRGBA([
		Math.pow(base, this.rgba[0]),	Math.pow(base, this.rgba[1]),
		Math.pow(base, this.rgba[2]),	Math.pow(base, this.rgba[3]) ]);
};
SIColorRGBA.prototype.baselog = function(base) {
	var x = 1.0 / Math.log(base);
	return new SIColorRGBA([
		Math.log(this.rgba[0]) * x,	Math.log(this.rgba[1]) * x,
		Math.log(this.rgba[2]) * x,	Math.log(this.rgba[3]) * x ]);
};
SIColorRGBA.prototype.table = function(table) {
	return new SIColorRGBA([
		table[Math.round(this.rgba[0])], table[Math.round(this.rgba[1])],
		table[Math.round(this.rgba[2])], table[Math.round(this.rgba[3])] ]);
};
SIColorRGBA.prototype.random = function() {
	return new SIColorRGBA([
		Math.floor(Math.random() * 256), Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256), Math.floor(Math.random() * 256) ]);
};
SIColorRGBA.prototype.addColor = function(c) {
	return new SIColorRGBA([
		this.rgba[0] + c.rgba[0],	this.rgba[1] + c.rgba[1],
		this.rgba[2] + c.rgba[2],	this.rgba[3] + c.rgba[3] ]);
};
SIColorRGBA.prototype.subColor = function(c) {
	return new SIColorRGBA([
		this.rgba[0] - c.rgba[0],	this.rgba[1] - c.rgba[1],
		this.rgba[2] - c.rgba[2],	this.rgba[3] - c.rgba[3] ]);
};
SIColorRGBA.prototype.mulColor = function(c) {
	return new SIColorRGBA([
		this.rgba[0] * c.rgba[0],	this.rgba[1] * c.rgba[1],
		this.rgba[2] * c.rgba[2],	this.rgba[3] * c.rgba[3] ]);
};
SIColorRGBA.prototype.divColor = function(c) {
	return new SIColorRGBA([
		this.rgba[0] / c.rgba[0],	this.rgba[1] / c.rgba[1],
		this.rgba[2] / c.rgba[2],	this.rgba[3] / c.rgba[3] ]);
};
SIColorRGBA.prototype.maxColor = function(c) {
	return new SIColorRGBA([
		Math.max(c.rgba[0], this.rgba[0]),Math.max(c.rgba[1], this.rgba[1]),
		Math.max(c.rgba[2], this.rgba[2]),Math.max(c.rgba[3], this.rgba[3])]);
};
SIColorRGBA.prototype.minColor = function(c) {
	return new SIColorRGBA([
		Math.min(c.rgba[0], this.rgba[0]),Math.min(c.rgba[1], this.rgba[1]),
		Math.min(c.rgba[2], this.rgba[2]),Math.min(c.rgba[3], this.rgba[3])]);
};
SIColorRGBA.prototype.normManhattan = function() {
	return (Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2])) / 3;
};
SIColorRGBA.prototype.normEugrid = function() {
	return Math.sqrt(this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2]) / 3;
};
SIColorRGBA.prototype.getBlendAlpha = function() {
	return this.rgba[3] / 255.0;
};
SIColorRGBA.prototype.setBlendAlpha = function(x) {
	var color = this.clone();
	color.rgba[3] = x * 255.0;
	return color;
};
SIColorRGBA.prototype.toString = function() {
	return "color(" + this.rgba[0] + "," + this.rgba[1] + "," + this.rgba[2] + "," + this.rgba[3] + ")";
};
SIColorRGBA.prototype.mulMatrix = function(m) {
	var color = new SIColorRGBA();
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
 * SIPixelSelecterNormal はみでた色は null
 * SIPixelSelecterFill   はみでた色は最も近い位置の色にする
 * SIPixelSelecterRepeat はみでた色は反対側の方向から取得する
 * /////////////////////////////////////////////////////////
 */
var SIPixelSelecter = function() {
};
SIPixelSelecter.prototype._init = function(width, height) {
	this.setSize(width, height);
};
SIPixelSelecter.prototype.clone = function() {
	var func = this.getPixelPosition;
	var x = new SIPixelSelecter();
	x._init(this.width, this.height);
	x.getPixelPosition = func;
	return x;
};
SIPixelSelecter.prototype.setSize = function(width, height) {
	this.width  = width;
	this.height = height;
};
SIPixelSelecter.prototype.getPixelPosition = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return [x, y];
	}
	else {
		return null;
	}
};
var SIPixelSelecterInside = function(width, height) {
	SIPixelSelecter.prototype._init.call(this, width, height);
};
SIPixelSelecterInside.prototype = new SIPixelSelecter();
var SIPixelSelecterFill = function(width, height) {
	SIPixelSelecter.prototype._init.call(this, width, height);
};
SIPixelSelecterFill.prototype = new SIPixelSelecter();
SIPixelSelecterFill.prototype.getPixelPosition = function(x, y) {
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
var SIPixelSelecterRepeat = function(width, height) {
	SIPixelSelecter.prototype._init.call(this, width, height);
};
SIPixelSelecterRepeat.prototype = new SIPixelSelecter();
SIPixelSelecterRepeat.prototype.getPixelPosition = function(x, y) {
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
 * SIDataRGBA   32bit整数 0xRRGGBBAA で管理
 * SIDataY 32bit浮動小数点で管理
 * /////////////////////////////////////////////////////////
 */

var SIData = function() {
};
SIData.selectertype = {
	INSIDE : "INSIDE",
	FILL   : "FILL",
	REPEAT : "REPEAT"
};
SIData.interpolationtype = {
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

SIData.brendtype = {
	NONE				: "NONE",
	ALPHA				: "ALPHA",
	ADD					: "ADD",
	SUB					: "SUB",
	REVSUB				: "REVSUB",
	MUL					: "MUL"
};

SIData.prototype._init = function() {
	this.setSelecter(SIData.selectertype.INSIDE);
	this.setInterPolation(SIData.interpolationtype.NEAREST_NEIGHBOR);
	this.setBlendType(SIData.brendtype.NONE);
	this.globalAlpha = 1.0;
};
SIData.prototype._copyData = function(x) {
	x.setSelecter(this.getSelecter());
	x.setInterPolation(this.getInterPolation());
	x.setBlendType(this.getBlendType());
	x.setSize(this.width, this.height);
	x.data.set(this.data);
	x.globalAlpha = this.globalAlpha;
};
SIData.prototype.clone = function() {
	var x = new SIData();
	this._copyData(x);
	return x;
};

/**
 * 画面外の色を選択する方法を選ぶ
 * @param {SIData.selectertype} _selectertype
 * @returns {undefined}
 */
SIData.prototype.setSelecter = function(_selectertype) {
	this._selectertype = _selectertype;
	if(_selectertype === SIData.selectertype.INSIDE) {
		this.selecter = new SIPixelSelecterInside(this.width, this.height);
	}
	else if(_selectertype === SIData.selectertype.FILL) {
		this.selecter = new SIPixelSelecterFill(this.width, this.height);
	}
	else if(_selectertype === SIData.selectertype.REPEAT) {
		this.selecter = new SIPixelSelecterRepeat(this.width, this.height);
	}
};

/**
 * 画面外の色を選択する方法を取得する
 * @returns {SIData.selectertype}
 */
SIData.prototype.getSelecter = function() {
	return this._selectertype;
};

/**
 * 実数で色を選択した場合に、どのように色を補完するか選択する
 * @param {SIData.interpolationtype} iptype
 * @returns {undefined}
 */
SIData.prototype.setInterPolation = function(iptype) {
	this.iptype	= iptype;
	if(iptype === SIData.interpolationtype.NEAREST_NEIGHBOR) {
		this.ipfunc	= SIColor.ipLerp;
		this.ipn	= 1;
	}
	else if(iptype === SIData.interpolationtype.BILINEAR) {
		this.ipfunc = SIColor.ipLerp;
		this.ipn	= 2;
	}
	else if(iptype === SIData.interpolationtype.COSINE) {
		this.ipfunc = SIColor.ipCosine;
		this.ipn	= 2;
	}
	else if(iptype === SIData.interpolationtype.HERMITE4_3) {
		this.ipfunc = SIColor.ipHermite2p3;
		this.ipn	= 2;
	}
	else if(iptype === SIData.interpolationtype.HERMITE4_5) {
		this.ipfunc = SIColor.ipHermite2p5;
		this.ipn	= 2;
	}
	else if(iptype === SIData.interpolationtype.HERMITE16) {
		this.ipfunc = SIColor.ipHermite4p;
		this.ipn	= 4;
	}
	else if(iptype === SIData.interpolationtype.BICUBIC) {
		this.ipfunc = SIColor.ipBicubicSoft;
		this.ipn	= 16;
	}
	else if(iptype === SIData.interpolationtype.BICUBIC_SOFT) {
		this.ipfunc = SIColor.ipBicubicSoft;
		this.ipn	= 16;
	}
	else if(iptype === SIData.interpolationtype.BICUBIC_NORMAL) {
		this.ipfunc = SIColor.ipBicubicNormal;
		this.ipn	= 16;
	}
	else if(iptype === SIData.interpolationtype.BICUBIC_SHARP) {
		this.ipfunc = SIColor.ipBicubicSharp;
		this.ipn	= 16;
	}
};

/**
 * 実数で色を選択した場合に、どのように色を補完するか取得する
 * @returns {SIData.interpolationtype}
 */
SIData.prototype.getInterPolation = function() {
	return this.iptype;
};

/**
 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
 * @param {SIData.brendtype} _blendtype
 * @returns {undefined}
 */
SIData.prototype.setBlendType = function(_blendtype) {
	this._blendtype = _blendtype;
	if(_blendtype === SIData.brendtype.NONE) {
		this.blendfunc = SIColor.brendNone;
	}
	else if(_blendtype === SIData.brendtype.ALPHA) {
		this.blendfunc = SIColor.brendAlpha;
	}
	else if(_blendtype === SIData.brendtype.ADD) {
		this.blendfunc = SIColor.brendAdd;
	}
	else if(_blendtype === SIData.brendtype.SUB) {
		this.blendfunc = SIColor.brendSub;
	}
	else if(_blendtype === SIData.brendtype.REVSUB) {
		this.blendfunc = SIColor.brendRevSub;
	}
	else if(_blendtype === SIData.brendtype.MUL) {
		this.blendfunc = SIColor.brendMul;
	}
};

/**
 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか取得する
 * @returns {SIData.brendtype}
 */
SIData.prototype.getBlendType = function() {
	return this._blendtype;
};

/**
 * データのサイズを変更します。ただし、変更後が中身が初期化されます。
 * 以前と同一の画像の場合は初期化されません。
 * @param {type} width
 * @param {type} height
 * @returns {undefined}
 */
SIData.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		this.selecter.setSize(width, height);
		return;
	}
	this.width	= width;
	this.height	= height;
	this.selecter.setSize(width, height);
	this.data	= new Uint8ClampedArray(this.width * this.height * 4);
};

/**
 * 中身をクリアします。
 * @returns {undefined}
 */
SIData.prototype.clear = function() {
	if(this.data) {
		this.data.fill(0);
	}
};


/**
 * x と y の座標にある色を取得する。
 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
 * @param {number} x
 * @param {number} y
 * @returns {SIColorRGBA}
 */
SIData.prototype.getPixelInside = function(x, y) {
	var p = (y * this.width + x) * 4;
	var c = new SIColorRGBA([
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
SIData.prototype.setPixelInside = function(x, y, color) {
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
 * @returns {SIColor}
 */
SIData.prototype.getPixel = function(x, y) {
	var p = this.selecter.getPixelPosition(x, y);
	if(p) {
		return this.getPixelInside(p[0], p[1]);
	}
	return null;
};

/**
 * x と y の座標にある色を設定する。
 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
 * @param {type} x
 * @param {type} y
 * @param {type} color
 * @returns {undefined}
 */
SIData.prototype.setPixel = function(x, y, color) {
	var p = this.selecter.getPixelPosition(x, y);
	if(p) {
		if(this._blendtype === SIData.brendtype.NONE) {
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
 * @returns {SIColor}
 */
SIData.prototype.getColor = function(x, y) {
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
 * @returns {SIColor}
 */
SIData.prototype.getColorUV = function(u, v) {
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
SIData.prototype.setColor = function(x, y, color) {
	this.setPixel(Math.floor(x), Math.floor(y), color);
};


/**
 * Canvas型の drawImage と同じ使用方法で SIData をドローする
 * SIDataRGBA データの上には、SIDataRGBA のみ書き込み可能
 * SIDataY    データの上には、SIDataY    のみ書き込み可能
 * @param {SIData} image
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
SIData.prototype.drawSIData = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	if(!(image instanceof SIData)) {
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
 * @param {function} func func(x, y, newcolor) 実行したいコールバック関数
 * @returns {undefined}
 */
SIData.prototype.each = function(func) {
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = func(x, y, this.getPixelInside(x, y));
			this.setPixelInside(x, y, newcolor);
		}
	}
};
var SIDataRGBA = function() {
	SIData.prototype._init.call(this);
	if(arguments.length === 1) {
		var image = arguments[0];
		this.putImageData(image);
	}
	else if(arguments.length === 2) {
		var width  = arguments[0];
		var height = arguments[1];
		SIData.prototype.setSize.call(this, width, height);
	}
};
SIDataRGBA.prototype = new SIData();
SIDataRGBA.prototype.clone = function() {
	var x = new SIDataRGBA(this.width, this.height);
	this._copyData(x);
	return x;
};
SIDataRGBA.prototype.putDataY = function(imagedata, n) {
	if(!(imagedata instanceof SIDataY)) {
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
SIDataRGBA.prototype.putDataYToR = function(imagedata) {
	this.putDataS(imagedata, 0);
};
SIDataRGBA.prototype.putDataYToG = function(imagedata) {
	this.putDataS(imagedata, 1);
};
SIDataRGBA.prototype.putDataYToB = function(imagedata) {
	this.putDataS(imagedata, 2);
};
SIDataRGBA.prototype.putDataYToA = function(imagedata) {
	this.putDataS(imagedata, 3);
};
SIDataRGBA.prototype.putImageData = function(imagedata) {
	if(	(imagedata instanceof ImageData) ||
		(imagedata instanceof SIDataRGBA)) {
		this.setSize(imagedata.width, imagedata.height);
		this.data.set(imagedata.data);
	}
	else if(imagedata instanceof SIDataY) {
		this.putImageData(imagedata.getImageData());
	}
	else {
		throw "IllegalArgumentException";
	}
};
SIDataRGBA.prototype.getImageData = function() {
	var canvas, context;
	canvas = document.createElement("canvas");
	canvas.width  = this.width;
	canvas.height = this.height;
	context = canvas.getContext("2d");
	var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
	imagedata.data.set(this.data);
	return imagedata;
};
SIDataRGBA.prototype.grayscale = function() {
	this.each(function(x, y, color) {
		var luminance = 
			  0.2126 * color.rgba[0]
			+ 0.7152 * color.rgba[1]
			+ 0.0722 * color.rgba[2];
		luminance = ~~luminance;
		return new SIColorRGBA(
			[luminance, luminance, luminance, color.rgba[3]]
		);
	});
};
var SIDataY = function() {
	SIData.prototype._init.call(this);
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
SIDataY.prototype = new SIData();
SIDataY.prototype.clone = function() {
	var x = new SIDataY(this.width, this.height);
	this._copyData(x);
	return x;
};
SIDataY.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		return;
	}
	this.width	= width;
	this.height	= height;
	this.selecter.setSize(width, height);
	this.data	= new Float32Array(this.width * this.height);
};
SIDataY.prototype.getPixelInside = function(x, y) {
	var p = y * this.width + x;
	return new SIColorY(this.data[p]);
};
SIDataY.prototype.setPixelInside = function(x, y, color) {
	var p = y * this.width + x;
	this.data[p]     = color.getColor();
};
SIDataY.prototype.putImageData = function(imagedata, n) {
	if(	(imagedata instanceof ImageData) ||
		(imagedata instanceof SIDataRGBA)) {
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
	else if(imagedata instanceof SIDataY) {
		this.setSize(imagedata.width, imagedata.height);
		this.data.set(imagedata.data);
	}
	else {
		throw "IllegalArgumentException";
	}
};
SIDataY.prototype.putImageDataR = function(imagedata) {
	this.putImageData(imagedata, 0);
};
SIDataY.prototype.putImageDataG = function(imagedata) {
	this.putImageData(imagedata, 1);
};
SIDataY.prototype.putImageDataB = function(imagedata) {
	this.putImageData(imagedata, 2);
};
SIDataY.prototype.putImageDataA = function(imagedata) {
	this.putImageData(imagedata, 3);
};
SIDataY.prototype.getImageData = function() {
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

