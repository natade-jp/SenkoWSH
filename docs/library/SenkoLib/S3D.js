"use strict";

/* global S3Math, S3Matrix, S3Vector */

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

var S3SystemMode = {
	OPEN_GL	: 0,
	DIRECT_X	: 1
};

var S3DepthMode = {
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

var S3DimensionMode = {
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

var S3VectorMode = {
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

var S3FrontFace = {
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

var S3CullMode = {
	
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


var S3System = function() {
	this.setSystemMode(S3SystemMode.OPEN_GL);
};

S3System.prototype.setSystemMode = function(mode) {
	this.systemmode = mode;
	if(this.systemmode === S3SystemMode.OPEN_GL) {
		this.depthmode		= S3DepthMode.OPEN_GL;
		this.dimensionmode	= S3DimensionMode.RIGHT_HAND;
		this.vectormode		= S3VectorMode.VECTOR4x1;
		this.frontface		= S3FrontFace.COUNTER_CLOCKWISE;
		this.cullmode		= S3CullMode.BACK;
	}
	else {
		this.depthmode		= S3DepthMode.DIRECT_X;
		this.dimensionmode	= S3DimensionMode.LEFT_HAND;
		this.vectormode		= S3VectorMode.VECTOR1x4;
		this.frontface		= S3FrontFace.CLOCKWISE;
		this.cullmode		= S3CullMode.BACK;
	}
};

S3System.prototype.setCanvas2D = function(canvas) {
	var that = this;
	this.canvas = canvas;
	this.context2d = {
		context : this.canvas.getContext("2d"),
		drawLine : function(v0, v1) {
			this.context.beginPath();
			this.context.moveTo( v0.x, v0.y );
			this.context.lineTo( v1.x, v1.y );
			this.context.stroke();
		},
		drawLinePolygon : function(v0, v1, v2) {
			this.context.beginPath();
			this.context.moveTo( v0.x, v0.y );
			this.context.lineTo( v1.x, v1.y );
			this.context.lineTo( v2.x, v2.y );
			this.context.closePath();
			this.context.stroke();
		},
		setLineWidth : function(width) {
			this.context.lineWidth = width;
		},
		setLineColor : function(color) {
			this.context.strokeStyle = color;
		},
		clear : function() {
			this.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
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
	if(this.cullmode === S3CullMode.NONE) {
		return false;
	}
	if(this.cullmode === S3CullMode.FRONT_AND_BACK) {
		return true;
	}
	var isclock = S3Vector.isClockwise(p1, p2, p3);
	if(isclock === null) {
		return true;
	}
	else if(!isclock) {
		if(this.frontface === S3FrontFace.CLOCKWISE) {
			return this.cullmode !== S3CullMode.BACK;
		}
		else {
			return this.cullmode !== S3CullMode.FRONT;
		}
	}
	else {
		if(this.frontface === S3FrontFace.CLOCKWISE) {
			return this.cullmode === S3CullMode.BACK;
		}
		else {
			return this.cullmode === S3CullMode.FRONT;
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
	
	if(this.depthmode === S3DepthMode.DIRECT_X) {
		M.m22 = MinZ - MaxZ;
		M.m32 = MinZ;
	}
	else if(this.depthmode === S3DepthMode.OPEN_GL) {
		M.m22 = (MinZ - MaxZ) / 2;
		M.m32 = (MinZ + MaxZ) / 2;
	}
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
 * @returns {S3Matrix}
 */
S3System.prototype.getMatrixPerspectiveFov = function(fovY, Aspect, Far, Near) {
	var arc = S3Math.radius(fovY);
	var zoomY = 1.0 / Math.tan(arc / 2.0);
	var zoomX = zoomY / Aspect;
	var M = new S3Matrix();
	M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 1.0;
	var Delta = Far - Near;
	if(Delta === 0.0) {
		throw "divide error";
	}
	if(this.depthmode === S3DepthMode.DIRECT_X) {
		M.m22 = Far / Delta;
		M.m32 = - Far * Near / Delta;
	}
	else if(this.depthmode === S3DepthMode.OPEN_GL) {
		M.m22 = (Far + Near) / Delta;
		M.m32 = - 2.0 * Far * Near / Delta;
	}
	if(this.dimensionmode === S3DimensionMode.RIGHT_HAND) {
		M.m22 = - M.m22;
		M.m23 = - M.m23;
	}
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
	if(this.dimensionmode === S3DimensionMode.RIGHT_HAND) {
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
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
	return this.vectormode === S3VectorMode.VECTOR4x1 ? M.transposed() : M;
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
		return (this.vectormode === S3VectorMode.VECTOR4x1) ? B.mul(A) : A.mul(B);
	}
	else if(B instanceof S3Vector) {
		// 横型の場合は、[vA]=u
		// 縦型の場合は、[Av]=u
		return (this.vectormode === S3VectorMode.VECTOR4x1) ? A.mul(B) : B.mul(A);
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

/**
 * 頂点 (immutable)
 * @param {S3Vector} position 座標
 * @param {S3Vector} normal レンダリング前の法線値（計算して予め求める必要あり）
 * @param {Number} rhw レンダリング値の透視変換のときに使用する、普段は使用しない
 * @returns {S3Vertex}
 */
var S3Vertex = function(position, normal, rhw) {
	this.position	= position;
	if(rhw !== undefined) {
		this.normal		= normal;
	}
	if(rhw !== undefined) {
		this.rhw		= rhw;
	}
	else {
		this.rhw		= 1.0;
	}
};
S3Vertex.prototype.clone = function() {
	return new S3Vertex(this.position, this.normal, this.rhw);
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
	this.init(i1, i2, i3, indexlist, materialIndex, uvlist);
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
S3TriangleIndex.prototype.init = function(i1, i2, i3, indexlist, materialIndex, uvlist) {
	if((indexlist instanceof Array) && (indexlist.length > 0)) {
		this.i1 = indexlist[i1];
		this.i2 = indexlist[i2];
		this.i3 = indexlist[i3];
	}
	if((uvlist instanceof Array) && (uvlist.length > 0) && (uvlist[0] instanceof S3Vector)) {
		this.uv1 = uvlist[i1];
		this.uv2 = uvlist[i2];
		this.uv3 = uvlist[i3];
	}
	materialIndex = materialIndex      ? materialIndex : 0;
	materialIndex = materialIndex >= 0 ? materialIndex : 0;
	this.materialIndex = materialIndex;
};
S3TriangleIndex.prototype.clone = function() {
	return new S3TriangleIndex(
		0, 1, 2,
		[this.i1, this.i2, this.i3],
		this.materialIndex,
		[this.uv1, this.uv2, this.uv3] );
};
S3TriangleIndex.prototype.inverse = function() {
	return new S3TriangleIndex(
		2, 1, 0,
		[this.i1, this.i2, this.i3],
		this.materialIndex,
		[this.uv1, this.uv2, this.uv3] );
};

/**
 * 素材
 * @param {String} name
 * @returns {S3Material}
 */
var S3Material = function(name) {
	this.name	= name;
};
S3Material.prototype.clone = function() {
	return new S3Material(this.name);
};

/**
 * 立体物 (mutable)
 * @param {Array} vertex
 * @param {Array} index
 * @param {Array} material
 * @returns {S3Mesh}
 */
var S3Mesh = function(vertex, index, material) {
	this.init(vertex, index, material);
};
S3Mesh.prototype.init = function(vertex, index, material) {
	this.cleanVertex();
	this.cleanTriangleIndex();
	this.cleanMaterial();
	this.addVertex(vertex);
	this.addTriangleIndex(index);
	this.addMaterial(material);
};
S3Mesh.prototype.clone = function() {
	return new S3Mesh(this.vertex, this.index);
};
S3Mesh.prototype.cleanVertex = function() {
	this.vertex = [];
};
S3Mesh.prototype.cleanTriangleIndex = function() {
	this.index		= [];
};
S3Mesh.prototype.cleanMaterial = function() {
	this.material	= [];
	this.material[0] = new S3Material("s3default");
	this.material_length = 0;
};
S3Mesh.prototype.addVertex = function(vertex) {
	// 一応 immutable なのでそのままシャローコピー
	if(vertex === undefined) {
	}
	else if(vertex instanceof S3Vertex) {
		this.vertex[this.vertex.length] = vertex;
	}
	else {
		var i = 0;
		for(i = 0; i < vertex.length; i++) {
			this.vertex[this.vertex.length] = vertex[i];
		}
	}
};
S3Mesh.prototype.addTriangleIndex = function(triangleindex) {
	// 一応 immutable なのでそのままシャローコピー
	if(triangleindex === undefined) {
	}
	else if(triangleindex instanceof S3TriangleIndex) {
		this.index[this.index.length] = triangleindex;
	}
	else {
		var i = 0;
		for(i = 0; i < triangleindex.length; i++) {
			this.index[this.index.length] = triangleindex[i];
		}
	}
};
S3Mesh.prototype.addMaterial = function(material) {
	// 一応 immutable なのでそのままシャローコピー
	if(material === undefined) {
	}
	else if(material instanceof S3Material) {
		this.material[this.material_length++] = material;
	}
	else {
		var i = 0;
		for(i = 0; i < material.length; i++) {
			this.material[this.material_length++] = material[i];
		}
	}
};

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

S3Mesh.fromJSON = function(meshdata) {
	var mesh = new S3Mesh();
	var i, j;
	var material = 0;
	// 材質名とインデックスを取得
	for(var materialname in meshdata.Indexes) {
		mesh.addMaterial(new S3Material(materialname));
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
	return mesh;
};
S3Mesh.prototype.toJSON = function() {
	var i, j;
	var material_vertexlist = [];
	// 材質リストを取得
	for(i = 0; i < this.material.length; i++) {
		material_vertexlist[i] = {
			material: this.material[i],
			list:[]
		};
	}
	// 材質名に合わせて、インデックスリストを取得
	for(i = 0; i < this.index.length; i++) {
		material_vertexlist[this.index[i].materialIndex].list.push(
			[ this.index[i].i1, this.index[i].i2, this.index[i].i3 ]);
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
	for(i = 0; i < this.vertex.length; i++) {
		var vp = this.vertex[i].position;
		output.push("\t\t[" + vp.x + " " + vp.y + " " + vp.z + "]" + ((vp === this.vertex.length - 1) ? "" : ",") );
	}
	output.push("\t]");
	output.push("}");
	return(output.join("\n"));
};

/**
 * 色々な情報をいれたモデル (mutable)
 * @returns {S3Model}
 */
var S3Model = function() {
	this.angles		= new S3Angles();
	this.scale		= new S3Vector(1, 1, 1);
	this.position	= new S3Vector(0, 0, 0);
	this.mesh		= new S3Mesh();
};
S3Model.prototype.setMesh = function(mesh) {
	this.mesh = mesh.clone();
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
 * @returns {S3Camera}
 */
var S3Camera = function() {
	this.init();
};
S3Camera.prototype.setSystemMode = function(mode) {
	this.systemmode = mode;
	if(this.systemmode === S3SystemMode.OPEN_GL) {
		this.dimensionmode	= S3DimensionMode.RIGHT_HAND;
	}
	else {
		this.dimensionmode	= S3DimensionMode.LEFT_HAND;
	}
};
S3Camera.prototype.init = function() {
	this.fovY		= 45;
	this.eye		= new S3Vector(0, 0, 0);
	this.center		= new S3Vector(0, 0, 1);
	this.near		= 0;
	this.far		= 1000;
	this.setSystemMode(S3SystemMode.OPEN_GL);
};
S3Camera.prototype.clone = function() {
	var camera = new S3Camera();
	camera.fovY		= this.fovY;
	camera.eye		= this.eye;
	camera.center	= this.center;
	camera.near		= this.near;
	camera.far		= this.far;
	camera.setSystemMode(this.systemmode);
	return camera;
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
	if(this.dimensionmode === S3DimensionMode.RIGHT_HAND) {
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

/**
 * 描写するときのシーン (mutable)
 * @returns {S3Scene}
 */
var S3Scene = function() {
	this.camera		= new S3Camera();
	this.model		= [];
};
S3Scene.prototype.empty = function() {
	this.model		= [];
};
S3Scene.prototype.setCamera = function(camera) {
	this.camera = camera.clone();
};
S3Scene.prototype.addModel = function(model) {
	this.model[this.model.length] = model;
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
S3System.prototype.drawAxis = function(scene) {
	var ML = this._calcBaseMatrix(scene.camera, this.canvas);
	
	var vertexvector = [];
	vertexvector[0] = new S3Vector(0, 0, 0);
	vertexvector[1] = new S3Vector(10, 0, 0);
	vertexvector[2] = new S3Vector(0, 10, 0);
	vertexvector[3] = new S3Vector(0, 0, 10);
	
	var newvector = [];
	var i = 0;
	var M = this.mulMatrix(ML.LookAt, ML.PerspectiveFov);
	for(i = 0; i < vertexvector.length; i++) {
		var p = vertexvector[i];
		p = this.mulMatrix(M, p);
		p = p.mul(1.0 / p.w);
		p = this.mulMatrix(ML.Viewport, p);
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

S3System.prototype._calcVertexTransformation = function(vertexlist, M1, M2) {
	var i;
	var newvertexlist = [];
	
	for(i = 0; i < vertexlist.length; i++) {
		var p = vertexlist[i].position;
		p = this.mulMatrix(M1, p);
		var rhw = p.w;
		p = p.mul(1.0 / rhw);
		p = this.mulMatrix(M2, p);
		newvertexlist[i] = new S3Vertex(p, rhw);
	}
	return newvertexlist;
};

S3System.prototype._calcBaseMatrix = function(camera, canvas) {
	var x = S3System.calcAspect(canvas.width, canvas.height);
	// ビューイング変換行列を作成する
	var L = this.getMatrixLookAt(camera.eye, camera.center);
	// 射影トランスフォーム行列
	var P = this.getMatrixPerspectiveFov(camera.fovY, x, camera.near, camera.far );
	// ビューポート行列
	var V = this.getMatrixViewport(0, 0, canvas.width, canvas.height);
	return { LookAt : L, aspect : x, PerspectiveFov : P, Viewport :V };
};



S3System.prototype._drawPolygon = function(vetexlist, indexlist) {
	var i = 0;
	
	for(i = 0; i < indexlist.length; i++) {
		var index = indexlist[i];
		if(this.testCull(
			vetexlist[index.i1].position,
			vetexlist[index.i2].position,
			vetexlist[index.i3].position )) {
				continue;
		}
		this.context2d.drawLinePolygon(
			vetexlist[index.i1].position,
			vetexlist[index.i2].position,
			vetexlist[index.i3].position
		);
	}
};


S3System.prototype.drawScene = function(scene) {
	var ML = this._calcBaseMatrix(scene.camera, this.canvas);
	
	this.context2d.setLineWidth(1.0);
	this.context2d.setLineColor("rgb(0, 0, 0)");
	
	var i = 0;
	for(i = 0; i < scene.model.length; i++) {
		var model = scene.model[i];
		var W = this.getMatrixWorldTransform(model);
		var M = this.mulMatrix(this.mulMatrix(W, ML.LookAt), ML.PerspectiveFov);
		var vlist = this._calcVertexTransformation(model.mesh.vertex, M, ML.Viewport);
		this._drawPolygon(vlist, model.mesh.index);
	}
};


