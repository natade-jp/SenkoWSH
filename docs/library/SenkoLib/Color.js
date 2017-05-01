/**
 * Color.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  CC0					(http://sciencecommons.jp/cc0/about)
 *
 * DEPENDENT LIBRARIES:
 *  なし
 */

// 色を扱うクラス
//
// 【参考】
// HSV色空間 / HLS色空間
// https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93
// https://ja.wikipedia.org/wiki/HLS%E8%89%B2%E7%A9%BA%E9%96%93


var Color = function() {
	// 中身は 0 ~ 1に正規化した値とする
	this.r = 0.0;
	this.g = 0.0;
	this.b = 0.0;
	this.a = 1.0;
};

Color.prototype.clone = function() {
	var color = new Color();
	color.r = this.r;
	color.g = this.g;
	color.b = this.b;
	color.a = this.a;
	return color;
};

Color._flact = function(x) {
	return(x - Math.floor(x));
};

Color._hex = function(x) {
	var x = Math.round(x * 255.0).toString(16);
	if(x.length === 1) {
		return "0" + x;
	}
	else {
		return x;
	}
};

Color.prototype._setRGB = function(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	if(a) this.a = a;
	return this;
};

Color.prototype._setHSV = function(h, s, v, a) {
	var i, f;
	
	this.r = v;
	this.g = v;
	this.b = v;
	if(a) this.a = a;
	
	if(s > 0.0) {
		h *= 6.0;
		i = ~~Math.floor(h);
		f = h - i;
		if(i === 0) {
			this.g *= 1.0 - s * (1.0 - f);
			this.b *= 1.0 - s;
		}
		else if(i === 1) {
			this.r *= 1.0 - s * f;
			this.b *= 1.0 - s;
		}
		else if(i === 2) {
			this.r *= 1.0 - s;
			this.b *= 1.0 - s * (1.0 - f);
		}
		else if(i === 3) {
			this.r *= 1.0 - s;
			this.g *= 1.0 - s * f;
		}
		else if(i === 4) {
			this.r *= 1.0 - s * (1.0 - f);
			this.g *= 1.0 - s;
		}
		else if(i === 5) {
			this.g *= 1.0 - s;
			this.b *= 1.0 - s * f;
		}
	}
	return this;
};

Color.prototype._setHLS = function(h, l, s, a) {
	var i, f;
	var max, min, delta;
	
	if(a) this.a = a;
	
	if(s === 0.0) {
		this.r = 0.0;
		this.g = 0.0;
		this.b = 0.0;
		return this;
	}
	
	if(l < 0.5) {
		max = l * (1.0 + s);
	}
	else {
		max = l * (1.0 - s) + s;
	}
	min = 2.0 * l - max;
	delta = max - min;
	
	h *= 6.0;
	i = ~~Math.floor(h);
	f = h - i;
	
	if(i === 0) {
		this.r = max;
		this.g = max - delta * (1.0 - f);
		this.b = min;
	}
	else if(i === 1) {
		this.r = min + delta * (1.0 - f);
		this.g = max;
		this.b = min;
	}
	else if(i === 2) {
		this.r = min;
		this.g = max;
		this.b = max - delta * (1.0 - f);
	}
	else if(i === 3) {
		this.r = min;
		this.g = min + delta * (1.0 - f);
		this.b = max;
	}
	else if(i === 4) {
		this.r = max - delta * (1.0 - f);
		this.g = min;
		this.b = max;
	}
	else if(i === 5) {
		this.r = max;
		this.g = min;
		this.b = min + delta * (1.0 - f);
	}
	return this;
};

Color.prototype._getRGB = function() {
	return {
		r : this.r,
		g : this.g,
		b : this.b,
		a : this.a
	};
};

Color.prototype._getHSV = function() {
	var max, min, delta;
	var h, s, v;
	
	max = Math.max( this.r, this.g, this.b );
	min = Math.min( this.r, this.g, this.b );
	delta = max - min;
	
	h   = 0;
	s   = max - min;
	v   = max;
	
	if(max !== 0.0) {
		s /= max;
	}
	
	if(delta === 0.0) {
		return [h, s, v];
	}
	
	if(max === this.r) {
		h = (this.g - this.b) / delta;
		if (h < 0.0) {
			h += 6.0;
		}
	}
	else if(max === this.g) {
		h = 2.0 + (this.b - this.r) / delta;
	}
	else {
		h = 4.0 + (this.r - this.g) / delta;
	}
	h /= 6.0;
	
	return {
		h : h,
		s : s,
		v : v,
		a : this.a
	};
};

Color.prototype._getHLS = function() {
	var max, min, delta;
	var h, l, s;
	
	max   = Math.max( this.r, this.g, this.b );
	min   = Math.min( this.r, this.g, this.b );
	
	l = (max + min) * 0.5;
	delta = max - min;
	
	if(delta === 0) {
		return [0, l, 0];
	}
	
	if(l < 0.5) {
		s = delta / (max + min);
	}
	else {
		s = delta / (2.0 - max - min);
	}
	
	if(max === this.r) {
		h = (this.g - this.b) / delta;
		if (h < 0.0) {
			h += 6.0;
		}
	}
	else if(max === this.g) {
		h = 2.0 + (this.b - this.r) / delta;
	}
	else {
		h = 4.0 + (this.r - this.g) / delta;
	}
	h /= 6.0;
	
	return {
		h : h,
		l : l,
		s : s,
		a : this.a
	};
};

Color.newColorNormalizedRGB = function() {
	var r = 0.0;
	var g = 0.0;
	var b = 0.0;
	var a = 1.0;
	if(arguments.length === 1) {
		if(arguments[0].r) r = arguments[0].r;
		if(arguments[0].g) g = arguments[0].g;
		if(arguments[0].b) b = arguments[0].b;
		if(arguments[0].a) a = arguments[0].a;
		if (arguments[0].length >= 3) {
			r = arguments[0][0];
			g = arguments[0][1];
			b = arguments[0][2];
		}
		if (arguments[0].length >= 4) {
			a = arguments[0][3];
		}
	}
	else {
		if(arguments.length >= 3) {
			r = arguments[0];
			g = arguments[1];
			b = arguments[2];
		}
		if (arguments.length >= 4) {
			a = arguments[3];
		}
	}
	var color = new Color();
	color.r = Math.min(Math.max(r, 0.0), 1.0);
	color.g = Math.min(Math.max(g, 0.0), 1.0);
	color.b = Math.min(Math.max(b, 0.0), 1.0);
	color.a = Math.min(Math.max(a, 0.0), 1.0);
	return color;
};

Color.newColorRGB = function() {
	var r = 0.0;
	var g = 0.0;
	var b = 0.0;
	var a = 255.0;
	if(arguments.length >= 3) {
		r = arguments[0];
		g = arguments[1];
		b = arguments[2];
		if (arguments.length >= 4) {
			a = arguments[3];
		}
	}
	else if(arguments.length >= 1) {
		if(typeof arguments[0] === "number") {
			r = (arguments[0] >> 16) & 0xff;
			g = (arguments[0] >> 8) & 0xff;
			b =  arguments[0] & 0xff;
			if(arguments[1]) {
				a = (arguments[0] >> 24) & 0xff;
			}
		}
		else if(typeof arguments[0].length === "undefined") {
			if(arguments[0].r) r = arguments[0].r;
			if(arguments[0].g) g = arguments[0].g;
			if(arguments[0].b) b = arguments[0].b;
			if(arguments[0].a) a = arguments[0].a;
		}
		else if (arguments[0].length >= 3) {
			r = arguments[0][0];
			g = arguments[0][1];
			b = arguments[0][2];
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
	}
	var color = new Color();
	color.r = Math.min(Math.max(r / 255.0, 0.0), 1.0);
	color.g = Math.min(Math.max(g / 255.0, 0.0), 1.0);
	color.b = Math.min(Math.max(b / 255.0, 0.0), 1.0);
	color.a = Math.min(Math.max(a / 255.0, 0.0), 1.0);
	return color;
};

Color.prototype.getNormalizedRGB = function() {
	return this._getRGB();
};

Color.prototype.getRGB = function() {
	return{
		r : Math.round(this.r * 255.0),
		g : Math.round(this.g * 255.0),
		b : Math.round(this.b * 255.0),
		a : Math.round(this.a * 255.0)
	};
};

Color.prototype.getRGB24 = function() {
	return(	(Math.round(255.0 * this.r) << 16) |
			(Math.round(255.0 * this.g) << 8 ) |
			(Math.round(255.0 * this.b)      ));
};

Color.prototype.getRGB32 = function() {
	return( (Math.round(255.0 * this.a) << 24) |
			(Math.round(255.0 * this.r) << 16) |
			(Math.round(255.0 * this.g) << 8 ) |
			(Math.round(255.0 * this.b)      ));
};

Color.newColorNormalizedHSV = function() {
	var h = 0.0;
	var s = 0.0;
	var v = 0.0;
	var a = 1.0;
	if(arguments.length === 1) {
		if(arguments[0].h) h = arguments[0].h;
		if(arguments[0].s) s = arguments[0].s;
		if(arguments[0].v) v = arguments[0].v;
		if(arguments[0].a) a = arguments[0].a;
		if (arguments[0].length >= 3) {
			h = arguments[0][0];
			s = arguments[0][1];
			v = arguments[0][2];
		}
		if (arguments[0].length >= 4) {
			a = arguments[0][3];
		}
	}
	else {
		if(arguments.length >= 3) {
			h = arguments[0];
			s = arguments[1];
			v = arguments[2];
		}
		if (arguments.length >= 4) {
			a = arguments[3];
		}
	}
	s = Math.min(Math.max(s, 0.0), 1.0);
	v = Math.min(Math.max(v, 0.0), 1.0);
	a = Math.min(Math.max(a, 0.0), 1.0);
	var color = new Color();
	color._setHSV( Color._flact(h), s, v, a );
	return color;
};

Color.newColorHSV = function() {
	var h = 0.0;
	var s = 0.0;
	var v = 0.0;
	var a = 255.0;
	if(arguments.length === 1) {
		if(arguments[0].h) h = arguments[0].h;
		if(arguments[0].s) s = arguments[0].s;
		if(arguments[0].v) v = arguments[0].v;
		if(arguments[0].a) a = arguments[0].a;
		if (arguments[0].length >= 3) {
			h = arguments[0][0];
			s = arguments[0][1];
			v = arguments[0][2];
		}
		if (arguments[0].length >= 4) {
			a = arguments[0][3];
		}
	}
	else {
		if(arguments.length >= 3) {
			h = arguments[0];
			s = arguments[1];
			v = arguments[2];
		}
		if (arguments.length >= 4) {
			a = arguments[3];
		}
	}
	return Color.newColorNormalizedHSV(
		h / 360.0,
		s / 255.0,
		v / 255.0,
		a / 255.0
	);
};

Color.prototype.getNormalizedHSV = function() {
	return this._getHSV();
};

Color.prototype.getHSV = function() {
	var color = this.getNormalizedHSV();
	color.h = Math.round(color.h * 360.0);
	color.s = Math.round(color.s * 255.0);
	color.v = Math.round(color.v * 255.0);
	color.a = Math.round(color.a * 255.0);
	return color;
};

Color.newColorNormalizedHLS = function() {
	var h = 0.0;
	var l = 0.0;
	var s = 0.0;
	var a = 1.0;
	if(arguments.length === 1) {
		if(arguments[0].h) h = arguments[0].h;
		if(arguments[0].l) l = arguments[0].l;
		if(arguments[0].s) s = arguments[0].s;
		if(arguments[0].a) a = arguments[0].a;
		if (arguments[0].length >= 3) {
			h = arguments[0][0];
			l = arguments[0][1];
			s = arguments[0][2];
		}
		if (arguments[0].length >= 4) {
			a = arguments[0][3];
		}
	}
	else {
		if(arguments.length >= 3) {
			h = arguments[0];
			l = arguments[1];
			s = arguments[2];
		}
		if (arguments.length >= 4) {
			a = arguments[3];
		}
	}
	l = Math.min(Math.max(l, 0.0), 1.0);
	s = Math.min(Math.max(s, 0.0), 1.0);
	a = Math.min(Math.max(a, 0.0), 1.0);
	var color = new Color();
	color._setHLS( Color._flact(h), l, s, a );
	return color;
};

Color.newColorHLS = function() {
	var h = 0.0;
	var s = 0.0;
	var v = 0.0;
	var a = 255.0;
	if(arguments.length === 1) {
		if(arguments[0].h) h = arguments[0].h;
		if(arguments[0].l) l = arguments[0].l;
		if(arguments[0].s) s = arguments[0].s;
		if(arguments[0].a) a = arguments[0].a;
		if (arguments[0].length >= 3) {
			h = arguments[0][0];
			l = arguments[0][1];
			s = arguments[0][2];
		}
		if (arguments[0].length >= 4) {
			a = arguments[0][3];
		}
	}
	else {
		if(arguments.length >= 3) {
			h = arguments[0];
			l = arguments[1];
			s = arguments[2];
		}
		if (arguments.length >= 4) {
			a = arguments[3];
		}
	}
	return Color.newColorNormalizedHLS(
		h / 360.0,
		l / 255.0,
		s / 255.0,
		a / 255.0
	);
};

Color.prototype.getNormalizedHLS = function() {
	return this._getHLS();
};

Color.prototype.getHLS = function() {
	var color = this.getNormalizedHLS();
	color.h = Math.round(color.h * 360.0);
	color.l = Math.round(color.l * 255.0);
	color.s = Math.round(color.s * 255.0);
	color.a = Math.round(color.a * 255.0);
	return color;
};

Color.prototype.getRed = function() {
	return Math.round(this.r * 255.0);
};

Color.prototype.getGreen = function() {
	return Math.round(this.g * 255.0);
};

Color.prototype.getBlue = function() {
	return Math.round(this.b * 255.0);
};

Color.prototype.getAlpha = function() {
	return Math.round(this.b * 255.0);
};

Color.prototype.brighter = function() {
	var FACTOR = 1.0 / 0.7;
	var color = new Color();
	color.r = Math.min( this.r * FACTOR, 1.0);
	color.g = Math.min( this.g * FACTOR, 1.0);
	color.b = Math.min( this.b * FACTOR, 1.0);
	color.a = this.a;
	return color;
};

Color.prototype.darker = function() {
	var FACTOR = 0.7;
	var color = new Color();
	color.r = Math.max( this.r * FACTOR, 0.0);
	color.g = Math.max( this.g * FACTOR, 0.0);
	color.b = Math.max( this.b * FACTOR, 0.0);
	color.a = this.a;
	return color;
};

Color.prototype.getCSSHex = function() {
	if(this.a === 1.0) {
		return "#" +
			Color._hex(this.r) + 
			Color._hex(this.g) +
			Color._hex(this.b);
	}
	else {
		return "#" +
			Color._hex(this.a) + 
			Color._hex(this.r) + 
			Color._hex(this.g) +
			Color._hex(this.b);
	}
};

Color.prototype.getCSS255 = function() {
	if(this.a === 1.0) {
		return "rgb(" +
		Math.round(this.r * 255) + "," +
		Math.round(this.g * 255) + "," +
		Math.round(this.b * 255) + ")";
	}
	else {
		return "rgba(" +
		Math.round(this.r * 255) + "," +
		Math.round(this.g * 255) + "," +
		Math.round(this.b * 255) + "," +
		this.a + ")";
	}
};

Color.prototype.getCSSPercent = function() {
	if(this.a === 1.0) {
		return "rgb(" +
		Math.round(this.r * 100) + "%," +
		Math.round(this.g * 100) + "%," +
		Math.round(this.b * 100) + "%)";
	}
	else {
		return "rgba(" +
		Math.round(this.r * 100) + "%," +
		Math.round(this.g * 100) + "%," +
		Math.round(this.b * 100) + "%," +
		Math.round(this.a * 100) + "%)";
	}
};

Color.prototype.toString = function() {
	return	"Color[" +
			this.getCSSHex() + ", " +
			this.getCSS255() + ", " +
			this.getCSSPercent() + "]";
};

Color.white			= Color.newColorRGB(0xffffff);
Color.lightGray		= Color.newColorRGB(0xd3d3d3);
Color.gray			= Color.newColorRGB(0x808080);
Color.darkGray		= Color.newColorRGB(0xa9a9a9);
Color.black			= Color.newColorRGB(0x000000);
Color.red			= Color.newColorRGB(0xff0000);
Color.pink			= Color.newColorRGB(0xffc0cb);
Color.orange		= Color.newColorRGB(0xffa500);
Color.yellow		= Color.newColorRGB(0xffff00);
Color.green			= Color.newColorRGB(0x008000);
Color.magenta		= Color.newColorRGB(0xff00ff);
Color.cyan			= Color.newColorRGB(0x00ffff);
Color.blue			= Color.newColorRGB(0x0000ff);

Color.WHITE			= Color.white;
Color.LIGHT_GRAY	= Color.lightGray;
Color.GRAY			= Color.gray;
Color.DARK_GRAY		= Color.darkGray;
Color.RED			= Color.red;
Color.PINK			= Color.pink;
Color.ORANGE		= Color.orange;
Color.YELLOW		= Color.yellow;
Color.GREEN			= Color.green;
Color.MAGENTA		= Color.magenta;
Color.CYAN			= Color.cyan;
Color.BLUE			= Color.blue;
