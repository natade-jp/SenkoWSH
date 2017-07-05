"use strict";
﻿
/* global System, ImageData, SIData, SIColor */

﻿/**
 * SenkoLib SIFIR.js
 *  画像処理ライブラリの畳込みによるFIRフィルタがメインです。
 *  オレンジビューアのソースコードを参考に作成しています。
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 * 
 * DEPENDENT LIBRARIES:
 *  SImageProcessing.js
 */


/*
 * /////////////////////////////////////////////////////////
 * フィルタ用クラス
 * /////////////////////////////////////////////////////////
 */

/**
 * 画像処理に使用する配列
 * @param {type} matrix 2次元配列
 * @returns {SIFIRMatrix}
 */
var SIFIRMatrix = function(matrix) {
	this.height = matrix.length;
	this.width  = matrix[0].length;
	this.matrix = [];
	var i;
	for(i = 0; i < matrix.length; i++) {
		this.matrix[i] = matrix[i].slice();
	}
};
SIFIRMatrix.prototype.clone = function() {
	return new SIFIRMatrix(this.matrix);
};
SIFIRMatrix.prototype.rotateEdge = function(val) {
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
SIFIRMatrix.prototype.mul = function(val) {
	var m = this.clone();
	var x, y;
	for(y = 0; y < m.height; y++) {
		for(x = 0; x < m.width; x++) {
			m.matrix[y][x] *= val;
		}
	}
	return m;
};
SIFIRMatrix.prototype.sum = function() {
	var sum = 0;
	var x, y;
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			sum += this.matrix[y][x];
		}
	}
	return sum;
};
SIFIRMatrix.prototype.normalize = function() {
	return this.clone().mul(1.0 / this.sum());
};
SIFIRMatrix.prototype.addCenter = function(val) {
	var m = this.clone();
	m.matrix[m.height >> 1][m.width >> 1] += val;
	return m;
};
SIFIRMatrix.makeLaplacianFilter = function() {
	return new SIFIRMatrix([
		[ 0.0, -1.0, 0.0],
		[-1.0,  4.0,-1.0],
		[ 0.0, -1.0, 0.0]
	]);
};
SIFIRMatrix.makeSharpenFilter = function(power) {
	var m = SIFIRMatrix.makeLaplacianFilter();
	return m.mul(power).addCenter(1.0);
};
SIFIRMatrix.makeBlur = function(width, height) {
	var m = [];
	var value = 1.0 / (width * height);
	var x, y;
	for(y = 0; y < height; y++) {
		m[y] = [];
		for(x = 0; x < width; x++) {
			m[y][x] = value;
		}
	}
	return new SIFIRMatrix(m);
};
SIFIRMatrix.makeGaussianFilter = function(width, height, sd) {
	if(sd === undefined) {
		sd = 1.0;
	}
	var m = [];
	var i, x, y;
	var v = [];
	var n = Math.max(width, height);
	var s = - Math.floor(n / 2);
	for(i = 0; i < n; i++, s++) {
		v[i] = Math.exp( - (s * s) / ((sd * sd) * 2.0) );
	}
	for(y = 0; y < height; y++) {
		m[y] = [];
		for(x = 0; x < width; x++) {
			m[y][x] = v[x] * v[y];
		}
	}
	return new SIFIRMatrix(m).normalize();
};

SIFIRMatrix.makeCircle = function(r) {
	var m = [];
	var radius	= r * 0.5;
	var center	= r >> 1;
	var x, y;
	for(y = 0; y < r; y++) {
		m[y] = [];
		for(x = 0; x < r; x++) {
			if (Math.sqrt(	(center - x) * (center - x) +
							(center - y) * (center - y)) < radius) {
				m[y][x] = 1.0;
			}
			else {
				m[y][x] = 0.0;
			}
		}
	}
	return new SIFIRMatrix(m).normalize();
};

/**
 * SIFIRMatrix を使用して畳込みを行う
 * @param {SIFIRMatrix} matrix
 * @returns {undefined}
 */
SIData.prototype.convolution = function(matrix) {
	if(!(matrix instanceof SIFIRMatrix)) {
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

/**
 * SIFIRMatrix を使用してバイラテラルフィルタ的な畳込みを行う
 * 対象の色に近いほど、フィルタをかける処理となる
 * @param {SIFIRMatrix} matrix
 * @param {number} p 0.0～1.0 強度
 * @returns {undefined}
 */
SIData.prototype.convolutionBilateral = function(matrix, p) {
	if(!(matrix instanceof SIFIRMatrix)) {
		throw "IllegalArgumentException";
	}
	if(p === undefined) {
		p = 0.8;
	}
	var x, y, fx, fy, mx, my;
	var fx_offset	= - (matrix.width  >> 1);
	var fy_offset	= - (matrix.height >> 1);
	var m			= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	// -0.010 - -0.001
	var rate = - (1.0 - p) * 0.01 - 0.001;
	var exptable = [];
	for(x = 0; x < 256 * 3; x++) {
		exptable[x] = Math.exp(x * x * rate);
	}
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var thiscolor = bufferimage.getPixel(x, y);
			var thisalpha = thiscolor.getBlendAlpha();
			var sumfilter = 0;
			var newcolor  = zero_color;
			var m2 = [];
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				m2[my] = [];
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var tgtcolor = bufferimage.getPixel(fx, fy);
					if(!tgtcolor) {
						continue;
					}
					var newfilter = exptable[Math.floor(tgtcolor.normColor(thiscolor, SIColor.normType.Eugrid))] * m[my][mx];
					newcolor = newcolor.addColor(tgtcolor.mul(newfilter));
					sumfilter += newfilter;
				}
			}
			newcolor = newcolor.div(sumfilter).setBlendAlpha(thisalpha);
			this.setPixelInside(x, y, newcolor);
		}
	}
};

/**
 * SIFIRMatrix を使用して指数関数空間で畳込みを行う
 * @param {SIFIRMatrix} matrix
 * @param {number} e 底(1.01-1.2)
 * @returns {undefined}
 */
SIData.prototype.convolutionExp = function(matrix, e) {
	if(!(matrix instanceof SIFIRMatrix)) {
		throw "IllegalArgumentException";
	}
	if(e === undefined) {
		e = 1.2;
	}
	var x, y, fx, fy, mx, my;
	var fx_offset	= - (matrix.width  >> 1);
	var fy_offset	= - (matrix.height >> 1);
	var m			= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	var exptable = [];
	for(x = 0; x < 256; x++) {
		exptable[x] = Math.pow(e, x);
	}
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = zero_color;
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var color = bufferimage.getPixel(fx, fy);
					if(color) {
						newcolor = newcolor.addColor(color.table(exptable).mul(m[my][mx]));
					}
				}
			}
			this.setPixelInside(x, y, newcolor.baselog(e));
		}
	}
};

/**
 * SIFIRMatrix を使用してアンシャープ畳込みを行う
 * @param {SIFIRMatrix} matrix
 * @param {type} rate
 * @returns {undefined}
 */
SIData.prototype.convolutionUnSharp = function(matrix, rate) {
	if(!(matrix instanceof SIFIRMatrix)) {
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
			var thiscolor = bufferimage.getPixel(x, y);
			var deltaColor = thiscolor.subColor(newcolor).mul(rate);
			this.setPixelInside(x, y, thiscolor.addColor(deltaColor));
		}
	}
};


/**
 * シャープフィルタ
 * @param {number} power 強度
 * @returns {undefined}
 */
SIData.prototype.filterSharp = function(power) {
	var m = SIFIRMatrix.makeSharpenFilter(power);
	this.convolution(m);
};

/**
 * ブラーフィルタ
 * @param {number} n 口径
 * @returns {undefined}
 */
SIData.prototype.filterBlur = function(n) {
	var m = SIFIRMatrix.makeBlur(n, 1);
	this.convolution(m);
	var m = SIFIRMatrix.makeBlur(1, n);
	this.convolution(m);
};

/**
 * ガウシアンフィルタ
 * @param {number} n 口径
 * @returns {undefined}
 */
SIData.prototype.filterGaussian = function(n) {
	var m = SIFIRMatrix.makeGaussianFilter(n, 1);
	this.convolution(m);
	var m = SIFIRMatrix.makeGaussianFilter(1, n);
	this.convolution(m);
};

/**
 * アンシャープ
 * @param {number} n 口径
 * @param {number} rate
 * @returns {undefined}
 */
SIData.prototype.filterUnSharp = function(n, rate) {
	var m = SIFIRMatrix.makeGaussianFilter(n, n);
	this.convolutionUnSharp(m, rate);
};

/**
 * バイラテラルフィルタ
 * @param {number} n 口径
 * @param {number} p 0.0～1.0 強度
 * @returns {undefined}
 */
SIData.prototype.filterBilateral = function(n, p) {
	var m = SIFIRMatrix.makeGaussianFilter(n, n);
	this.convolutionBilateral(m, p);
};

/**
 * レンズフィルタ
 * @param {type} n 口径
 * @param {type} e 底(1.01-1.2)
 * @returns {undefined}
 */
SIData.prototype.filterSoftLens = function(n, e) {
	var m = SIFIRMatrix.makeCircle(n);
	this.convolutionExp(m, e);
};

