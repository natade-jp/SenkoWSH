"use strict";

/* global S3Math, S3Matrix, S3Vector, Float32Array, Int32Array, HTMLVideoElement, HTMLCanvasElement, HTMLImageElement, ImageData, ArrayBufferView */

﻿/**
 * SenkoLib S3D.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 * 
 * DEPENDENT LIBRARIES:
 *  S3DMath.js
 */

// 3DCGを作るうえで必要最小限の機能を提供する
// ・それらを構成する頂点、材質、面（全てimmutable）
// ・モデル (mutable)
// ・カメラ (mutable)
// ・シーン (mutable)
// ・描写用の行列作成
// ・描写のための必要最低限の計算


/**
 * /////////////////////////////////////////////////////////
 * S3System
 * 3DCGを作成するための行列を準備したり、シーンの描写をしたりする
 * /////////////////////////////////////////////////////////
 */


var S3System = function() {
	this._init();
};

S3System.SYSTEM_MODE = {
	OPEN_GL	: 0,
	DIRECT_X	: 1
};

S3System.DEPTH_MODE = {
	/**
	 * Z値の範囲などの依存関係をOpenGL準拠
	 * @type Number
	 */
	OPEN_GL	: 0,
	/**
	 * Z値の範囲などの依存関係をDirecX準拠
	 * @type Number
	 */
	DIRECT_X	: 1
};

S3System.DIMENSION_MODE = {
	/**
	 * 右手系
	 * @type Number
	 */
	RIGHT_HAND	: 0,
	/**
	 * 左手系
	 * @type Number
	 */
	LEFT_HAND	: 1
};

S3System.VECTOR_MODE = {
	/**
	 * 値を保持するベクトルを縦ベクトルとみなす
	 * @type Number
	 */
	VECTOR4x1	: 0,
	/**
	 * 値を保持するベクトルを横ベクトルとみなす
	 * @type Number
	 */
	VECTOR1x4	: 1
};

S3System.FRONT_FACE = {
	/**
	 * 反時計回りを前面とする
	 * @type Number
	 */
	COUNTER_CLOCKWISE : 0,
	
	/**
	 * 時計回りを前面とする
	 * @type Number
	 */
	CLOCKWISE : 1
};

S3System.CULL_MODE = {
	
	/**
	 * 常にすべての三角形を描画します。
	 * @type Number
	 */
	NONE : 0,
	
	/**
	 * 前向きの三角形を描写しません。
	 * @type Number
	 */
	FRONT : 1,
	
	/**
	 * 後ろ向きの三角形を描写しません。
	 * @type Number
	 */
	BACK : 2,
	
	/**
	 * 常に描写しない。
	 * @type Number
	 */
	FRONT_AND_BACK : 3
};

S3System.prototype._init = function() {
	this.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
	this.setBackgroundColor(new S3Vector(1.0, 1.0, 1.0, 1.0));
};

S3System.prototype._createID = function() {
	if(typeof this._CREATE_ID1 === "undefined") {
		this._CREATE_ID1 = 0;
		this._CREATE_ID2 = 0;
		this._CREATE_ID3 = 0;
		this._CREATE_ID4 = 0;
	}
	var id = ""+
		this._CREATE_ID4.toString(16)+":"+
		this._CREATE_ID3.toString(16)+":"+
		this._CREATE_ID2.toString(16)+":"+
		this._CREATE_ID1.toString(16);
	this._CREATE_ID1++;
	if(this._CREATE_ID1 === 0x100000000) {
		this._CREATE_ID1 = 0;
		this._CREATE_ID2++;
		if(this._CREATE_ID2 === 0x100000000) {
			this._CREATE_ID2 = 0;
			this._CREATE_ID3++;
			if(this._CREATE_ID3 === 0x100000000) {
				this._CREATE_ID3 = 0;
				this._CREATE_ID4++;
				if(this._CREATE_ID4 === 0x100000000) {
					this._CREATE_ID4 = 0;
					throw "createID";
				}
			}
		}
	}
	return id;
};

S3System.prototype._download = function(url, callback) {
	var dotlist = url.split(".");
	var isImage = false;
	var ext = "";
	if(dotlist.length > 1) {
		var ext = dotlist[dotlist.length - 1].toLocaleString();
		isImage = (ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg");
	}
	if(isImage) {
		var image = new Image();
		image.onload = function() {
			callback(image, ext);
		};
		image.src = url;
		return;
	}
	var http = new XMLHttpRequest();
	var handleHttpResponse = function (){
		if(http.readyState === 4) { // DONE
			if(http.status !== 200) {
				console.log("error download [" + url + "]");
				return(null);
			}
			callback(http.responseText, ext);
		}
	};
	http.onreadystatechange = handleHttpResponse;
	http.open("GET", url, true);
	http.send(null);
};
S3System.prototype._toVector3 = function(x) {
	if(x instanceof S3Vector) {
		return x;
	}
	else if(!isNaN(x)) {
		return new S3Vector(x, x, x);
	}
	else if(x instanceof Array) {
		return new S3Vector(x[0], x[1], x[2]);
	}
	else {
		throw "IllegalArgumentException";
	};
};
S3System.prototype._toValue = function(x) {
	if(!isNaN(x)) {
		return x;
	}
	else {
		throw "IllegalArgumentException";
	};
};

S3System.prototype.setBackgroundColor = function(color) {
	this.backgroundColor = color;
};

S3System.prototype.getBackgroundColor = function() {
	return this.backgroundColor;
};

S3System.prototype.setSystemMode = function(mode) {
	this.systemmode = mode;
	if(this.systemmode === S3System.SYSTEM_MODE.OPEN_GL) {
		this.depthmode		= S3System.DEPTH_MODE.OPEN_GL;
		this.dimensionmode	= S3System.DIMENSION_MODE.RIGHT_HAND;
		this.vectormode		= S3System.VECTOR_MODE.VECTOR4x1;
		this.frontface		= S3System.FRONT_FACE.COUNTER_CLOCKWISE;
		this.cullmode		= S3System.CULL_MODE.BACK;
	}
	else {
		this.depthmode		= S3System.DEPTH_MODE.DIRECT_X;
		this.dimensionmode	= S3System.DIMENSION_MODE.LEFT_HAND;
		this.vectormode		= S3System.VECTOR_MODE.VECTOR1x4;
		this.frontface		= S3System.FRONT_FACE.CLOCKWISE;
		this.cullmode		= S3System.CULL_MODE.BACK;
	}
};

/**
 * ビューポート行列を作成する際に、Z値の範囲の範囲をどうするか
 * @param {S3System.DEPTH_MODE} depthmode
 * @returns {undefined}
 */
S3System.prototype.setDepthMode = function(depthmode) {
	this.depthmode = depthmode;
};

/**
 * 座標軸について左手系か、右手系か
 * @param {S3System.DIMENSION_MODE} dimensionmode
 * @returns {undefined}
 */
S3System.prototype.setDimensionMode = function(dimensionmode) {
	this.dimensionmode = dimensionmode;
};

/**
 * N次元の座標について、横ベクトルか、縦ベクトル、どちらで管理するか
 * @param {S3System.VECTOR_MODE} vectormode
 * @returns {undefined}
 */
S3System.prototype.setVectorMode = function(vectormode) {
	this.vectormode = vectormode;
};

/**
 * どのようなポリゴンの頂点の順序を表として定義するか
 * @param {S3System.FRONT_FACE} frontface
 * @returns {undefined}
 */
S3System.prototype.setFrontMode = function(frontface) {
	this.frontface = frontface;
};

/**
 * どの方向を描写しないかを設定する。
 * @param {S3System.CULL_MODE} cullmode
 * @returns {undefined}
 */
S3System.prototype.setCullMode = function(cullmode) {
	this.cullmode = cullmode;
};

S3System.prototype.setCanvas = function(canvas) {
	var that		= this;
	var ctx			= canvas.getContext("2d");
	this.canvas		= canvas;
	this.context2d = {
		context : ctx,
		drawLine : function(v0, v1) {
			ctx.beginPath();
			ctx.moveTo( v0.x, v0.y );
			ctx.lineTo( v1.x, v1.y );
			ctx.stroke();
		},
		drawLinePolygon : function(v0, v1, v2) {
			ctx.beginPath();
			ctx.moveTo( v0.x, v0.y );
			ctx.lineTo( v1.x, v1.y );
			ctx.lineTo( v2.x, v2.y );
			ctx.closePath();
			ctx.stroke();
		},
		setLineWidth : function(width) {
			ctx.lineWidth = width;
		},
		setLineColor : function(color) {
			ctx.strokeStyle = color;
		},
		clear : function() {
			var color = that.getBackgroundColor();
			ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
			ctx.fillStyle = "rgba(" + color.x * 255 + "," + color.y * 255 + "," + color.z * 255 + "," + color.w + ")";
			ctx.fillRect(0, 0, that.canvas.width, that.canvas.height);
		}
	};
};

/**
 * カリングのテストをする
 * @param {S3Vector} p1
 * @param {S3Vector} p2
 * @param {S3Vector} p3
 * @returns {Boolean} true で描写しない
 */
S3System.prototype.testCull = function(p1, p2, p3) {
	if(this.cullmode === S3System.CULL_MODE.NONE) {
		return false;
	}
	if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
		return true;
	}
	var isclock = S3Vector.isClockwise(p1, p2, p3);
	if(isclock === null) {
		return true;
	}
	else if(!isclock) {
		if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
			return this.cullmode !== S3System.CULL_MODE.BACK;
		}
		else {
			return this.cullmode !== S3System.CULL_MODE.FRONT;
		}
	}
	else {
		if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
			return this.cullmode === S3System.CULL_MODE.BACK;
		}
		else {
			return this.cullmode === S3System.CULL_MODE.FRONT;
		}
	}
};

/**
 * ビューポート行列を作成する
 * @param {Number} x 描写する左上の座標X
 * @param {Number} y 描写する左上の座標Y
 * @param {Number} Width 描写幅
 * @param {Number} Height 描写幅
 * @param {Number} MinZ 深度値の変換
 * @param {Number} MaxZ 深度値の変換
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixViewport = function(x, y, Width, Height, MinZ, MaxZ) {
	if(MinZ === undefined) {
		MinZ = 0.0;
	}
	if(MaxZ === undefined) {
		MaxZ = 1.0;
	}
	// M.m11 は、DirectXだとマイナス、OpenGLだとプラスである
	// 今回は、下がプラスであるcanvasに表示させることを考えて、マイナスにしてある。
	var M = new S3Matrix();
	M.m00 =  Width/2; M.m01 =       0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =      0.0; M.m11 = -Height/2; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =      0.0; M.m21 =       0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =x+Width/2; M.m31 =y+Height/2; M.m32 = 0.0; M.m33 = 1.0;
	
	if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
		M.m22 = MinZ - MaxZ;
		M.m32 = MinZ;
	}
	else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
		M.m22 = (MinZ - MaxZ) / 2;
		M.m32 = (MinZ + MaxZ) / 2;
	}
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 視体積の上下方向の視野角を求める
 * @param {Number} zoomY
 * @returns {Number}
 */
S3System.calcFovY = function(zoomY) {
	return(2.0 * Math.atan(1.0 / zoomY));
};

/**
 * アスペクト比を求める
 * @param {Number} width
 * @param {Number} height
 * @returns {Number}
 */
S3System.calcAspect = function(width, height) {
	return(width / height);
};

/**
 * パースペクティブ射影行列を作成する
 * @param {Number} fovY 視体積の上下方向の視野角（0度から180度）
 * @param {Number} Aspect 近平面、遠平面のアスペクト比（Width / Height）
 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixPerspectiveFov = function(fovY, Aspect, Near, Far) {
	var arc = S3Math.radius(fovY);
	var zoomY = 1.0 / Math.tan(arc / 2.0);
	var zoomX = zoomY / Aspect;
	var M = new S3Matrix();
	M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 0.0;
	var Delta = Far - Near;
	if(Near > Far) {
		throw "Near > Far error";
	}
	else if(Delta === 0.0) {
		throw "divide error";
	}
	if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
		M.m22 = Far / Delta;
		M.m32 = - Far * Near / Delta;
	}
	else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
		M.m22 = (Far + Near) / Delta;
		M.m32 = - 2.0 * Far * Near / Delta;
	}
	if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
		M.m22 = - M.m22;
		M.m23 = - M.m23;
	}
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * ビュートランスフォーム行列を作成する
 * @param {S3Vector} eye カメラの座標の位置ベクトル
 * @param {S3Vector} at カメラの注視点の位置ベクトル
 * @param {S3Vector} up カメラの上への方向ベクトル
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixLookAt = function(eye, at, up) {
	var X, Y, Z;
	if(up === undefined) {
		up = new S3Vector(0.0, 1.0, 0.0);
	}
	// Z ベクトルの作成
	Z = eye.getDirectionNormalized(at);
	if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
		// 右手系なら反転
		Z = Z.negate();
	}
	// X, Y ベクトルの作成
	X = up.cross(Z).normalize();
	Y = Z.cross(X);
	var M = new S3Matrix();
	M.m00 = X.x; M.m01 = Y.x; M.m02 = Z.x; M.m03 = 0.0;
	M.m10 = X.y; M.m11 = Y.y; M.m12 = Z.y; M.m13 = 0.0;
	M.m20 = X.z; M.m21 = Y.z; M.m22 = Z.z; M.m23 = 0.0;
	M.m30 = -X.dot(eye); M.m31 = -Y.dot(eye); M.m32 = -Z.dot(eye); M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 単位行列を作成します。
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixIdentity = function() {
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return M;
};

/**
 * 平行移動行列を作成します。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixTranslate = function(x, y, z) {
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 =   x; M.m31 =   y; M.m32 =   z; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 拡大縮小行列を作成します。
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixScale = function(x, y, z) {
	var M = new S3Matrix();
	M.m00 =   x; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 =   y; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 =   z; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * X軸周りの回転行列を作成します。
 * @param {Number} degree 角度を度数法で指定
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateX = function(degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * Y軸周りの回転行列を作成します。
 * @param {Number} degree 角度を度数法で指定
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateY = function(degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * Z軸周りの回転行列を作成します。
 * @param {Number} degree 角度を度数法で指定
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateZ = function(degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
 * 縦型、横型を踏まえて掛け算します。
 * @param {S3Matrix} A
 * @param {S3Matrix|S3Vector} B
 * @returns {S3Matrix|S3Vector}
 */
S3System.prototype.mulMatrix = function(A, B) {
	if(B instanceof S3Matrix) {
		// 横型の場合は、v[AB]=u
		// 縦型の場合は、[BA]v=u
		return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? B.mul(A) : A.mul(B);
	}
	else if(B instanceof S3Vector) {
		// 横型の場合は、[vA]=u
		// 縦型の場合は、[Av]=u
		return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? A.mul(B) : B.mul(A);
	}
	else {
		throw "IllegalArgumentException";
	}
};

/**
 * 航空機の姿勢制御（ロール・ピッチ・ヨー）の順序で回転
 * @param {Number} z
 * @param {Number} x
 * @param {Number} y
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixRotateZXY = function(z, x, y) {
	var Z = this.getMatrixRotateZ(z);
	var X = this.getMatrixRotateX(x);
	var Y = this.getMatrixRotateY(y);
	return this.mulMatrix(this.mulMatrix(Z, X), Y);
};


S3System.prototype.getMatrixWorldTransform = function(model) {
	// 回転行列
	var R = this.getMatrixRotateZXY(model.angles.roll, model.angles.pitch, model.angles.yaw);
	// スケーリング
	var S = this.getMatrixScale(model.scale.x, model.scale.y, model.scale.z);
	// 移動行列
	var T = this.getMatrixTranslate(model.position.x, model.position.y, model.position.z);
	// ワールド変換行列を作成する
	var W = this.mulMatrix(this.mulMatrix(S, R), T);
	return W;
};

S3System.prototype.clear = function() {
	this.context2d.clear();
};


S3System.prototype._calcVertexTransformation = function(vertexlist, MVP, Viewport) {
	var i;
	var newvertexlist = [];
	
	for(i = 0; i < vertexlist.length; i++) {
		var p = vertexlist[i].position;
		
//	console.log("1 " + p);
//	console.log("2 " + this.mulMatrix(VPS.LookAt, p));
//	console.log("3 " + this.mulMatrix(VPS.PerspectiveFov, this.mulMatrix(VPS.LookAt, p)));
//	console.log("4 " + this.mulMatrix(MVP, p));
		
		p = this.mulMatrix(MVP, p);
		var rhw = p.w;
		p = p.mul(1.0 / rhw);
		p = this.mulMatrix(Viewport, p);
		newvertexlist[i] = new S3Vertex(p);
	}
	return newvertexlist;
};

S3System.prototype.drawAxis = function(scene) {
	var VPS = scene.getCamera().getVPSMatrix(this.canvas);
	
	var vertexvector = [];
	vertexvector[0] = new S3Vector(0, 0, 0);
	vertexvector[1] = new S3Vector(10, 0, 0);
	vertexvector[2] = new S3Vector(0, 10, 0);
	vertexvector[3] = new S3Vector(0, 0, 10);
	
	var newvector = [];
	var i = 0;
	var M = this.mulMatrix(VPS.LookAt, VPS.PerspectiveFov);
	for(i = 0; i < vertexvector.length; i++) {
		var p = vertexvector[i];
		p = this.mulMatrix(M, p);
		p = p.mul(1.0 / p.w);
		p = this.mulMatrix(VPS.Viewport, p);
		newvector[i] = p;
	}
	
	this.context2d.setLineWidth(3.0);
	this.context2d.setLineColor("rgb(255, 0, 0)");
	this.context2d.drawLine(newvector[0], newvector[1]);
	this.context2d.setLineColor("rgb(0, 255, 0)");
	this.context2d.drawLine(newvector[0], newvector[2]);
	this.context2d.setLineColor("rgb(0, 0, 255)");
	this.context2d.drawLine(newvector[0], newvector[3]);
};

S3System.prototype._drawPolygon = function(vetexlist, triangleindexlist) {
	var i = 0;
	
	for(i = 0; i < triangleindexlist.length; i++) {
		var ti = triangleindexlist[i];
		if(this.testCull(
			vetexlist[ti.index[0]].position,
			vetexlist[ti.index[1]].position,
			vetexlist[ti.index[2]].position )) {
				continue;
		}
		this.context2d.drawLinePolygon(
			vetexlist[ti.index[0]].position,
			vetexlist[ti.index[1]].position,
			vetexlist[ti.index[2]].position
		);
	}
};

S3System.prototype.drawScene = function(scene) {
	var VPS = scene.getCamera().getVPSMatrix(this.canvas);
	
	this.context2d.setLineWidth(1.0);
	this.context2d.setLineColor("rgb(0, 0, 0)");
	
	var i = 0;
	var models = scene.getModels();
	for(i = 0; i < models.length; i++) {
		var model	= models[i];
		var mesh	= model.getMesh();
		if(mesh.isComplete() === false) {
			continue;
		}
		var M = this.getMatrixWorldTransform(model);
		var MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
		var vlist = this._calcVertexTransformation(mesh.src.vertex, MVP, VPS.Viewport);
		this._drawPolygon(vlist, mesh.src.triangleindex);
	}
};

S3System.prototype._disposeObject = function() {
};

/**
 * /////////////////////////////////////////////////////////
 * 描写に使用するシーンを構成するクラス群
 * 
 * ポリゴン情報を構成部品
 * S3Vertex			頂点
 * S3Material		素材
 * S3TriangleIndex	インデックス
 * S3Mesh			頂点とインデックス情報と素材からなるメッシュ
 * 
 * ポリゴンの描写用構成部品
 * S3Model			どの座標にどのように表示するかモデル
 * S3Camera			映像をどのように映すか
 * S3Scene			モデルとカメラを使用してシーン
 * 
 * /////////////////////////////////////////////////////////
 */

/**
 * /////////////////////////////////////////////////////////
 * ポリゴン情報を構成部品
 * /////////////////////////////////////////////////////////
 */

var S3Texture = function(s3system, data) {
	this.sys	= s3system;
	this._init();
	if(data !== undefined) {
		this.setImage(data);
	}
};
S3System.prototype.createTexture = function(name) {
	return new S3Texture(this, name);
};
S3Texture.prototype._init = function() {
	this.url			= null;
	this.image			= null;
	this.is_loadimage	= false;
	this.is_dispose		= false;
	this.gldata			= null;
};
S3Texture.prototype.dispose = function() {
	if(!this.is_dispose) {
		this.is_dispose = true;
		if(this.gldata !== null) {
			this.sys._disposeObject(this);
			this.gldata = null;
		}
	}
};
S3Texture.prototype.setImage = function(image) {
	if((image === null) || this.is_dispose){
		return;
	}
	if(	(image instanceof HTMLImageElement) ||
		(image instanceof HTMLCanvasElement)) {
		var original_width  = image.width;
		var original_height = image.height;
		var ceil_power_of_2 = function(x) {
			var a = Math.log2(x);
			if ((a - Math.floor(a)) < 1e-10) {
				return x;
			}
			else {
				return 1 << Math.ceil(a);
			}
		};
		var ceil_width  = ceil_power_of_2(original_width);
		var ceil_height = ceil_power_of_2(original_height);
		if((original_width !== ceil_width) || (original_height !== ceil_height)) {
			// 2の累乗ではない場合は、2の累乗のサイズに変換
			var ceil_image = document.createElement("canvas");
			ceil_image.width	= ceil_width;
			ceil_image.height	= ceil_height;
			ceil_image.getContext("2d").drawImage(
				image,
				0, 0, original_width, original_height,
				0, 0, ceil_width, ceil_height
			);
			image = ceil_image;
		} 
	}
	if(	(image instanceof ImageData) ||
		(image instanceof HTMLImageElement) ||
		(image instanceof HTMLCanvasElement) ||
		(image instanceof HTMLVideoElement)) {
		if(this.url === null) {
			// 直接設定した場合はIDをURLとして設定する
			this.url		= this.sys._createID();
		}
		this.image			= image;
		this.is_loadimage	= true;
		return;
	}
	else if((typeof image === "string")||(image instanceof String)) {
		this.url = image;
		var that = this;
		this.sys._download(this.url, function (image, ext){
			that.setImage(image);
		});
		return;
	}
	else {
		console.log("not setImage");
		console.log(image);
	}
};

/**
 * 素材 (mutable)
 * @param {S3Material} type
 * @param {S3Material} name
 * @returns {S3Material}
 */
var S3Material = function(s3system, name) {
	this.sys		= s3system;
	this.name		= "s3default";
	if(name !== undefined) {
		this.name = name;
	}
	this.color		= new S3Vector(1.0, 1.0, 1.0, 1.0);	// 拡散反射の色
	this.diffuse	= 0.8;								// 拡散反射の強さ
	this.emission	= new S3Vector(0.0, 0.0, 0.0);		// 自己照明（輝き）
	this.specular	= new S3Vector(0.0, 0.0, 0.0);		// 鏡面反射の色
	this.power		= 5.0;								// 鏡面反射の強さ
	this.ambient	= new S3Vector(0.6, 0.6, 0.6);		// 光によらない初期色
	this.reflect	= 0.0;								// 環境マッピングによる反射の強さ
	this.textureColor	= this.sys.createTexture();
	this.textureNormal	= this.sys.createTexture();
};
S3System.prototype.createMaterial = function(name) {
	return new S3Material(this, name);
};
S3Material.prototype.setName = function(name)		{ this.name = name; };
S3Material.prototype.setColor = function(color)		{ this.color = this.sys._toVector3(color); };
S3Material.prototype.setDiffuse = function(diffuse)	{ this.diffuse = this.sys._toValue(diffuse); };
S3Material.prototype.setEmission = function(emission)	{ this.emission = this.sys._toVector3(emission); };
S3Material.prototype.setSpecular = function(specular)	{ this.specular = this.sys._toVector3(specular); };
S3Material.prototype.setPower = function(power)		{ this.power = this.sys._toValue(power); };
S3Material.prototype.setAmbient = function(ambient)	{ this.ambient = this.sys._toVector3(ambient); };
S3Material.prototype.setReflect = function(reflect)	{ this.reflect = this.sys._toValue(reflect); };
S3Material.prototype.setTextureColor = function(data) {
	if(this.textureColor !== null) {
		this.textureColor.dispose();
	}
	this.textureColor = this.sys.createTexture();
	this.textureColor.setImage(data);
};
S3Material.prototype.setTextureNormal = function(data) {
	if(this.textureNormal !== null) {
		this.textureNormal.dispose();
	}
	this.textureNormal = this.sys.createTexture();
	this.textureNormal.setImage(data);
};

/**
 * 頂点 (immutable)
 * @param {S3Vector} position 座標
 * @returns {S3Vertex}
 */
var S3Vertex = function(position) {
	this.position	= position;
};
S3System.prototype.createVertex = function(position) {
	return new S3Vertex(position);
};
S3Vertex.prototype.clone = function() {
	return new S3Vertex(this.position);
};

/**
 * ABCの頂点を囲む3角ポリゴン (immutable)
 * @param {Number} i1 配列の番号A
 * @param {Number} i2 配列の番号B
 * @param {Number} i3 配列の番号C
 * @param {Array} indexlist Index Array
 * @param {Number} materialIndex
 * @param {Array} uvlist S3Vector Array
 */
var S3TriangleIndex = function(i1, i2, i3, indexlist, materialIndex, uvlist) {
	this._init(i1, i2, i3, indexlist, materialIndex, uvlist);
};
S3System.prototype.createTriangleIndex = function(i1, i2, i3, indexlist, materialIndex, uvlist) {
	return new S3TriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
};

/**
 * ABCの頂点を囲む3角ポリゴン (immutable)
 * @param {Number} i1 配列の番号A
 * @param {Number} i2 配列の番号B
 * @param {Number} i3 配列の番号C
 * @param {Array} indexlist Index Array
 * @param {Number} materialIndex 負の場合や未定義の場合は 0 とします。
 * @param {Array} uvlist S3Vector Array
 */
S3TriangleIndex.prototype._init = function(i1, i2, i3, indexlist, materialIndex, uvlist) {
	this.index				= null;		// 各頂点を示すインデックスリスト
	this.uv					= null;		// 各頂点のUV座標
	this.materialIndex		= null;		// 面の材質
	if((indexlist instanceof Array) && (indexlist.length > 0)) {
		this.index = [indexlist[i1], indexlist[i2], indexlist[i3]];
	}
	else {
		throw "IllegalArgumentException";
	}
	if((uvlist !== undefined) && (uvlist instanceof Array) && (uvlist.length > 0) && (uvlist[0] instanceof S3Vector)) {
		this.uv = [uvlist[i1], uvlist[i2], uvlist[i3]];
	}
	else {
		this.uv = [null, null, null];
	}
	materialIndex = materialIndex      ? materialIndex : 0;
	materialIndex = materialIndex >= 0 ? materialIndex : 0;
	this.materialIndex = materialIndex;
};
S3TriangleIndex.prototype.clone = function() {
	return new S3TriangleIndex( 0, 1, 2, this.index, this.materialIndex, this.uv );
};
S3TriangleIndex.prototype.inverseTriangle = function() {
	return new S3TriangleIndex( 2, 1, 0, this.index, this.materialIndex, this.uv );
};

/**
 * 立体物 (mutable)
 * @param {S3System} sys
 * @returns {S3Mesh}
 */
var S3Mesh = function(sys) {
	this.sys = sys;
	this._init();
};
S3System.prototype.createMesh = function() {
	return new S3Mesh(this);
};
S3Mesh.prototype._init = function() {
	// 変数の準備
	this.src = {};
	this.src.vertex			= [];
	this.src.triangleindex	= [];
	this.src.material		= [];
	this.is_complete	= false;
	// webgl用
	this.gldata = {};
	this.is_compile_gl	= false;
};
S3Mesh.prototype.isComplete = function() {
	return this.is_complete;
};
S3Mesh.prototype.isCompileGL = function() {
	return this.is_compile_gl;
};
S3Mesh.prototype.clone = function() {
	var mesh = new S3Mesh(this.sys);
	mesh.addVertex(this.getVertexArray());
	mesh.addTriangleIndex(this.getTriangleIndexArray());
	mesh.addMaterial(this.getMaterialArray());
	return mesh;
};
S3Mesh.prototype.setComplete = function(is_complete) {
	this.is_complete = is_complete;
};
S3Mesh.prototype.setCompileGL = function(is_compile_gl) {
	this.is_compile_gl = is_compile_gl;
};
S3Mesh.prototype.inverseTriangle = function() {
	this.setComplete(false);
	var i = 0;
	for(i = 0; i < this.triangleindex.length; i++) {
		this.src.triangleindex[i] = this.src.triangleindex[i].inverseTriangle();
	}
};
S3Mesh.prototype.getVertexArray = function() {
	return this.src.vertex;
};
S3Mesh.prototype.getTriangleIndexArray = function() {
	return this.src.triangleindex;
};
S3Mesh.prototype.getMaterialArray = function() {
	return this.src.material;
};
S3Mesh.prototype.addVertex = function(vertex) {
	// 一応 immutable なのでそのままシャローコピー
	this.setComplete(false);
	var meshvertex = this.getVertexArray(); 
	if(vertex === undefined) {
		// _init から呼ばれたときに引数がない場合はなにもせず終わる
	}
	else if(vertex instanceof S3Vertex) {
		meshvertex[meshvertex.length] = vertex;
	}
	else {
		var i = 0;
		for(i = 0; i < vertex.length; i++) {
			meshvertex[meshvertex.length] = vertex[i];
		}
	}
};
S3Mesh.prototype.addTriangleIndex = function(ti) {
	// 一応 immutable なのでそのままシャローコピー
	this.setComplete(false);
	var meshtri = this.getTriangleIndexArray(); 
	if(ti === undefined) {
		// _init から呼ばれたときに引数がない場合はなにもせず終わる
	}
	else if(ti instanceof S3TriangleIndex) {
		meshtri[meshtri.length] = ti;
	}
	else {
		var i = 0;
		for(i = 0; i < ti.length; i++) {
			meshtri[meshtri.length] = ti[i];
		}
	}
};
S3Mesh.prototype.addMaterial = function(material) {
	// 一応 immutable なのでそのままシャローコピー
	this.setComplete(false);
	var meshmat = this.getMaterialArray();
	if(material === undefined) {
		// _init から呼ばれたときに引数がない場合はなにもせず終わる
	}
	else if(material instanceof S3Material) {
		meshmat[meshmat.length] = material;
	}
	else {
		var i = 0;
		for(i = 0; i < material.length; i++) {
			meshmat[meshmat.length] = material[i];
		}
	}
};

// 他のファイルの読み書きの拡張用
S3Mesh.prototype.inputData = function(data, type) {
	var that = this;
	var load = function(ldata, ltype, url) {
		that._init();
		S3Mesh.DATA_INPUT_FUNCTION[ltype](that.sys, that, ldata, url);
		that.setComplete(true);
	};
	if(((typeof data === "string")||(data instanceof String))&&((data.indexOf("\n") === -1))) {
		// 1行の場合はURLとみなす（雑）
		var downloadCallback = function(text) {
			load(text, type, data);
		};
		this.sys._download(data, downloadCallback);
	}
	else {
		load(data, type, "");
	}
};
S3Mesh.prototype.outputData = function(type) {
	return S3Mesh.DATA_OUTPUT_FUNCTION[type](this.sys, this);
};
S3Mesh.DATA_INPUT_FUNCTION	= {};
S3Mesh.DATA_OUTPUT_FUNCTION	= {};

/*
	次のようなデータを入出力できます。
	var sample = {
		Indexes:{
			body:[
				[ 0, 1, 2],
				[ 3, 1, 0],
				[ 3, 0, 2],
				[ 3, 2, 1]
			]
		},
		Vertices:[
			[  0,  0,  -5],
			[  0, 20,  -5],
			[ 10,  0,  -5],
			[  0,  0, -20]
		]
	};
*/

S3Mesh.DATA_JSON = "JSON";
S3Mesh.DATA_INPUT_FUNCTION[S3Mesh.DATA_JSON] = function(sys, mesh, json, url) {
	var meshdata;
	if((typeof json === "string")||(json instanceof String)) {
		meshdata = eval(json);
	}
	else {
		meshdata = json;
	}
	var i, j;
	var material = 0;
	// 材質名とインデックスを取得
	for(var materialname in meshdata.Indexes) {
		mesh.addMaterial(sys.createMaterial(materialname));
		var materialindexlist = meshdata.Indexes[materialname];
		for(i = 0; i < materialindexlist.length; i++) {
			var list = materialindexlist[i];
			for(j = 0; j < list.length - 2; j++) {
				// 3角形と4角形に対応
				var ti = ((j % 2) === 0) ? 
						new S3TriangleIndex(j    , j + 1, j + 2, list, material)
					:	new S3TriangleIndex(j - 1, j + 1, j + 2, list, material);
				mesh.addTriangleIndex(ti);
			}
		}
		material++;
	}
	// 頂点座標を取得
	for(i = 0; i < meshdata.Vertices.length; i++) {
		var vector = new S3Vector(meshdata.Vertices[i][0], meshdata.Vertices[i][1], meshdata.Vertices[i][2]);
		var vertex = new S3Vertex(vector);
		mesh.addVertex(vertex);
	}
	return;
};
S3Mesh.DATA_OUTPUT_FUNCTION[S3Mesh.DATA_JSON] = function(sys, mesh) {
	var i, j;
	var vertex			= mesh.getVertexArray(); 
	var triangleindex	= mesh.getTriangleIndexArray(); 
	var material		= mesh.getMaterialArray();
	var material_vertexlist = [];
	var material_length = material.length !== 0 ? material.length : 1;
	var default_material = sys.createTexture();
	// 材質リストを取得
	for(i = 0; i < material_length; i++) {
		material_vertexlist[i] = {
			material: material[i] ? material[i] : default_material ,
			list:[]
		};
	}
	// 材質名に合わせて、インデックスリストを取得
	for(i = 0; i < triangleindex.length; i++) {
		var ti = triangleindex[i];
		material_vertexlist[ti.materialIndex].list.push( ti.index );
	}
	var output = [];
	output.push("{");
	output.push("\tIndexes:{");
	for(i = 0; i < material_vertexlist.length; i++) {
		var mv = material_vertexlist[i];
		output.push("\t\t" + mv.material.name + ":[");
		for(j = 0; j < mv.list.length; j++) {
			var vi = mv.list[j];
			output.push("\t\t\t[" + vi[0] + " " + vi[1] + " " + vi[2] + "]" + ((j === mv.list.length - 1) ? "" : ",") );
		}
		output.push("\t\t]" + ((i === material_vertexlist.length - 1) ? "" : ",") );
	}
	output.push("\t},");
	output.push("\tVertices:[");
	for(i = 0; i < vertex.length; i++) {
		var vp = vertex[i].position;
		output.push("\t\t[" + vp.x + " " + vp.y + " " + vp.z + "]" + ((vp === vertex.length - 1) ? "" : ",") );
	}
	output.push("\t]");
	output.push("}");
	return(output.join("\n"));
};

/**
 * /////////////////////////////////////////////////////////
 * ポリゴンの描写用構成部品
 * /////////////////////////////////////////////////////////
 */

/**
 * 色々な情報をいれたモデル (mutable)
 * @returns {S3Model}
 */
var S3Model = function() {
	this._init();
};
S3System.prototype.createModel = function() {
	return new S3Model();
};
S3Model.prototype._init = function() {
	this.angles			= new S3Angles();
	this.scale			= new S3Vector(1, 1, 1);
	this.position		= new S3Vector(0, 0, 0);
	this.mesh			= new S3Mesh();
};
S3Model.prototype.setMesh = function(mesh) {
	this.mesh			= mesh;
};
S3Model.prototype.getMesh = function() {
	return this.mesh;
};
S3Model.prototype.setScale = function(x, y, z) {
	if(arguments.length === 1) {
		if(typeof x === "number"){
			this.scale = new S3Vector(x, x, x);
		}
		else if(x instanceof S3Vector){
			this.scale = x;
		}
	}
	else {
		this.scale = new S3Vector(x, y, z);
	}
};
S3Model.prototype.getScale = function() {
	return this.scale;
};
S3Model.prototype.setPosition = function(x, y, z) {
	if((arguments.length === 1) && (x instanceof S3Vector)){
		this.position = x;
	}
	else {
		this.position = new S3Vector(x, y, z);
	}
};
S3Model.prototype.getPosition = function() {
	return this.position;
};
S3Model.prototype.getAngle = function() {
	return this.angles;
};
S3Model.prototype.setAngle = function(angles) {
	this.angles = angles;
};
S3Model.prototype.addRotateX = function(x) {
	this.angles = this.angles.addRotateX(x);
};
S3Model.prototype.addRotateY = function(y) {
	this.angles = this.angles.addRotateY(y);
};
S3Model.prototype.addRotateZ = function(z) {
	this.angles = this.angles.addRotateZ(z);
};
S3Model.prototype.setRotateX = function(x) {
	this.angles = this.angles.setRotateX(x);
};
S3Model.prototype.setRotateY = function(y) {
	this.angles = this.angles.setRotateY(y);
};
S3Model.prototype.setRotateZ = function(z) {
	this.angles = this.angles.addRotateZ(z);
};

/**
 * カメラ (mutable)
 * @param {type} s3system
 * @returns {S3Camera}
 */
var S3Camera = function(s3system) {
	this.sys = s3system;
	this.init();
};
S3System.prototype.createCamera = function() {
	var camera = new S3Camera(this);
	return camera;
};
S3Camera.prototype.init = function() {
	this.fovY		= 45;
	this.eye		= new S3Vector(0, 0, 0);
	this.center		= new S3Vector(0, 0, 1);
	this.near		= 1;
	this.far		= 1000;
};
S3Camera.prototype.clone = function() {
	var camera = new S3Camera(this.sys);
	camera.fovY		= this.fovY;
	camera.eye		= this.eye;
	camera.center	= this.center;
	camera.near		= this.near;
	camera.far		= this.far;
	return camera;
};
S3Camera.prototype.getVPSMatrix = function(canvas) {
	var x = S3System.calcAspect(canvas.width, canvas.height);
	// ビューイング変換行列を作成する
	var V = this.sys.getMatrixLookAt(this.eye, this.center);
	// 射影トランスフォーム行列
	var P = this.sys.getMatrixPerspectiveFov(this.fovY, x, this.near, this.far );
	// ビューポート行列
	var S = this.sys.getMatrixViewport(0, 0, canvas.width, canvas.height);
	return { LookAt : V, aspect : x, PerspectiveFov : P, Viewport : S };
};
S3Camera.prototype.setDrawRange = function(near, far) {
	this.near	= near;
	this.far	= far;
};
S3Camera.prototype.setFovY = function(fovY) {
	this.fovY = fovY;
};
S3Camera.prototype.setEye = function(eye) {
	this.eye = eye.clone();
};
S3Camera.prototype.setCenter = function(center) {
	this.center = center.clone();
};
S3Camera.prototype.getDirection = function() {
	return this.eye.getDirectionNormalized(this.center);
};
S3Camera.prototype.getDistance = function() {
	return this.center.getDistance(this.eye);
};
S3Camera.prototype.setDistance = function(distance) {
	var direction = this.center.getDirectionNormalized(this.eye);
	this.eye = this.center.add(direction.mul(distance));
};
S3Camera.prototype.getRotateY = function() {
	var ray = this.center.getDirection(this.eye);
	return S3Math.degrees(Math.atan2(ray.x, ray.z));
};
S3Camera.prototype.setRotateY = function(deg) {
	var rad = S3Math.radius(deg);
	var ray = this.center.getDirection(this.eye);
	var length = ray.setY(0).norm();
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	this.eye = new S3Vector(
		this.center.x + length * sin,
		this.eye.y,
		this.center.z + length * cos
	);
};
S3Camera.prototype.addRotateY = function(deg) {
	this.setRotateY(this.getRotateY() + deg);
};
S3Camera.prototype.getRotateX = function() {
	var ray = this.center.getDirection(this.eye);
	return S3Math.degrees(Math.atan2( ray.z, ray.y ));
};
S3Camera.prototype.setRotateX = function(deg) {
	var rad = S3Math.radius(deg);
	var ray = this.center.getDirection(this.eye);
	var length = ray.setX(0).norm();
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	this.eye = new S3Vector(
		this.eye.x,
		this.center.y + length * cos,
		this.center.z + length * sin
	);
};
S3Camera.prototype.addRotateX = function(deg) {
	this.setRotateX(this.getRotateX() + deg);
};
S3Camera.prototype.translateAbsolute = function(v) {
	this.eye	= this.eye.add(v);
	this.center	= this.center.add(v);
};
S3Camera.prototype.translateRelative = function(v) {
	var X, Y, Z;
	var up = new S3Vector(0.0, 1.0, 0.0);
	// Z ベクトルの作成
	Z = this.eye.getDirectionNormalized(this.center);
	
	// 座標系に合わせて計算
	if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
		// 右手系なら反転
		Z = Z.negate();
	}
	// X, Y ベクトルの作成
	X = up.cross(Z).normalize();
	Y = Z.cross(X);
	// 移動
	X = X.mul(v.x);
	Y = Y.mul(v.y);
	Z = Z.mul(v.z);
	this.translateAbsolute(X.add(Y).add(Z));
};
S3Camera.prototype.toString = function() {
	return "camera[\n" +
			"eye   :" + this.eye    + ",\n" +
			"center:" + this.center + ",\n" +
			"fovY  :" + this.fovY + "]";
};

var S3LightMode = {
	NONE				: 0,
	AMBIENT_LIGHT		: 1,
	DIRECTIONAL_LIGHT	: 2,
	POINT_LIGHT			: 3
};
var S3Light = function() {
	this.init();
};
S3System.prototype.createLight = function() {
	return new S3Light();
};
S3Light.prototype.clone = function() {
	var light = new S3Light();
	light.mode		= this.mode;
	light.power		= this.power;
	light.range		= this.range;
	light.position	= this.position;
	light.direction	= this.direction;
	light.color		= this.color;
	return light;
};
S3Light.prototype.init = function() {
	this.mode		= S3LightMode.DIRECTIONAL_LIGHT;
	this.power		= 1.0;
	this.range		= 1000.0;
	this.position	= new S3Vector(0.0, 0.0, 0.0);
	this.direction	= new S3Vector(0.0, 0.0, -1.0);
	this.color		= new S3Vector(1.0, 1.0, 1.0);
};
S3Light.prototype.setMode = function(mode) {
	this.mode = mode;
};
S3Light.prototype.setPower = function(power) {
	this.power = power;
};
S3Light.prototype.setRange = function(range) {
	this.range = range;
};
S3Light.prototype.setPosition = function(position) {
	this.position = position;
};
S3Light.prototype.setDirection = function(direction) {
	this.direction = direction;
};
S3Light.prototype.setColor = function(color) {
	this.color = color;
};

/**
 * 描写するときのシーン (mutable)
 * @returns {S3Scene}
 */
var S3Scene = function() {
	this._init();
};
S3Scene.prototype._init = function() {
	this.camera		= new S3Camera();
	this.model		= [];
	this.light		= [];
};
S3System.prototype.createScene = function() {
	return new S3Scene();
};
S3Scene.prototype.empty = function() {
	this.model		= [];
	this.light		= [];
};
S3Scene.prototype.setCamera = function(camera) {
	this.camera = camera.clone();
};
S3Scene.prototype.addModel = function(model) {
	this.model[this.model.length] = model;
};
S3Scene.prototype.addLight = function(light) {
	this.light[this.light.length] = light;
};
S3Scene.prototype.getCamera = function() {
	return this.camera;
};
S3Scene.prototype.getModels = function() {
	return this.model;
};
S3Scene.prototype.getLights = function() {
	return this.light;
};

