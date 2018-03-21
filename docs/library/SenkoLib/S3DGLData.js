/* global S3Vector, S3Material, S3TriangleIndex, S3Vertex, S3Mesh, S3Model, S3Scene, S3LightMode, Float32Array, S3System.DIMENSION_MODE, S3System, S3Matrix, S3Light, ArrayBufferView, ImageData, HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, S3Texture */

﻿"use strict";

﻿/**
 * SenkoLib S3DGLData.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 * 
 * DEPENDENT LIBRARIES:
 *  S3D.js
 */

/**
 * /////////////////////////////////////////////////////////
 * S3DをWebGLに拡張するため、WebGLのデータ用のメソッドの機能を追加する
 * /////////////////////////////////////////////////////////
 */

/**
 * WebGL用の頂点 (immutable)
 * @param {Object} data 数値／配列／S3Vector/S3Matrix
 * @param {Number} dimension 例えば3次元のベクトルなら、3
 * @param {S3GLVertex.datatype} datatype
 * @returns {S3GLVertex}
 */
var S3GLVertex = function(data, dimension, datatype) {
	// 引数の情報(S3GLVertex.datatype.instance)を用いて、
	// JS用配列を、WEBGL用配列に変換して保存する
	if(data instanceof datatype.instance) {
		this.data	= data;
	}
	else if((data instanceof S3Vector) || (data instanceof S3Matrix)) {
		this.data	= data.toInstanceArray(datatype.instance, dimension);
	}
	else if(data instanceof Array) {
		this.data	= new datatype.instance(data);
	}
	else if(!isNaN(data)) {
		this.data	= new datatype.instance([data]);
	}
	else {
		throw "IllegalArgumentException";
	}
	this.dimension	= dimension;
	this.datatype	= datatype;
	
	var instance = "";
	if(data instanceof S3Vector) {
		instance = "S3Vector";
	}
	else if(data instanceof S3Matrix) {
		instance = "S3Matrix";
	}
	else {
		instance = "Number";
	}
	
	this.glsltype = S3GLVertex.gltypetable[datatype.name][instance][dimension];
	
};
// Int32Array を一応定義してあるが、整数型は補間できないため、Attributeには使用できない。
S3GLVertex.datatype = {
	"Float32Array"	: { instance	: Float32Array,	name	: "Float32Array"	},
	"Int32Array"	: { instance	: Int32Array,	name	: "Int32Array"		}
};
S3GLVertex.gltypetable = {
	"Float32Array"	: {
		"Number"	:	{
			1	:	"float",
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Vector"	:	{
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Matrix"	:	{
			4	:	"mat2",
			9	:	"mat3",
			16	:	"mat4"
		}
	},
	"Int32Array"	: {
		"Number"	:	{
			1	:	"int",
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		},
		"S3Vector"	:	{
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		}
	}
};

/**
 * /////////////////////////////////////////////////////////
 * 素材にメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

S3Texture.prototype.getGLData = function() {
	if(this.is_dispose) {
		return null;
	}
	if(this.gldata) {
		return this.gldata;
	}
	if(this.is_loadimage) {
		this.gldata = this.sys.glfunc.createTexture(this.url, this.image);
		return this.gldata;
	}
	return null;
};

S3Material.prototype.getGLHash = function() {
	// 名前は被らないので、ハッシュに使用する
	return this.name;
};

/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * uniform の数がハードウェア上限られているため、送る情報は選定すること
 * @returns {頂点データ（色情報）}
 */
S3Material.prototype.getGLData = function() {
	return {
		materialsColor		:
			new S3GLVertex([this.color.x, this.color.y, this.color.z, this.diffuse]			, 4, S3GLVertex.datatype.Float32Array),
		materialsSpecular	:
			new S3GLVertex([this.specular.x, this.specular.y, this.specular.z, this.power]	, 4, S3GLVertex.datatype.Float32Array),
		materialsEmission	:
			new S3GLVertex(this.emission	, 3, S3GLVertex.datatype.Float32Array),
		materialsAmbientAndReflect	:
			new S3GLVertex([this.ambient.x, this.ambient.y, this.ambient.z, this.reflect]	, 4, S3GLVertex.datatype.Float32Array)
	};
};


/**
 * /////////////////////////////////////////////////////////
 * ライト情報にデータ取得用のメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

S3Light.prototype.getGLHash = function() {
	return "" + this.mode + this.power + this.range + this.position.toString() + this.direction.toString() + this.color.toString();
};

S3Light.prototype.getGLData = function() {
	var lightsColor = this.color.mul(this.power);
	var lightsVector = new S3Vector();
	if(this.mode === S3LightMode.DIRECTIONAL_LIGHT) {
		lightsVector = this.direction;
	}
	else if(this.mode === S3LightMode.POINT_LIGHT) {
		lightsVector = this.position;
	}
	return {
		lightsMode		: new S3GLVertex(this.mode,			1, S3GLVertex.datatype.Int32Array),
		lightsRange		: new S3GLVertex(this.range,		1, S3GLVertex.datatype.Float32Array),
		lightsVector	: new S3GLVertex(lightsVector,		3, S3GLVertex.datatype.Float32Array),
		lightsColor		: new S3GLVertex(lightsColor,		3, S3GLVertex.datatype.Float32Array)
	};
};

/**
 * /////////////////////////////////////////////////////////
 * 3つの頂点を持つポリゴン情報にデータ取得用のメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

/**
 * テクスチャで利用するUV情報を持つか持たないか
 * @returns {Boolean}
 */
S3TriangleIndex.prototype.isEnabledTexture = function() {
	return !(this.uv === undefined);
};

S3TriangleIndex.prototype.getGLHash = function(number, vertexList) {
	var uvdata = this.isEnabledTexture() ? this.uv[number].toString(2) : "";
	var vertex   = vertexList[this.index[number]].getGLHash();
	return vertex + this.materialIndex + uvdata;
};

/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @param {Integer} number 三角形の何番目の頂点データを取得するか
 * @param {S3Vertex[]} vertexList 頂点の配列
 * @returns {頂点データ（座標、素材番号、UV値が入っている）}
 */
S3TriangleIndex.prototype.getGLData = function(number, vertexList) {
	var vertex		= {};
	var vertexdata_list = null;
	vertexdata_list	= vertexList[this.index[number]].getGLData();
	for(var key in vertexdata_list) {
		vertex[key]	= vertexdata_list[key];
	}
	var uvdata = this.isEnabledTexture() ? this.uv[number] : new S3Vector(0.0, 0.0, 0.0);
	vertex.vertexTextureCoord	= new S3GLVertex(uvdata, 2, S3GLVertex.datatype.Float32Array);
	vertex.vertexMaterialFloat	= new S3GLVertex(this.materialIndex, 1, S3GLVertex.datatype.Float32Array);
	return vertex;
};

/**
 * /////////////////////////////////////////////////////////
 * 頂点にデータ取得用のメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

/**
 * 法線情報が定義済みかどうか
 * @returns {Boolean}
 */
S3Vertex.prototype.isEnabledNormal = function() {
	return this.normal !== undefined;
};
S3Vertex.prototype.getGLHash = function() {
	var ndata = this.isEnabledNormal() ? this.normal.toString(3) : "";
	return this.position.toString(3) + ndata;
};
/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @returns {頂点データ（座標、法線情報）}
 */
S3Vertex.prototype.getGLData = function() {
	var ndata = this.isEnabledNormal() ? this.normal : new S3Vector(0.33, 0.33, 0.33);
	return {
		vertexNormal	: new S3GLVertex(ndata, 3, S3GLVertex.datatype.Float32Array),
		vertexPosition	: new S3GLVertex(this.position, 3, S3GLVertex.datatype.Float32Array)
	};
};

/**
 * /////////////////////////////////////////////////////////
 * 既存の部品に WebGL 用の情報を記録するための拡張
 * 主に、描写のための VBO と IBO を記録する
 * /////////////////////////////////////////////////////////
 */

var S3GLMesh = function(sys) {
	this.sys = sys;
	this.super = S3Mesh.prototype;
	this.super._init.call(this);
};
S3GLMesh.prototype = new S3Mesh();

/**
 * 自分が持っている頂点情報に、メッシュの形から自動計算した法線情報を付け加える
 * @returns {undefined}
 */
S3GLMesh.prototype._makeNormalMap = function() {
	var i, j;
	var vertex_list			= this.getVertexArray();
	var triangleindex_list	= this.getTriangleIndexArray();
	var normal_stacklist	= [];
	
	// ノーマルベクトルを収集するクラス
	var VectorList = function() {
		this.vector_list = [];
	};
	VectorList.prototype.add = function(vector) {
		this.vector_list.push(vector);
	};
	// 近いベクトルがあるかないか
	VectorList.prototype.isNearVector = function(vector) {
		var i;
		for(i = 0;i < this.vector_list.length; i++) {
			if(this.vector_list[i].equals(vector)) {
				return true;
			}
		}
		return false;
	};
	
	// 各面の法線を調べて、スタックへ配列へ保存していく
	for(i = 0; i < triangleindex_list.length; i++) {
		var triangleindex = triangleindex_list[i];
		var indexlist = triangleindex.index;
		var normal = null;
		// 3点を時計回りで通る平面が表のとき
		if(this.sys.dimensionmode === S3System.DIMENSION_MODE.LEFT_HAND) {
			normal = S3Vector.getNormalVector(
				vertex_list[indexlist[0]].position,
				vertex_list[indexlist[1]].position,
				vertex_list[indexlist[2]].position
			);
		}
		else {
			normal = S3Vector.getNormalVector(
				vertex_list[indexlist[2]].position,
				vertex_list[indexlist[1]].position,
				vertex_list[indexlist[0]].position
			);
		}
		// 頂点の位置が直行しているなどのエラー処理
		if(!(normal instanceof S3Vector)) {
			normal = new S3Vector(0.3333, 0.3333, 0.3333);
		}
		// 計算したノーマルマップを保存する
		for(j = 0; j < 3; j++) {
			var index = indexlist[j];
			if(normal_stacklist[index] === undefined) {
				normal_stacklist[index] = [];
			}
			normal_stacklist[index].push(normal);
		}
	}
	
	// 各頂点の法線は、法線の平均値とする
	for(i = 0; i < vertex_list.length; i++) {
		var normal;
		if(normal_stacklist[i] === undefined) {
			// インデックスとして未使用の頂点の場合は、法線の計算は存在しない
			normal = new S3Vector(0.3333, 0.3333, 0.3333);
		}
		else {
			var vlist = new VectorList();
			normal = S3Vector.ZERO;
			for(j = 0; j < normal_stacklist[i].length; j++) {
				var normalvector = normal_stacklist[i][j];
				// 同じ方向を向いている法線は1つとしてカウント
				if(!vlist.isNearVector(normalvector)) {
					normal = normal.add(normalvector);
					vlist.add(normalvector);
				}
			}
			normal = normal.normalize();
		}
		vertex_list[i] = new S3Vertex(vertex_list[i].position, normal);
	}
};

/**
 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
 * @returns {undefined}
 */
S3GLMesh.prototype._getGLArrayData = function() {
	
	var vertex_list			= this.getVertexArray();
	var triangleindex_list	= this.getTriangleIndexArray();
	var i, j;
	var hashlist = [];
	var vertex_length = 0;
	
	var triangle			= [];
	var vertextypelist	= {};
	
	// インデックスを再構築して、VBOとIBOを作る
	// 今の生データだと、頂点情報、素材情報がばらばらに保存されているので
	// 1つの頂点情報（位置、色等）を1つのセットで保存する必要がある
	// 面に素材が結びついているので、面が1つの頂点を共有していると
	// それらの面の素材情報によって、別の頂点として扱う必要がある
	// なので基本的には頂点情報を毎回作り直す必要があるが、
	// 1度作ったものと等しいものが必要であれば、キャッシュを使用する
	for(i = 0; i < triangleindex_list.length; i++) {
		var triangleindex = triangleindex_list[i];
		var hash;
		var indlist = [];
		// ポリゴンの各頂点を調べる
		for(j = 0; j < 3; j++) {
			// その頂点（面の情報（UVなど）も含めたデータ）のハッシュ値を求める
			hash = triangleindex.getGLHash(j, vertex_list);
			// すでに以前と同一の頂点があるならば、その頂点アドレスを選択。ない場合は新しいアドレス
			var hit = hashlist[hash];
			indlist[j] = (hit !== undefined) ? hit : vertex_length;
			// 頂点がもしヒットしていなかったら
			if(hit === undefined) {
				// 頂点データを作成して
				var vertexdata = triangleindex.getGLData(j, vertex_list);
				hashlist[hash]  = vertex_length;
				// 頂点にはどういった情報があるか分からないので、in を使用する。
				// key には、position / normal / color / uv などがおそらく入っている
				for(var key in vertexdata) {
					if(vertextypelist[key] === undefined) {
						vertextypelist[key]		= [];
					}
					vertextypelist[key].push(vertexdata[key]);
				}
				vertex_length++;
			}
		}
		// 3つの頂点のインデックスを記録
		triangle[i] = new Int16Array(indlist);
	}
	
	// データ結合処理
	// これまでは複数の配列にデータが入ってしまっているので、
	// 1つの指定した型の配列に全てをまとめる必要がある
	
	var pt = 0;
	var ibo = {};
	{
		// IBOの結合（インデックス）
		ibo.array_length	= triangleindex_list.length * 3;
		ibo.array			= new Int16Array(ibo.array_length);
		pt = 0;
		for(i = 0; i < triangleindex_list.length; i++) {
			for(j = 0; j < 3; j++) {
				ibo.array[pt++] = triangle[i][j];
			}
		}
	}
	var vbo = {};
	{
		// VBOの結合（頂点）
		// 位置、法線、色などを、それぞれ1つの配列として記録する
		for(var key in vertextypelist) {
			var srcdata		= vertextypelist[key];
			var dimension	= srcdata[0].dimension;
			var dstdata	= {};
			// 情報の名前(position / uv / normal など)
			dstdata.name			= key;
			// 1つの頂点あたり、いくつの値が必要か。例えばUVなら2次元情報
			dstdata.dimension		= srcdata[0].dimension;
			// 型情報 Float32Array / Int32Array なのかどうか
			dstdata.datatype		= srcdata[0].datatype;
			// 配列の長さ
			dstdata.array_length	= dimension * vertex_length;
			// 型情報と、配列の長さから、メモリを確保する
			dstdata.array			= new dstdata.datatype.instance(dstdata.array_length);
			// data を1つの配列に結合する
			pt = 0;
			for(i = 0; i < vertex_length; i++) {
				for(j = 0; j < dimension; j++) {
					dstdata.array[pt++] = srcdata[i].data[j];
				}
			}
			// VBOオブジェクトに格納
			vbo[key] = dstdata;
		}
	}
	
	var arraydata = {};
	arraydata.ibo		= ibo;
	arraydata.vbo		= vbo;
	return arraydata;
};

S3GLMesh.prototype.disposeGLData = function() {
	// コンパイルしていなかったら抜ける
	if(!this.isCompileGL()) {
		return;
	}
	var gldata = this.getGLData();
	if(gldata !== null) {
		if(gldata.ibo !== undefined) {
			if(gldata.ibo.data !== undefined) {
				this.sys.glfunc.deleteBuffer(gldata.ibo.data);
			}
			delete gldata.ibo;
		}
		if(gldata.vbo !== undefined) {
			for(var key in gldata.vbo) {
				if(gldata.vbo[key].data !== undefined) {
					this.sys.glfunc.deleteBuffer(gldata.vbo[key].data);
				}
			}
			delete gldata.vbo;
		}
		{
			var material_list = this.getMaterialArray();
			for(var i = 0; i < material_list.length; i++) {
				material_list[i].textureDiffuse.dispose();
				material_list[i].textureNormal.dispose();
			}
		}
	}
	delete this.gldata;
	this.gldata = {};
	this.setCompileGL(false);
};

/**
 * VBO/IBOを作成するため、使用中のWEBGL情報を設定し、データを作成する
 * @returns {S3GLMesh.gldata}
 */
S3GLMesh.prototype.getGLData = function() {
	// すでに存在している場合は、返す
	if(this.isCompileGL()) {
		return this.gldata;
	}
	// 完成していない場合は null
	if(this.isComplete() === false) {
		return null;
	}
	// GLを取得できない場合も、この時点で終了させる
	if(!this.sys.isSetGL()) {
		return null;
	}
	// 作成
	this._makeNormalMap(); // ノーマルマップを作成して
	var gldata = this._getGLArrayData(); // GL用の配列データを作成
	// IBO / VBO 用のオブジェクトを作成
	gldata.ibo.data = this.sys.glfunc.createBufferIBO(gldata.ibo.array);
	for(var key in gldata.vbo) {
		gldata.vbo[key].data = this.sys.glfunc.createBufferVBO(gldata.vbo[key].array);
	}
	// 代入
	this.gldata = gldata;
	this.setCompileGL(true);
	return this.gldata;
};

/**
 * /////////////////////////////////////////////////////////
 * Uniform系
 * /////////////////////////////////////////////////////////
 */

var S3GLModel = function() {
	this.super = S3Model.prototype;
	this.super._init.call(this);
};
S3GLModel.prototype = new S3Model();
S3GLModel.prototype.getUniforms = function() {
	var uniforms				= {};
	{
		var MATELIAL_MAX			= 4;
		var material_array			= this.getMesh().getMaterialArray();
		var materialLength			= Math.min(material_array.length, MATELIAL_MAX);
		for(var i = 0; i < materialLength; i++) {
			var data = material_array[i].getGLData();
			for(var key in data) {
				if(!uniforms[key]) {
					uniforms[key] = [];
				}
				uniforms[key].push(data[key]);
			}
		}
	}
	var ret = [];
	ret.uniforms = uniforms;
	return ret;
};

var S3GLScene = function() {
	this.super = S3Scene.prototype;
	this.super._init.call(this);
};
S3GLScene.prototype = new S3Scene();
S3GLScene.prototype.getUniforms = function() {
	var uniforms			= {};
	// カメラ情報もUniformで送る
	{
		uniforms.eyeWorldDirection = this.getCamera().getDirection();
	}
	// ライト情報はUniformで送る
	{
		var LIGHTS_MAX			= 4;
		var light_array			= this.getLights();
		var lightsLength		= Math.min(light_array.length, LIGHTS_MAX);
		uniforms.lightsLength	= new S3GLVertex(lightsLength, 1, S3GLVertex.datatype.Int32Array);
		for(var i = 0; i < lightsLength; i++) {
			var data = light_array[i].getGLData();
			for(var key in data) {
				if(!uniforms[key]) {
					uniforms[key] = [];
				}
				uniforms[key].push(data[key]);
			}
		}
	}
	var ret = [];
	ret.uniforms = uniforms;
	return ret;
};

