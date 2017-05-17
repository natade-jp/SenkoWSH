/* global System, ImageData */

﻿/**
 * SIMatrix.js
 *  マトリックスとマトリックスを使用する処理を集めました。
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
 * 先に、SIMatrix.js が必要です。
 */


/*
 * /////////////////////////////////////////////////////////
 * フィルタ用クラス
 * /////////////////////////////////////////////////////////
 */
var SIMatrix = function(matrix) {
	this.height = matrix.length;
	this.width  = matrix[0].length;
	this.matrix = [];
	var i;
	for(i = 0; i < matrix.length; i++) {
		this.matrix[i] = matrix[i].slice();
	}
};
SIMatrix.prototype.clone = function() {
	return new SIMatrix(this.matrix);
};
SIMatrix.prototype.rotateEdge = function(val) {
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
SIMatrix.prototype.mul = function(val) {
	var m = this.clone();
	var x, y;
	for(y = 0; y < m.height; y++) {
		for(x = 0; x < m.width; x++) {
			m.matrix[y][x] *= val;
		}
	}
	return m;
};
SIMatrix.prototype.sum = function() {
	var sum = 0;
	var x, y;
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			sum += this.matrix[y][x];
		}
	}
	return sum;
};
SIMatrix.prototype.normalize = function() {
	return this.clone().mul(1.0 / this.sum());
};
SIMatrix.prototype.addCenter = function(val) {
	var m = this.clone();
	m.matrix[m.height >> 1][m.width >> 1] += val;
	return m;
};
SIMatrix.makeLaplacianFilter = function() {
	return new SIMatrix([
		[ 0.0, -1.0, 0.0],
		[-1.0,  4.0,-1.0],
		[ 0.0, -1.0, 0.0]
	]);
};
SIMatrix.makeSharpenFilter = function(power) {
	var m = SIMatrix.makeLaplacianFilter();
	return m.mul(power).addCenter(1.0);
};
SIMatrix.makeBlur = function(width, height) {
	var m = [];
	var value = 1.0 / (width * height);
	var x, y;
	for(y = 0; y < height; y++) {
		m[y] = [];
		for(x = 0; x < width; x++) {
			m[y][x] = value;
		}
	}
	return new SIMatrix(m);
};
SIMatrix.makeGaussianFilter = function(width, height, sd) {
	if(!sd) {
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
	return new SIMatrix(m).normalize();
};


SIData.prototype.convolution = function(matrix) {
	if(!(matrix instanceof SIMatrix)) {
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

SIData.prototype.convolutionBilateral = function(matrix, p) {
	if(!(matrix instanceof SIMatrix)) {
		throw "IllegalArgumentException";
	}
	if(!p) {
		p = 1.0;
	}
	var x, y, fx, fy, mx, my;
	var fx_offset	= - (matrix.width  >> 1);
	var fy_offset	= - (matrix.height >> 1);
	var m			= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	var rate = - (1.001 - p) * 3.0; // -3.003 ～ -0.003 大きいほど強度高い
	var exptable = [];
	for(x = 0; x < 256 * 3; x++) {
		exptable[x] = Math.exp(x * x * rate);
	}
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var thiscolor = bufferimage.getPixel(x, y);
			var thisalpha = thiscolor.getBlendAlpha();
			var sumcolor  = zero_color;
			var newcolor  = zero_color;
			m2 = [];
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				m2[my] = [];
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var tgtcolor = bufferimage.getPixel(fx, fy);
					if(!tgtcolor) {
						continue;
					}
					var delta = tgtcolor.subColor(thiscolor);
					delta     = delta.mulColor(delta);
					newfilter = exptable[Math.floor(delta.normManhattan())] * m[my][mx];
					newcolor = newcolor.addColor(tgtcolor.mul(newfilter));
					sumcolor = sumcolor.addColor(newfilter);
				}
			}
			newcolor = newcolor.divColor(sumcolor).setBlendAlpha(thisalpha);
			this.setPixelInside(x, y, newcolor);
		}
	}
};
