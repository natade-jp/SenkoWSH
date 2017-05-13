/* global System, ImageData */

﻿/**
 * SImageProcessing.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  CC0					(http://sciencecommons.jp/cc0/about)
 *
 * DEPENDENT LIBRARIES:
 */

/**
 * /////////////////////////////////////////////////////////
 * 色クラス
 * /////////////////////////////////////////////////////////
 */
var SIPColor = function() {
};
SIPColor.prototype.getColor = function() {
	return null;
};
SIPColor.prototype.clone = function() {
	return null;
};
SIPColor.prototype.zero = function() {
	return null;
};
SIPColor.prototype.one = function() {
	return null;
};
SIPColor.prototype.add = function() {
	return null;
};
SIPColor.prototype.sub = function() {
	return null;
};
SIPColor.prototype.addColor = function() {
	return null;
};
SIPColor.prototype.subColor = function() {
	return null;
};
SIPColor.prototype.mulColor = function() {
	return null;
};
SIPColor.prototype.mul = function() {
	return null;
};
SIPColor.prototype.div = function() {
	return null;
};
SIPColor.prototype.max = function() {
	return null;
};
SIPColor.prototype.min = function() {
	return null;
};
SIPColor.prototype.getBlendAlpha = function() {
	return null;
};
SIPColor.prototype.setBlendAlpha = function() {
	return null;
};
SIPColor.ipLerp = function(v0, v1, x) {
	var delta = v1.subColor(v0);
	return v0.addColor(delta.mul(x));
};
SIPColor.ipCosine = function(v0, v1, x) {
	return SIPColor.ipLerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
};
SIPColor.ipHermite2p3 = function(v0, v1, x) {
	return SIPColor.ipLerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
};
SIPColor.ipHermite2p5 = function(v0, v1, x) {
	return SIPColor.ipLerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
};
SIPColor.ipHermite4p = function(v0, v1, v2, v3, x) {
	var P = v3.subColor(v2).subColor(v0.subColor(v1));
	var Q = v0.subColor(v1).subColor(P);
	var R = v2.subColor(v0);
	var S = v1;
	return  P.mul(x * x * x).addColor(Q.mul(x * x)).addColor(R.mul(x)).addColor(S);
};
SIPColor.funcInBicubic = function(d, a) {
	if(d <= 1.0) {
		return 1.0 - ((a + 3.0) * d * d) + ((a + 2.0) * d * d * d);
	}
	else {
		return (-4.0 * a) + (8.0 * a * d) - (5.0 * a * d * d) + (a * d * d * d);
	}
};
SIPColor.ipBicubic = function(va, nx, ny, a) {
	var output = va[0][0].zero();
	var x, y, y_weight, weight, sum = 0.0;
	for(y = 0; y < 4; y++) {
		y_weight = SIPColor.funcInBicubic(Math.abs(- ny + y - 1), a);
		for(x = 0; x < 4; x++) {
			weight  = SIPColor.funcInBicubic(Math.abs(- nx + x - 1), a);
			weight *= y_weight;
			sum    += weight;
			output = output.addColor(va[y][x].mul(weight));
		}
	}
	output = output.mul(1.0 / sum);
	return output;
};
SIPColor.ipBicubicSoft = function(va, nx, ny) {
	return SIPColor.ipBicubic(va, nx, ny, -0.5);
};
SIPColor.ipBicubicNormal = function(va, nx, ny) {
	return SIPColor.ipBicubic(va, nx, ny, -1.0);
};
SIPColor.ipBicubicSharp = function(va, nx, ny) {
	return SIPColor.ipBicubic(va, nx, ny, -1.2);
};
SIPColor.brendNone = function(x, y) {
	return y;
};
SIPColor.brendAlpha = function(x, y) {
	var x_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha();
	x = SIPColor.ipLerp(x, y, y_alpha);
	return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
};
SIPColor.brendAdd = function(x, y) {
	var x_alpha = x.getBlendAlpha();
	var y_alpha = y.getBlendAlpha();
	x = x.addColor(y.mul(y_alpha));
	return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
};
SIPColor.brendSub = function(x, y) {
	var alpha = x.getBlendAlpha();
	x = x.subColor(y.mul(y.getBlendAlpha()));
	return x.setBlendAlpha(alpha);
};
SIPColor.brendRevSub = function(x, y) {
	var alpha = y.getBlendAlpha();
	y = y.subColor(x.mul(x.getBlendAlpha()));
	return y.setBlendAlpha(alpha);
};
SIPColor.brendMul = function(x, y) {
	var alpha = x.getBlendAlpha();
	x = x.mulColor(y.mul(y.getBlendAlpha()).div(255.0));
	return x.setBlendAlpha(alpha);
};

var SIPColorS = function(color) {
	this.x = color;
};
SIPColorS.prototype = new SIPColor();
SIPColorS.prototype.getColor = function() {
	return this.x;
};
SIPColorS.prototype.clone = function() {
	return new SIPColorS(this.x);
};
SIPColorS.prototype.zero = function() {
	return new SIPColorS(0.0);
};
SIPColorS.prototype.one = function() {
	return new SIPColorS(1.0);
};
SIPColorS.prototype.add = function(x) {
	var color = this.clone();
	color.x += x;
	return color;
};
SIPColorS.prototype.sub = function(x) {
	var color = this.clone();
	color.x -= x;
	return color;
};
SIPColorS.prototype.addColor = function(c) {
	var color = this.clone();
	color.x += c.x;
	return color;
};
SIPColorS.prototype.subColor = function(c) {
	var color = this.clone();
	color.x -= c.x;
	return color;
};
SIPColorS.prototype.mulColor = function(c) {
	var color = this.clone();
	color.x *= c.x;
	return color;
};
SIPColorS.prototype.mul = function(x) {
	var color = this.clone();
	color.x *= x;
	return color;
};
SIPColorS.prototype.div = function(x) {
	var color = this.clone();
	color.x /= x;
	return color;
};
SIPColorS.prototype.max = function(c) {
	var color = this.clone();
	color.x = Math.max(c.x, this.x);
	return color;
};
SIPColorS.prototype.min = function(c) {
	var color = this.clone();
	color.x = Math.min(c.x, this.x);
	return color;
};
SIPColorS.prototype.getBlendAlpha = function() {
	return 1.0;
};
SIPColorS.prototype.setBlendAlpha = function() {
	return this.clone();
};
SIPColorS.prototype.toString = function() {
	return "color(" + this.x + ")";
};
var SIPColorRGBA = function(color) {
	// ディープコピー
	this.rgba = [color[0], color[1], color[2], color[3]];
};
SIPColorRGBA.prototype = new SIPColor();
SIPColorRGBA.prototype.getColor = function() {
	return this.rgba;
};
SIPColorRGBA.prototype.clone = function() {
	return new SIPColorRGBA(this.rgba);
};
SIPColorRGBA.prototype.zero = function() {
	return new SIPColorRGBA([0.0, 0.0, 0.0, 0.0]);
};
SIPColorRGBA.prototype.one = function() {
	return new SIPColorRGBA([1.0, 1.0, 1.0, 1.0]);
};
SIPColorRGBA.prototype.add = function(x) {
	var color = this.clone();
	color.rgba[0] += x;	color.rgba[1] += x;
	color.rgba[2] += x;	color.rgba[3] += x;
	return color;
};
SIPColorRGBA.prototype.sub = function(x) {
	var color = this.clone();
	color.rgba[0] -= x;	color.rgba[1] -= x;
	color.rgba[2] -= x;	color.rgba[3] -= x;
	return color;
};
SIPColorRGBA.prototype.addColor = function(c) {
	var color = this.clone();
	color.rgba[0] += c.rgba[0];	color.rgba[1] += c.rgba[1];
	color.rgba[2] += c.rgba[2];	color.rgba[3] += c.rgba[3];
	return color;
};
SIPColorRGBA.prototype.subColor = function(c) {
	var color = this.clone();
	color.rgba[0] -= c.rgba[0];	color.rgba[1] -= c.rgba[1];
	color.rgba[2] -= c.rgba[2];	color.rgba[3] -= c.rgba[3];
	return color;
};
SIPColorRGBA.prototype.mulColor = function(c) {
	var color = this.clone();
	color.rgba[0] *= c.rgba[0];	color.rgba[1] *= c.rgba[1];
	color.rgba[2] *= c.rgba[2];	color.rgba[3] *= c.rgba[3];
	return color;
};
SIPColorRGBA.prototype.addVector = function(v) {
	var color = this.clone();
	color.rgba[0] += v[0];	color.rgba[1] += v[1];
	color.rgba[2] += v[2];	color.rgba[3] += v[3];
	return color;
};
SIPColorRGBA.prototype.subVector = function(v) {
	var color = this.clone();
	color.rgba[0] -= v[0];	color.rgba[1] -= v[1];
	color.rgba[2] -= v[2];	color.rgba[3] -= v[3];
	return color;
};
SIPColorRGBA.prototype.mul = function(x) {
	var color = this.clone();
	color.rgba[0] *= x;	color.rgba[1] *= x;
	color.rgba[2] *= x;	color.rgba[3] *= x;
	return color;
};
SIPColorRGBA.prototype.mulVector = function(v) {
	var color = this.clone();
	color.rgba[0] *= v[0];	color.rgba[1] *= v[1];
	color.rgba[2] *= v[2];	color.rgba[3] *= v[3];
	return color;
};
SIPColorRGBA.prototype.mulMatrix = function(m) {
	var color = new SIPColorRGBA();
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
SIPColorRGBA.prototype.div = function(x) {
	var color = this.clone();
	color.rgba[0] /= x;	color.rgba[1] /= x;
	color.rgba[2] /= x;	color.rgba[3] /= x;
	return color;
};
SIPColorRGBA.prototype.divVector = function(v) {
	var color = this.clone();
	color.rgba[0] /= v[0];	color.rgba[1] /= v[1];
	color.rgba[2] /= v[2];	color.rgba[3] /= v[3];
	return color;
};
SIPColorRGBA.prototype.max = function(c) {
	var color = this.clone();
	color.rgba[0] = Math.max(c.color[0], this.rgba[0]);
	color.rgba[1] = Math.max(c.color[1], this.rgba[1]);
	color.rgba[2] = Math.max(c.color[2], this.rgba[2]);
	color.rgba[3] = Math.max(c.color[3], this.rgba[3]);
	return color;
};
SIPColorRGBA.prototype.min = function(c) {
	var color = this.clone();
	color.rgba[0] = Math.min(c.color[0], this.rgba[0]);
	color.rgba[1] = Math.min(c.color[1], this.rgba[1]);
	color.rgba[2] = Math.min(c.color[2], this.rgba[2]);
	color.rgba[3] = Math.min(c.color[3], this.rgba[3]);
	return color;
};
SIPColorRGBA.prototype.getBlendAlpha = function() {
	return this.rgba[3] / 255.0;
};
SIPColorRGBA.prototype.setBlendAlpha = function(x) {
	var color = this.clone();
	color.rgba[3] = x * 255.0;
	return color;
};
SIPColorRGBA.prototype.toString = function() {
	return "color(" + this.rgba[0] + "," + this.rgba[1] + "," + this.rgba[2] + "," + this.rgba[3] + ")";
};

/**
 * /////////////////////////////////////////////////////////
 * 指定した部分の色を取得するクラス
 * xとyは中に納まらなくてもよいが、離散値を使用すること
 * 
 * SIPPixelSelecterNormal はみでた色は null
 * SIPPixelSelecterFill   はみでた色は最も近い位置の色にする
 * SIPPixelSelecterRepeat はみでた色は反対側の方向から取得する
 * /////////////////////////////////////////////////////////
 */
var SIPPixelSelecter = function() {
};
SIPPixelSelecter.prototype._init = function(width, height) {
	this.setSize(width, height);
};
SIPPixelSelecter.prototype.clone = function() {
	var func = this.getPixelPosition;
	var x = new SIPPixelSelecter();
	x._init(this.width, this.height);
	x.getPixelPosition = func;
	return x;
};
SIPPixelSelecter.prototype.setSize = function(width, height) {
	this.width  = width;
	this.height = height;
};
SIPPixelSelecter.prototype.getPixelPosition = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return [x, y];
	}
	else {
		return null;
	}
};
var SIPPixelSelecterInside = function(width, height) {
	SIPPixelSelecter.prototype._init.call(this, width, height);
};
SIPPixelSelecterInside.prototype = new SIPPixelSelecter();
var SIPPixelSelecterFill = function(width, height) {
	SIPPixelSelecter.prototype._init.call(this, width, height);
};
SIPPixelSelecterFill.prototype = new SIPPixelSelecter();
SIPPixelSelecterFill.prototype.getPixelPosition = function(x, y) {
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
var SIPPixelSelecterRepeat = function(width, height) {
	SIPPixelSelecter.prototype._init.call(this, width, height);
};
SIPPixelSelecterRepeat.prototype = new SIPPixelSelecter();
SIPPixelSelecterRepeat.prototype.getPixelPosition = function(x, y) {
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

/*
 * /////////////////////////////////////////////////////////
 * フィルタ用クラス
 * /////////////////////////////////////////////////////////
 */
var SIPMatrix = function(matrix) {
	this.height = matrix.length;
	this.width  = matrix[0].length;
	this.matrix = [];
	var i;
	for(i = 0; i < matrix.length; i++) {
		this.matrix[i] = matrix[i].slice();
	}
};
SIPMatrix.prototype.clone = function() {
	return new SIPMatrix(this.matrix);
};
SIPMatrix.prototype.rotateEdge = function(val) {
	// 周囲の値を時計回りに回転させます。
	var m = this.clone();
	
	var x = [], y = [], i, j;
	{
		// 上側
		for(i = 0;i < this.width - 1; i++) {
			x.push(m.matrix[0][i]);
		}
		// 右側
		for(i = 0;i < this.height - 1; i++) {
			x.push(m.matrix[i][this.width - 1]);
		}
		// 下側
		for(i = this.width - 1;i > 0; i--) {
			x.push(m.matrix[this.height - 1][i]);
		}
		// 左側
		for(i = this.height - 1;i > 0; i--) {
			x.push(m.matrix[i][0]);
		}
	}
	for(i = 0;i < x.length; i++) {
		// かならず正とする
		y[i] = x[((i + val) % x.length + x.length) % x.length];
	}
	{
		// 上側
		m.matrix[0] = y.slice(0, this.width);
		// 右側
		for(i = 0;i < this.height; i++) {
			m.matrix[i][this.width - 1] = y[this.width + i];
		}
		// 下側
		m.matrix[this.height - 1] = y.slice(
			this.width + this.height - 2,
			this.width + this.height - 2 + this.width ).reverse();
		// 左側
		for(i = this.height - 1, j = 0;i > 0; i--, j++) {
			m.matrix[i][0] = y[this.width + this.height + this.width - 3 + j];
		}
	}
	return m;
};
SIPMatrix.prototype.mul = function(val) {
	var m = this.clone();
	var x, y;
	for(y = 0; y < m.height; y++) {
		for(x = 0; x < m.width; x++) {
			m.matrix[y][x] *= val;
		}
	}
	return m;
};
SIPMatrix.prototype.sum = function() {
	var sum = 0;
	var x, y;
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			sum += this.matrix[y][x];
		}
	}
	return sum;
};
SIPMatrix.prototype.normalize = function() {
	return this.clone().mul(1.0 / this.sum());
};
SIPMatrix.prototype.addCenter = function(val) {
	var m = this.clone();
	m.matrix[m.height >> 1][m.width >> 1] += val;
	return m;
};
SIPMatrix.makeLaplacianFilter = function() {
	return new SIPMatrix([
		[ 0.0, -1.0, 0.0],
		[-1.0,  4.0,-1.0],
		[ 0.0, -1.0, 0.0]
	]);
};
SIPMatrix.makeSharpenFilter = function(power) {
	var m = SIPMatrix.makeLaplacianFilter();
	return m.mul(power).addCenter(1.0);
};
SIPMatrix.makeBlur = function(width, height) {
	var m = [];
	var value = 1.0 / (width * height);
	var x, y;
	for(y = 0; y < height; y++) {
		m[y] = [];
		for(x = 0; x < width; x++) {
			m[y][x] = value;
		}
	}
	return new SIPMatrix(m);
};
SIPMatrix.makeGaussianFilter = function(width, height, sd) {
	if(!sd) {
		sd = 1.0;
	}
	var m = [];
	var i, x, y;
	var v = [];
	var n = Math.max(width, height);
	var s = - Math.floor(n / 2);
	for(i = 0; i < n; i++, s++) {
		v[i] = Math.exp( - s / ((sd * sd) * 2.0) );
	}
	for(y = 0; y < height; y++) {
		m[y] = [];
		for(x = 0; x < width; x++) {
			m[y][x] = v[x] * v[y];
		}
	}
	return new SIPMatrix(m).normalize();
};


/**
 * /////////////////////////////////////////////////////////
 * 画像データクラス
 * SIPDataRGBA   32bit整数 0xRRGGBBAA で管理
 * SIPDataS 32bit浮動小数点で管理
 * /////////////////////////////////////////////////////////
 */

var SIPData = function() {
};
SIPData.selectertype = {
	INSIDE : "INSIDE",
	FILL   : "FILL",
	REPEAT : "REPEAT"
};
SIPData.interpolationtype = {
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

SIPData.brendtype = {
	NONE				: "NONE",
	ALPHA				: "ALPHA",
	ADD					: "ADD",
	SUB					: "SUB",
	REVSUB				: "REVSUB",
	MUL					: "MUL"
};

SIPData.prototype._init = function() {
	this.setSelecter(SIPData.selectertype.INSIDE);
	this.setInterPolation(SIPData.interpolationtype.NEAREST_NEIGHBOR);
	this.setBlendType(SIPData.brendtype.NONE);
};
SIPData.prototype.clone = function() {
	var x = new SIPData();
	x.setSelecter(this.getSelecter());
	x.setInterPolation(this.getInterPolation());
	x.setBlendType(this.getBlendType());
	x.setSize(this.width, this.height);
	x.data.set(this.data);
	return x;
};
SIPData.prototype.setSelecter = function(_selectertype) {
	this._selectertype = _selectertype;
	if(_selectertype === SIPData.selectertype.INSIDE) {
		this.selecter = new SIPPixelSelecterInside(this.width, this.height);
	}
	else if(_selectertype === SIPData.selectertype.FILL) {
		this.selecter = new SIPPixelSelecterFill(this.width, this.height);
	}
	else if(_selectertype === SIPData.selectertype.REPEAT) {
		this.selecter = new SIPPixelSelecterRepeat(this.width, this.height);
	}
};
SIPData.prototype.getSelecter = function() {
	return this._selectertype;
};
SIPData.prototype.setInterPolation = function(iptype) {
	this.iptype	= iptype;
	if(iptype === SIPData.interpolationtype.NEAREST_NEIGHBOR) {
		this.ipfunc	= SIPColor.ipLerp;
		this.ipn	= 1;
	}
	else if(iptype === SIPData.interpolationtype.BILINEAR) {
		this.ipfunc = SIPColor.ipLerp;
		this.ipn	= 2;
	}
	else if(iptype === SIPData.interpolationtype.COSINE) {
		this.ipfunc = SIPColor.ipCosine;
		this.ipn	= 2;
	}
	else if(iptype === SIPData.interpolationtype.HERMITE4_3) {
		this.ipfunc = SIPColor.ipHermite2p3;
		this.ipn	= 2;
	}
	else if(iptype === SIPData.interpolationtype.HERMITE4_5) {
		this.ipfunc = SIPColor.ipHermite2p5;
		this.ipn	= 2;
	}
	else if(iptype === SIPData.interpolationtype.HERMITE16) {
		this.ipfunc = SIPColor.ipHermite4p;
		this.ipn	= 4;
	}
	else if(iptype === SIPData.interpolationtype.BICUBIC) {
		this.ipfunc = SIPColor.ipBicubicSoft;
		this.ipn	= 16;
	}
	else if(iptype === SIPData.interpolationtype.BICUBIC_SOFT) {
		this.ipfunc = SIPColor.ipBicubicSoft;
		this.ipn	= 16;
	}
	else if(iptype === SIPData.interpolationtype.BICUBIC_NORMAL) {
		this.ipfunc = SIPColor.ipBicubicNormal;
		this.ipn	= 16;
	}
	else if(iptype === SIPData.interpolationtype.BICUBIC_SHARP) {
		this.ipfunc = SIPColor.ipBicubicSharp;
		this.ipn	= 16;
	}
};
SIPData.prototype.getInterPolation = function() {
	return this.iptype;
};
SIPData.prototype.setBlendType = function(_blendtype) {
	this._blendtype = _blendtype;
	if(_blendtype === SIPData.brendtype.NONE) {
		this.blendfunc = SIPColor.brendNone;
	}
	else if(_blendtype === SIPData.brendtype.ALPHA) {
		this.blendfunc = SIPColor.brendAlpha;
	}
	else if(_blendtype === SIPData.brendtype.ADD) {
		this.blendfunc = SIPColor.brendAdd;
	}
	else if(_blendtype === SIPData.brendtype.SUB) {
		this.blendfunc = SIPColor.brendSub;
	}
	else if(_blendtype === SIPData.brendtype.REVSUB) {
		this.blendfunc = SIPColor.brendRevSub;
	}
	else if(_blendtype === SIPData.brendtype.MUL) {
		this.blendfunc = SIPColor.brendMul;
	}
};
SIPData.prototype.getBlendType = function() {
	return this._blendtype;
};
SIPData.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		this.selecter.setSize(width, height);
		return;
	}
	this.width	= width;
	this.height	= height;
	this.selecter.setSize(width, height);
	this.data	= new Uint8ClampedArray(this.width * this.height * 4);
};
SIPData.prototype.clear = function() {
	if(this.data) {
		this.data.fill(0);
	}
};

SIPData.prototype.convolution = function(matrix) {
	if(!(matrix instanceof SIPMatrix)) {
		throw "IllegalArgumentException";
	}
	var x, y, fx, fy, mx, my;
	var fx_offset	= - (matrix.width  >> 1);
	var fy_offset	= - (matrix.height >> 1);
	var m			= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = zero_color;
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var color = bufferimage.getPixel(fx, fy);
					if(color) {
						newcolor = newcolor.addColor(color.mul(m[my][mx]));
					}
				}
			}
			this.setPixelInside(x, y, newcolor);
		}
	}
};

// PixelInside 系のメソッドは、x, y が整数かつ画像の範囲内を保証している場合に使用可能

SIPData.prototype.getPixelInside = function(x, y) {
	var p = (y * this.width + x) * 4;
	var c = new SIPColorRGBA([
		this.data[p],
		this.data[p + 1],
		this.data[p + 2],
		this.data[p + 3]
	]);
	return c;
};
SIPData.prototype.setPixelInside = function(x, y, color) {
	var p = (y * this.width + x) * 4;
	this.data[p]     = color.getColor()[0];
	this.data[p + 1] = color.getColor()[1];
	this.data[p + 2] = color.getColor()[2];
	this.data[p + 3] = color.getColor()[3];
};

// Pixel 系のメソッドは、x, y が整数かつ画像の範囲内を保証していない場合に使用可能

SIPData.prototype.getPixel = function(x, y) {
	var p = this.selecter.getPixelPosition(x, y);
	if(p) {
		return this.getPixelInside(p[0], p[1]);
	}
	return null;
};
SIPData.prototype.setPixel = function(x, y, color) {
	var p = this.selecter.getPixelPosition(x, y);
	if(p) {
		if(this._blendtype === SIPData.brendtype.NONE) {
			this.setPixelInside(p[0], p[1], color);
		}
		else {
			var mycolor = this.getPixelInside(p[0], p[1]);
			var newcolor = this.blendfunc(mycolor, color);
			this.setPixelInside(p[0], p[1], newcolor);
		}
	}
};

// Color 系のメソッドは、x, y が実数かつ画像の範囲内を保証していない場合に使用可能

SIPData.prototype.getColor = function(x, y) {
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
SIPData.prototype.setColor = function(x, y, color) {
	this.setPixel(Math.floor(x), Math.floor(y), color);
};

// drawImage と同じ使用方法で SIPData をドローする
// RGBA データの上には、RGBA のみ書き込み可能
// スカラーデータの上には、スカラーのみ書き込み可能

SIPData.prototype.drawSIPData = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	if(!(image instanceof SIPData)) {
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
	for(dst_y = dy; dst_y < (dy + dw); dst_y++) {
		src_x = sx;
		for(dst_x = dx; dst_x < (dx + dh); dst_x++) {
			var color = image.getColor(src_x, src_y);
			if(color) {
				this.setColor(dst_x, dst_y, color);
			}
			src_x += delta_w;
		}
		src_y += delta_h;
	}
};

// 全画素に指定した関数の操作を行う

SIPData.prototype.each = function(func) {
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = func(x, y, this.getPixelInside(x, y));
			this.setPixelInside(x, y, newcolor);
		}
	}
};
var SIPDataRGBA = function() {
	SIPData.prototype._init.call(this);
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
SIPDataRGBA.prototype = new SIPData();
SIPDataRGBA.prototype.putDataS = function(imagedata, n) {
	if(!(imagedata instanceof SIPDataS)) {
		throw "IllegalArgumentException";
	}
	this.setSize(imagedata.width, imagedata.height);
	if(!n) {
		n = 0;
	}
	var p = 0, i = 0;
	for(; i < imagedata.data.length; i++) {
		this.data[p + n] = Math.floor(imagedata.data[i]);
		p += 4;
	}
};
SIPDataRGBA.prototype.putDataSToR = function(imagedata) {
	this.putDataS(imagedata, 0);
};
SIPDataRGBA.prototype.putDataSToG = function(imagedata) {
	this.putDataS(imagedata, 1);
};
SIPDataRGBA.prototype.putDataSToB = function(imagedata) {
	this.putDataS(imagedata, 2);
};
SIPDataRGBA.prototype.putDataSToA = function(imagedata) {
	this.putDataS(imagedata, 3);
};
SIPDataRGBA.prototype.putImageData = function(imagedata) {
	if(	(imagedata instanceof ImageData) ||
		(imagedata instanceof SIPDataRGBA)) {
		this.setSize(imagedata.width, imagedata.height);
		this.data.set(imagedata.data);
	}
	else if(imagedata instanceof SIPDataS) {
		this.putImageData(imagedata.getImageData());
	}
	else {
		throw "IllegalArgumentException";
	}
};
SIPDataRGBA.prototype.getImageData = function() {
	var canvas, context;
	canvas = document.createElement("canvas");
	canvas.width  = this.width;
	canvas.height = this.height;
	context = canvas.getContext("2d");
	var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
	imagedata.data.set(this.data);
	return imagedata;
};

var SIPDataS = function() {
	SIPData.prototype._init.call(this);
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
SIPDataS.prototype = new SIPData();
SIPDataS.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		return;
	}
	this.width	= width;
	this.height	= height;
	this.selecter.setSize(width, height);
	this.data	= new Float32Array(this.width * this.height);
};
SIPDataS.prototype.getPixelInside = function(x, y) {
	var p = y * this.width + x;
	return new SIPColorS(this.data[p]);
};
SIPDataS.prototype.setPixelInside = function(x, y, color) {
	var p = y * this.width + x;
	this.data[p]     = color.getColor();
};
SIPDataS.prototype.putImageData = function(imagedata, n) {
	if(	(imagedata instanceof ImageData) ||
		(imagedata instanceof SIPDataRGBA)) {
		this.setSize(imagedata.width, imagedata.height);
		if(!n) {
			n = 0;
		}
		var p = 0, i = 0;
		for(; i < this.data.length; i++) {
			this.data[i] = imagedata.data[p + n];
			p += 4;
		}
	}
	else if(imagedata instanceof SIPDataS) {
		this.setSize(imagedata.width, imagedata.height);
		this.data.set(imagedata.data);
	}
	else {
		throw "IllegalArgumentException";
	}
};
SIPDataS.prototype.putImageDataR = function(imagedata) {
	this.putImageData(imagedata, 0);
};
SIPDataS.prototype.putImageDataG = function(imagedata) {
	this.putImageData(imagedata, 1);
};
SIPDataS.prototype.putImageDataB = function(imagedata) {
	this.putImageData(imagedata, 2);
};
SIPDataS.prototype.putImageDataA = function(imagedata) {
	this.putImageData(imagedata, 3);
};
SIPDataS.prototype.getImageData = function() {
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
