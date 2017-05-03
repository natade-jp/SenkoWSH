/* global System */

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
var SIPColor = function(color) {
	this.rgba = color;
};
SIPColor.prototype.clone = function() {
	return new SIPColor(this.rgba);
};
SIPColor.prototype.addScalar = function(x) {
	var color = this.clone();
	color.rgba[0] += x;
	color.rgba[1] += x;
	color.rgba[2] += x;
	color.rgba[3] += x;
	return color;
};
SIPColor.prototype.addVector = function(v) {
	var color = this.clone();
	color.rgba[0] += v[0];
	color.rgba[1] += v[1];
	color.rgba[2] += v[2];
	color.rgba[3] += v[3];
	return color;
};
SIPColor.prototype.mulScalar = function(x) {
	var color = this.clone();
	color.rgba[0] *= x;
	color.rgba[1] *= x;
	color.rgba[2] *= x;
	color.rgba[3] *= x;
	return color;
};
SIPColor.prototype.mulVector = function(v) {
	var color = this.clone();
	color.rgba[0] *= v[0];
	color.rgba[1] *= v[1];
	color.rgba[2] *= v[2];
	color.rgba[3] *= v[3];
	return color;
};
SIPColor.prototype.mulMatrix = function(m) {
	var color = new SIPColor();
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
SIPColor.prototype.max = function(c) {
	var color = this.clone();
	color.rgba[0] = Math.max(c.color[0], this.rgba[0]);
	color.rgba[1] = Math.max(c.color[1], this.rgba[1]);
	color.rgba[2] = Math.max(c.color[2], this.rgba[2]);
	color.rgba[3] = Math.max(c.color[3], this.rgba[3]);
	return color;
};
SIPColor.prototype.min = function(c) {
	var color = this.clone();
	color.rgba[0] = Math.min(c.color[0], this.rgba[0]);
	color.rgba[1] = Math.min(c.color[1], this.rgba[1]);
	color.rgba[2] = Math.min(c.color[2], this.rgba[2]);
	color.rgba[3] = Math.min(c.color[3], this.rgba[3]);
	return color;
};

/**
 * /////////////////////////////////////////////////////////
 * 実際に、指定した部分の色を取得するクラス
 * 必ず、xとyは中に納まることを保証すること
 * /////////////////////////////////////////////////////////
 */
var SIPColorPicker = function() {
};
SIPColorPicker.prototype.getColor = function(x, y) {
	return new SIPColor(0, 0, 0, 0);
};
var SIPColorPickerContext = function(context) {
	this.super		= SIPColorPicker.prototype;
	this.context	= context;
};
SIPColorPickerContext.prototype = new SIPColorPicker();
SIPColorPickerContext.prototype.getColor = function(x, y) {
	var p = this.context.getImageData( x, y, 1, 1 ).data;
	return new SIPColor([p[0], p[1], p[2], p[3]]);
};
var SIPColorPickerImageData = function(imagedata, width, height) {
	this.super		= SIPColorPicker.prototype;
	this.imagedata	= imagedata;
	this.width		= width;
	this.height		= height;
};
SIPColorPickerImageData.prototype = new SIPColorPicker();
SIPColorPickerImageData.prototype.getColor = function(x, y) {
	var p = (y * width + x) * 4;
	[	this.imagedata[p],
		this.imagedata[p + 1],
		this.imagedata[p + 2],
		this.imagedata[p + 3]
	];
};
var SIPColorPickerText = function() {
	this.super		= SIPColorPicker.prototype;
};
SIPColorPickerText.prototype = new SIPColorPicker();
SIPColorPickerText.prototype.getColor = function(x, y) {
	console.log("" + x + "," + y);
};

/**
 * /////////////////////////////////////////////////////////
 * 指定した部分の色を取得するクラス
 * xとyは中に納まらなくてもよいが、離散値を使用すること
 * /////////////////////////////////////////////////////////
 */

var SIPPixelSelecter = function() {
};
SIPPixelSelecter.prototype._init = function(picker, width, height) {
	if(!(picker instanceof SIPColorPicker)) {
		throw "IllegalArgumentException";
	}
	this.picker= picker;
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
		return new SIPColor(0, 0, 0, 0);
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

var a = new SIPColorPickerText();
var b = new SIPPixelSelecterRepeat(a, 320, 320);
