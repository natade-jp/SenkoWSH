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
SIPColor.prototype.one = function() {
	return null;
};
SIPColor.prototype.add = function() {
	return null;
};
SIPColor.prototype.sub = function() {
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
SIPColor.lerp = function(v0, v1, x) {
	var delta = v1.sub(v0);
	return v0.add(delta.mul(x));
};
SIPColor.lerpCosine = function(v0, v1, x) {
	return this.lerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
};
SIPColor.lerpHermitian2p3 = function(v0, v1, x) {
	return this.lerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
};
SIPColor.lerpHermitian2p5 = function(v0, v1, x) {
	return this.lerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
};
SIPColor.lerpHermitian4p = function(v0, v1, v2, v3, x) {
	var P = v3.sub(v2).sub(v0.sub(v1));
	var Q = v0.sub(v1).sub(P);
	var R = v2.sub(v0);
	var S = v1;
	return  P.mul(x * x * x).add(Q.mul(x * x)).add(R.mul(x)).add(S);
};
var SIPColorScalar = function(color) {
	this.x = color;
};
SIPColorScalar.prototype = new SIPColor();
SIPColorScalar.prototype.getColor = function() {
	return this.x;
};
SIPColorScalar.prototype.clone = function() {
	return new SIPColorScalar(this.x);
};
SIPColorScalar.prototype.one = function() {
	return new SIPColorScalar(1.0);
};
SIPColorScalar.prototype.add = function(x) {
	var color = this.clone();
	color.x += x;
	return color;
};
SIPColorScalar.prototype.sub = function(x) {
	var color = this.clone();
	color.x -= x;
	return color;
};
SIPColorScalar.prototype.mul = function(x) {
	var color = this.clone();
	color.x *= x;
	return color;
};
SIPColorScalar.prototype.div = function(x) {
	var color = this.clone();
	color.x /= x;
	return color;
};
SIPColorScalar.prototype.max = function(c) {
	var color = this.clone();
	color.x = Math.max(c.x, this.x);
	return color;
};
SIPColorScalar.prototype.min = function(c) {
	var color = this.clone();
	color.x = Math.min(c.x, this.x);
	return color;
};
var SIPColorRGBA = function(color) {
	this.rgba = color;
};
SIPColorRGBA.prototype = new SIPColor();
SIPColorRGBA.prototype.getColor = function() {
	return this.rgba;
};
SIPColorRGBA.prototype.clone = function() {
	return new SIPColorRGBA(this.rgba);
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
SIPPixelSelecter.prototype._init = function(picker, width, height) {
	this.setPicker(picker);
	this.setSize(width, height);
};
SIPPixelSelecter.prototype.setPicker = function(picker) {
	this.picker= picker;
};
SIPPixelSelecter.prototype.setSize = function(width, height) {
	this.width  = width;
	this.height = height;
};
SIPPixelSelecter.prototype.getColor = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return this.picker.getColor(x, y);
	}
	else {
		return null;
	}
};
var SIPPixelSelecterNormal = function(picker, width, height) {
	SIPPixelSelecter.prototype._init.call(this, picker, width, height);
};
SIPPixelSelecterNormal.prototype = new SIPPixelSelecter();
var SIPPixelSelecterFill = function(picker, width, height) {
	SIPPixelSelecter.prototype._init.call(this, picker, width, height);
};
SIPPixelSelecterFill.prototype = new SIPPixelSelecter();
SIPPixelSelecterFill.prototype.getColor = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return this.picker.getColor(x, y);
	}
	// はみ出た場合は中にむりやり収める
	x = ~~Math.floor(Math.min(Math.max(0, x), this.width));
	y = ~~Math.floor(Math.min(Math.max(0, y), this.height));
	return this.picker.getColor(x, y);
};

var SIPPixelSelecterRepeat = function(picker, width, height) {
	SIPPixelSelecter.prototype._init.call(this, picker, width, height);
};
SIPPixelSelecterRepeat.prototype = new SIPPixelSelecter();
SIPPixelSelecterRepeat.prototype.getColor = function(x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return this.picker.getColor(x, y);
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
	return this.picker.getColor(x, y);
};

/**
 * /////////////////////////////////////////////////////////
 * 画像データクラス
 * SIPDataRGBA   32bit整数 0xRRGGBBAA で管理
 * SIPDataScalar 32bit浮動小数点で管理
 * /////////////////////////////////////////////////////////
 */

var SIPData = function() {
};
SIPData.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		return;
	}
	this.width	= width;
	this.height	= height;
	this.data	= new Uint8ClampedArray(this.width * this.height);
};
SIPData.prototype.clear = function() {
	if(this.data) {
		this.data.fill(0);
	}
};
SIPData.prototype.getColor = function(x, y) {
	var p = (y * this.width + x) * 4;
	return new SIPColorRGBA([
		this.data[p],
		this.data[p + 1],
		this.data[p + 2],
		this.data[p + 3]
	]);
};
SIPData.prototype.setColor = function(x, y, color) {
	var p = (y * this.width + x) * 4;
	this.data[p]     = color.getColor()[0];
	this.data[p + 1] = color.getColor()[1];
	this.data[p + 2] = color.getColor()[2];
	this.data[p + 3] = color.getColor()[3];
};
SIPData.prototype.each = function(func) {
	var x = 0, y = 0;
	for(; y < height; y++) {
		for(x = 0; x < width; x++) {
			this.setColor(x, y, func(this.getColor(x, y)));
		}
	}
};
var SIPDataRGBA = function() {
};
SIPDataRGBA.prototype = new SIPData();
SIPDataRGBA.prototype.putDataScalar = function(imagedata, n) {
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
SIPDataRGBA.prototype.putDataScalarR = function(imagedata) {
	this.putDataScalar(imagedata, 0);
};
SIPDataRGBA.prototype.putDataScalarG = function(imagedata) {
	this.putDataScalar(imagedata, 1);
};
SIPDataRGBA.prototype.putDataScalarB = function(imagedata) {
	this.putDataScalar(imagedata, 2);
};
SIPDataRGBA.prototype.putDataScalarA = function(imagedata) {
	this.putDataScalar(imagedata, 3);
};
SIPDataRGBA.prototype.putImageData = function(imagedata) {
	this.width	= imagedata.width;
	this.height	= imagedata.height;
	this.data   = new Uint8ClampedArray(imagedata.data);
	this.data.set(imagedata.data);
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

var SIPDataScalar = function() {
};
SIPDataScalar.prototype = new SIPData();
SIPDataScalar.prototype.setSize = function(width, height) {
	if((this.width === width) && (this.height === height)) {
		return;
	}
	this.width	= width;
	this.height	= height;
	this.data	= new Float32Array(this.width * this.height);
};
SIPDataScalar.prototype.getColor = function(x, y) {
	var p = y * this.width + x;
	return new SIPColorScalar(this.data[p]);
};
SIPDataScalar.prototype.setColor = function(x, y, color) {
	var p = y * this.width + x;
	this.data[p]     = color.getColor();
};
SIPDataScalar.prototype.putImageData = function(imagedata, n) {
	this.setSize(imagedata.width, imagedata.height);
	if(!n) {
		n = 0;
	}
	var p = 0, i = 0;
	for(; i < this.data.length; i++) {
		this.data[i] = imagedata.data[p + n];
		p += 4;
	}
};
SIPDataScalar.prototype.putImageDataR = function(imagedata) {
	this.putImageData(imagedata, 0);
};
SIPDataScalar.prototype.putImageDataG = function(imagedata) {
	this.putImageData(imagedata, 1);
};
SIPDataScalar.prototype.putImageDataB = function(imagedata) {
	this.putImageData(imagedata, 2);
};
SIPDataScalar.prototype.putImageDataA = function(imagedata) {
	this.putImageData(imagedata, 3);
};
SIPDataScalar.prototype.getImageData = function() {
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

/**
 * /////////////////////////////////////////////////////////
 * 画像処理用クラス
 * /////////////////////////////////////////////////////////
 */

SImageProcessing = function(context, width, height) {
	this.context	= context;
	this.width		= width;
	this.height		= height;
	this.imagedata	= null;
};
SImageProcessing.prototype.setEdgeMode = function(edgemode) {
	this.edgemode = edgemode;
};
SImageProcessing.prototype.setUseBuffer = function(isusebuffer) {
	if(isusebuffer === true) {
		this.imagedata = this.context.getImageData(0, 0, width, height).data;
	}
	if(isusebuffer === false) {
		if(this.imagedata !== null) {
			this.context.putImageData(this.imagedata, 0, 0);
			this.imagedata = null;
		}
	}
};
