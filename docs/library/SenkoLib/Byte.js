/**
 * Byte.js
 * 
 * VERSION:
 *  0.06
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  NYSL Version 0.9982 / The MIT License の Multi-licensing
 *  NYSL Version 0.9982 http://www.kmonos.net/nysl/
 *  The MIT License https://ja.osdn.net/projects/opensource/wiki/licenses%2FMIT_license
 *
 * HISTORY:
 *  2013/06/04 - v0.01 - natade - first release
 *  2013/06/27 - v0.02 - natade - bug fix  bitのoffsetが誤っていた
 *  2013/08/24 - v0.03 - natade - change   NYSL Version 0.9982 -> TRIPLE LICENSE
 *  2013/09/15 - v0.04 - natade -  ビット長取得のgetBitLengthを追加, getBitを最適化
 *                       cloneとコンストラクタ追加
 *                       setLengthのメモリ削減の方法にバグがあったのを修正
 *  2013/11/07 - v0.05 - natade - JavaScript Lint による修正
 *  2013/11/10 - v0.06 - natade - HTML5のDataViewに近いことが分かったため、構文を似せた。
 *                       いずれ、DataViewに切り換えしやすいように名前を変更するかもしれません。
 *
 * DEPENDENT LIBRARIES:
 *  なし
 */

var Byte = function() {
	this.clear();
	// DataView
	if((arguments.length >= 1) && (arguments[0] instanceof Byte)) {
		var bin = arguments[0];
		if(arguments.length === 1) {
			for(var i = 0; i < bin.element.length; i++) {
				this.element[i] = bin.element[i];
			}
			this.size = bin.size;
		}
		else {
			var byteOffset = arguments[1];
			var byteLength = bin.size - byteOffset;
			if(arguments.length === 3) {
				byteLength = arguments[2];
			}
			this.malloc(byteLength);
			for(var i = 0, j = byteOffset; i < byteLength; i++, j++) {
				this.setByteValue(i, bin.getByteValue(j));
			}
		}
	}
};

Byte.prototype.clear = function() {
	this.element     = [];
	this.size        = 0;
	this.is_array    = function(value) {
		return(
			value &&
			typeof value === "object" &&
			typeof value.length === "function" &&
			typeof value.splice === "function" &&
			!(value.propertyIsEnumerable("length"))	);
	};
};

Byte.prototype.clone = function() {
	var x = new Byte();
	for(var i = 0; i < this.element.length; i++) {
		x.element[i] = this.element[i];
	}
	x.size = this.size;
	return(x);
};

Byte.prototype.isBufferOver = function(size) {
	var elementsize = this.element.length * 4;
	if(elementsize >= size) {
		return(false);
	}
	else {
		return(true);
	}
};

Byte.prototype.getLength = function() {
	return(this.size);		
};

Byte.prototype.setLength = function(size) {
	if(this.size === size) {
		return;
	}
	else if(this.size < size) {
		//メモリを追加確保する
		var elementsize = this.element.length << 2;
		if(elementsize < size) {
			// 追加サイズ
			// (size - elementsize)が0なら0バイト、1～4なら1バイト 5～なら2バイト使用する
			// 値に1を引いた後に4の倍数の整数値にして、4で割って1を足す
			var addsize = (((size - elementsize - 1) & 0xFFFFFFFC) >>> 2) + 1;
			for(var i = 0;i < addsize;i++) {
				this.element[this.element.length] = 0;
			}
		}
	}
	else {
		//メモリを削減する
		var offset = size >>> 2;
		if(offset < this.element.length) {
			// 削除サイズ
			this.element.splice(offset, this.element.length - offset);
		}
	}
	this.size = size;
};

// メモリの確保が必要なら確保する
Byte.prototype.malloc = function(size) {
	if(this.size < size) {
		this.setLength(size);
	}
};

Byte.prototype.setByte = function(offset, value) {
	if(typeof value === "number") {
		this.setByteValue(offset, value);
	}
	else if(typeof value === "string") {
		this.setByteString(offset, value);
	}
	else if(this.is_array(value)) {
		this.setByteArray(offset, value);
	}
};

Byte.prototype.setByteValue = function(offset, value) {
	if(offset >= this.size) {
		this.setLength(offset + 1);
	}
	// よく使用する関数のため最適化
	var bit  = offset & 0x03;
	offset >>= 2;
	if(bit === 0) {
		this.element[offset] &= 0xFFFFFF00;

	}
	else if(bit === 1) {
		this.element[offset] &= 0xFFFF00FF;

	}
	else if(bit === 2) {
		this.element[offset] &= 0xFF00FFFF;

	}
	else {
		this.element[offset] &= 0x00FFFFFF;
	}
	this.element[offset] |= value << (bit << 3);
};

Byte.prototype.setByteArray = function(offset, value) {
	this.malloc(offset + value.length);
	for(var i = 0;i < value.length;i++) {
		this.setByteValue(offset++, value[i]);
	}
};

Byte.prototype.setByteString = function(offset, value) {
	var size = value.length / 2;
	this.malloc(offset + size);
	for(var i = 0;i < size;i++) {
		this.setByteValue(offset++, parseInt(value.substring(i * 2, i * 2 + 2), 16));
	}
};

Byte.prototype.getByte = function(offset) {
	var bit  = offset & 0x03;
	offset >>= 2;
	return((this.element[offset] >>> (bit << 3)) & 0xFF);
};

Byte.prototype.setBit = function(offset_byte, offset_bit, bit) {
	offset_byte  = offset_byte + (offset_bit >>> 3);	// offset_bitが8以上の場合を想定する
	offset_bit  &= 0x07;		// 下位3ビット
	offset_bit  = bit << offset_bit;	// 注目するビットの位置を立たせる
	var x = this.getByte(offset_byte);
	x &= ~offset_bit;
	x |= offset_bit;
	this.setByteValue(offset_byte, x);
};

Byte.prototype.getBit = function(offset_byte, offset_bit) {
	offset_byte  = (offset_byte + (offset_bit >>> 3)) >>> 2;
	return((this.element[offset_byte] >>> (offset_bit & 0x1F)) & 1);
};

Byte.prototype.getBitLength = function() {
	var output = 0;
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !== 0) {
			var x = this.element[i];
			for(var j = 31; j >= 0; j--) {
				if(((x >>> j) & 1) !== 0) {
					return(i * 32 + j + 1);
				}
			}
		}
	}
	return(0);
};

Byte.prototype.getFile = function(filename) {
	var stream;
	var text;
	var adTypeText = 2;
	var adReadAll = -1;
	var charset = "iso-8859-1";
	var map = {
		0x20AC	:	0x80	,	//	8364	128
		0x201A	:	0x82	,	//	8218	130
		0x0192	:	0x83	,	//	402	131
		0x201E	:	0x84	,	//	8222	132
		0x2026	:	0x85	,	//	8230	133
		0x2020	:	0x86	,	//	8224	134
		0x2021	:	0x87	,	//	8225	135
		0x02C6	:	0x88	,	//	710	136
		0x2030	:	0x89	,	//	8240	137
		0x0160	:	0x8A	,	//	352	138
		0x2039	:	0x8B	,	//	8249	139
		0x0152	:	0x8C	,	//	338	140
		0x017D	:	0x8E	,	//	381	142
		0x2018	:	0x91	,	//	8216	145
		0x2019	:	0x92	,	//	8217	146
		0x201C	:	0x93	,	//	8220	147
		0x201D	:	0x94	,	//	8221	148
		0x2022	:	0x95	,	//	8226	149
		0x2013	:	0x96	,	//	8211	150
		0x2014	:	0x97	,	//	8212	151
		0x02DC	:	0x98	,	//	732	152
		0x2122	:	0x99	,	//	8482	153
		0x0161	:	0x9A	,	//	353	154
		0x203A	:	0x9B	,	//	8250	155
		0x0153	:	0x9C	,	//	339	156
		0x017E	:	0x9E	,	//	382	158
		0x0178	:	0x9F		//	376	159
	};
	stream = new ActiveXObject("ADODB.Stream");
	stream.type = adTypeText;
	stream.charset = charset;
	stream.open();
	stream.loadFromFile(filename);
	text = stream.readText(adReadAll);
	stream.close();
	this.clear();
	this.setLength(text.length);
	for(var i = 0;i < text.length;i++) {
		var x = text.charCodeAt(i);
		if(0xFF < x) {
			this.setByteValue(i, map[x]);
		}
		else {
			this.setByteValue(i, x);
		}
	}
};

Byte.prototype.setFile = function(filename) {
	var stream;
	var text = "";
	var adTypeText = 2;
	var adSaveCreateOverWrite = 2;
	var charset = "iso-8859-1";
	var buffersize = 512;
	stream = new ActiveXObject("ADODB.Stream");
	stream.type = adTypeText;
	stream.charset = charset;
	stream.open();
	for(var i = 0;i < this.size;) {
		text = [];
		for(var j = 0;(j < buffersize) && (i < this.size);j++, i++) {
			text[j] = String.fromCharCode(this.getByte(i));
		}
		stream.writeText(text.join(""));
	}
	stream.saveToFile(filename, adSaveCreateOverWrite);
	stream.close();
};

// 非推奨
Byte.prototype.setUnsignedChar = function(offset, data) {
	this.setByteValue(offset, data);
};

// 非推奨
Byte.prototype.getUnsignedChar = function(offset, data) {
	return(this.getByte(offset));
};

// 非推奨
Byte.prototype.setSignedChar = function(offset, data) {
	if(data < 0) {
		this.setByteValue(offset, (~(-data - 1)) & 0xFF);
	}
	else {
		this.setByteValue(offset, data);
	}
};

// 非推奨
Byte.prototype.getSignedChar = function(offset, data) {
	var x = this.getByte(offset);
	if((x & 0x80) !== 0) {
		return(- (((~x) & 0xFF) + 1));
	}
	else {
		return(x);
	}
};

// 非推奨
Byte.prototype.setBigEndianUnsignedShort = function(offset, value) {
	this.setByteValue(offset, (value >>> 8) & 0xFF );
	this.setByteValue(offset + 1, value & 0xFF );
};

// 非推奨
Byte.prototype.getBigEndianUnsignedShort = function(offset) {
	return((this.getByte(offset) << 8) | this.getByte(offset + 1));
};

// 非推奨
Byte.prototype.setBigEndianSignedShort = function(offset, value) {
	if(value < 0) {
		this.setBigEndianUnsignedShort(offset, (~(-value - 1)) & 0xFFFF);
	}
	else {
		this.setBigEndianUnsignedShort(offset, value);
	}
};

// 非推奨
Byte.prototype.getBigEndianSignedShort = function(offset) {
	var x = this.getBigEndianUnsignedShort(offset);
	if((x & 0x8000) !== 0) {
		return(- (((~x) & 0xFFFF) + 1));
	}
	else {
		return(x);
	}
};

// 非推奨
Byte.prototype.setLittleEndianUnsignedShort = function(offset, value) {
	this.setByteValue(offset, value & 0xFF );
	this.setByteValue(offset + 1, (value >>> 8) & 0xFF  );
};

// 非推奨
Byte.prototype.getLittleEndianUnsignedShort = function(offset) {
	return((this.getByte(offset + 1) << 8) | this.getByte(offset));
};

// 非推奨
Byte.prototype.setLittleEndianSignedShort = function(offset, value) {
	if(value < 0) {
		this.setLittleEndianUnsignedShort(offset, (~(-value - 1)) & 0xFFFF);
	}
	else {
		this.setLittleEndianUnsignedShort(offset, value);
	}
};

// 非推奨
Byte.prototype.getLittleEndianSignedShort = function(offset) {
	var x = this.getLittleEndianUnsignedShort(offset);
	if((x & 0x8000) !== 0) {
		return(- (((~x) & 0xFFFF) + 1));
	}
	else {
		return(x);
	}
};

// 非推奨
Byte.prototype.setBigEndianUnsignedLong = function(offset, value) {
	this.setByteValue(offset,     (value >>> 24) & 0xFF );
	this.setByteValue(offset + 1, (value >>> 16) & 0xFF );
	this.setByteValue(offset + 2, (value >>>  8) & 0xFF );
	this.setByteValue(offset + 3,  value & 0xFF );
};

// 非推奨
Byte.prototype.getBigEndianUnsignedLong = function(offset) {
	return(	(this.getByte(offset    ) * 0x01000000) +
			(this.getByte(offset + 1) * 0x00010000) +
			(this.getByte(offset + 2) * 0x00000100) +
			 this.getByte(offset + 3));
};

// 非推奨
Byte.prototype.setBigEndianSignedLong = function(offset, value) {
	this.setBigEndianUnsignedLong(offset, value);
};

// 非推奨
Byte.prototype.getBigEndianSignedLong = function(offset) {
	var x = this.getBigEndianUnsignedLong(offset);
	if((x & 0x80000000) !== 0) {
		return(- ((~x) + 1));
	}
	else {
		return(x);
	}
};

// 非推奨
Byte.prototype.setLittleEndianUnsignedLong = function(offset, value) {
	this.setByteValue(offset + 3, (value >>> 24) & 0xFF );
	this.setByteValue(offset + 2, (value >>> 16) & 0xFF );
	this.setByteValue(offset + 1, (value >>>  8) & 0xFF );
	this.setByteValue(offset,  value & 0xFF );
};

// 非推奨
Byte.prototype.getLittleEndianUnsignedLong = function(offset) {
	return(	(this.getByte(offset + 3) * 0x01000000) +
			(this.getByte(offset + 2) * 0x00010000) +
			(this.getByte(offset + 1) * 0x00000100) +
			 this.getByte(offset));
};

// 非推奨
Byte.prototype.setLittleEndianSignedLong = function(offset, value) {
	this.setLittleEndianUnsignedLong(offset, value);
};

// 非推奨
Byte.prototype.getLittleEndianSignedLong = function(offset) {
	var x = this.getLittleEndianUnsignedLong(offset);
	if((x & 0x80000000) !== 0) {
		return(- ((~x) + 1));
	}
	else {
		return(x);
	}
};

// DataView 互換
Byte.prototype.setUint8 = function(offset, value) {
	this.setUnsignedChar(offset, value);
};

// DataView 互換
Byte.prototype.getUint8 = function(offset) {
	return(this.getUnsignedChar(offset));
};

// DataView 互換
Byte.prototype.setInt8 = function(offset, value) {
	this.setSignedChar(offset, value);
};

// DataView 互換
Byte.prototype.getInt8 = function(offset) {
	return(this.getSignedChar(offset));
};

// DataView 互換
Byte.prototype.setUint16 = function(offset, value, endian) {
	if(endian) {
		this.setLittleEndianUnsignedShort(offset, value);
	}
	else {
		this.setBigEndianUnsignedShort(offset, value);
	}
};

// DataView 互換
Byte.prototype.getUint16 = function(offset, endian) {
	if(endian) {
		return(this.getLittleEndianUnsignedShort(offset));
	}
	else {
		return(this.getBigEndianUnsignedShort(offset));
	}
};

// DataView 互換
Byte.prototype.setInt16 = function(offset, value, endian) {
	if(endian) {
		this.setLittleEndianSignedShort(offset, value);
	}
	else {
		this.setBigEndianSignedShort(offset, value);
	}
};

// DataView 互換
Byte.prototype.getInt16 = function(offset, endian) {
	if(endian) {
		return(this.getLittleEndianSignedShort(offset));
	}
	else {
		return(this.getBigEndianSignedShort(offset));
	}
};

// DataView 互換
Byte.prototype.setUint32 = function(offset, value, endian) {
	if(endian) {
		this.setLittleEndianUnsignedLong(offset, value);
	}
	else {
		this.setBigEndianUnsignedLong(offset, value);
	}
};

// DataView 互換
Byte.prototype.getUint32 = function(offset, endian) {
	if(endian) {
		return(this.getLittleEndianUnsignedLong(offset));
	}
	else {
		return(this.getBigEndianUnsignedLong(offset));
	}
};

// DataView 互換
Byte.prototype.setInt32 = function(offset, value, endian) {
	if(endian) {
		this.setLittleEndianSignedLong(offset, value);
	}
	else {
		this.setBigEndianSignedLong(offset, value);
	}
};

// DataView 互換
Byte.prototype.getInt32 = function(offset, endian) {
	if(endian) {
		return(this.getLittleEndianSignedLong(offset));
	}
	else {
		return(this.getBigEndianSignedLong(offset));
	}
};

Byte.BIG_ENDIAN		= false;
Byte.LITTLE_ENDIAN	= true;
