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
	if(this.gldata !== null) {
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
	// テクスチャを取得
	var tex_color	= this.textureColor.getGLData();
	var tex_normal	= this.textureNormal.getGLData();
	// テクスチャのありなしフラグを作成。ない場合はダミーデータを入れる。
	var tex_exist	= [tex_color === null?0:1, tex_normal === null?0:1];
	tex_color	= tex_color === null	? this.sys._getDummyTexture() : tex_color;
	tex_normal	= tex_normal === null	? this.sys._getDummyTexture() : tex_normal;
	return {
		materialsColorAndDiffuse	:
			new S3GLVertex([this.color.x, this.color.y, this.color.z, this.diffuse]			, 4, S3GLVertex.datatype.Float32Array),
		materialsSpecularAndPower	:
			new S3GLVertex([this.specular.x, this.specular.y, this.specular.z, this.power]	, 4, S3GLVertex.datatype.Float32Array),
		materialsEmission	:
			new S3GLVertex(this.emission	, 3, S3GLVertex.datatype.Float32Array),
		materialsAmbientAndReflect	:
			new S3GLVertex([this.ambient.x, this.ambient.y, this.ambient.z, this.reflect]	, 4, S3GLVertex.datatype.Float32Array),
		materialsTextureExist	:
			new S3GLVertex(tex_exist	, 2, S3GLVertex.datatype.Float32Array),
		materialsTextureColor	:	tex_color,
		materialsTextureNormal	:	tex_normal
	};
};

/**
 * /////////////////////////////////////////////////////////
 * ライト情報にデータ取得用のメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

S3Light.prototype.getGLHash = function() {
	return "" + this.mode + this.power + this.range + this.position.toString(3) + this.direction.toString(3) + this.color.toString(3);
};

S3Light.prototype.getGLData = function() {
	var lightsColor = this.color.mul(this.power);
	var lightsVector = new S3Vector();
	// uniform 節約のためにライト用のベクトルは用途によって入れる値を変更する
	if(this.mode === S3LightMode.DIRECTIONAL_LIGHT) {
		lightsVector = this.direction;
	}
	else if(this.mode === S3LightMode.POINT_LIGHT) {
		lightsVector = this.position;
	}
	// uniform 節約のために最終的に渡すデータをまとめる
	return {
		lightsData1	: new S3GLVertex([this.mode, this.range, lightsVector.x, lightsVector.y] , 4, S3GLVertex.datatype.Float32Array),
		lightsData2	: new S3GLVertex([lightsVector.z, lightsColor.x, lightsColor.y, lightsColor.z] , 4, S3GLVertex.datatype.Float32Array)
	};
};

/**
 * /////////////////////////////////////////////////////////
 * 3つの頂点を持つポリゴン情報にデータ取得用のメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

S3TriangleIndex.prototype.createGLTriangleIndexData = function() {
	return new S3GLTriangleIndexData(this);
};

var S3GLTriangleIndexData = function(triangle_index) {
	this.index				= triangle_index.index;				// 各頂点を示すインデックスリスト
	this.materialIndex		= triangle_index.materialIndex;		// 面の材質
	this.uv					= triangle_index.uv;				// 各頂点のUV座標
	this._isEnabledTexture	= triangle_index.uv[0] !== null;	// UV情報があるか
	
	this.face				= {};
	this.vertex				= {};
	// S3Vector.getTangentVectorの取得値を格納用
	this.face.normal		= null;							// 面の法線情報
	this.face.tangent		= null;							// 面の接線情報
	this.face.binormal		= null;							// 面の従法線情報
	this.vertex.normal		= [null, null, null];			// 頂点ごとの法線
	this.vertex.tangent		= [null, null, null];			// 頂点ごとの接線 
	this.vertex.binormal	= [null, null, null];			// 頂点ごとの従法線 
};

S3GLTriangleIndexData.prototype.getGLHash = function(number, vertexList) {
	var uvdata = this._isEnabledTexture ? this.uv[number].toString(2) + this.face.binormal.toString(2) + this.face.tangent.toString(2): "";
	var vertex   = vertexList[this.index[number]].getGLHash();
	return vertex + this.materialIndex + uvdata + this.vertex.normal[number].toString(3);
};

/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @param {Integer} number 三角形の何番目の頂点データを取得するか
 * @param {S3Vertex[]} vertexList 頂点の配列
 * @returns {頂点データ（座標、素材番号、UV値が入っている）}
 */
S3GLTriangleIndexData.prototype.getGLData = function(number, vertexList) {
	var vertex		= {};
	var vertexdata_list = vertexList[this.index[number]].getGLData();
	for(var key in vertexdata_list) {
		vertex[key]	= vertexdata_list[key];
	}
	var uvdata = this._isEnabledTexture ? this.uv[number] : new S3Vector(0.0, 0.0);
	vertex.vertexTextureCoord	= new S3GLVertex(uvdata, 2, S3GLVertex.datatype.Float32Array);
	vertex.vertexMaterialFloat	= new S3GLVertex(this.materialIndex, 1, S3GLVertex.datatype.Float32Array);
	vertex.vertexNormal			= new S3GLVertex(this.vertex.normal[number], 3, S3GLVertex.datatype.Float32Array);
	vertex.vertexBinormal		= new S3GLVertex(this.vertex.binormal[number], 3, S3GLVertex.datatype.Float32Array);
	vertex.vertexTangent		= new S3GLVertex(this.vertex.tangent[number], 3, S3GLVertex.datatype.Float32Array);
	return vertex;
};

/**
 * /////////////////////////////////////////////////////////
 * 頂点にデータ取得用のメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

S3Vertex.prototype.getGLHash = function() {
	return this.position.toString(3);
};
/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @returns {頂点データ（座標、法線情報）}
 */
S3Vertex.prototype.getGLData = function() {
	return {
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
 * 三角形インデックス情報（頂点ごとのYV、法線）などを求める
 * 具体的には共有している頂点をしらべて、法線の平均値をとる
 * @returns {S3GLTriangleIndexData}
 */
S3GLMesh.prototype.createTriangleIndexData = function() {
	var i, j;
	var vertex_list			= this.getVertexArray();
	var triangleindex_list	= this.getTriangleIndexArray();
	var tid_list = [];
	
	var normallist = {
		normal		: null,
		tangent		: null,
		binormal	: null
	};
	
	// 各面の法線、接線、従法線を調べる
	for(i = 0; i < triangleindex_list.length; i++) {
		var triangleindex = triangleindex_list[i];
		var index	= triangleindex.index;
		var uv		= triangleindex.uv;
		tid_list[i]	= triangleindex.createGLTriangleIndexData();
		var triangledata = tid_list[i];
		var vector_list = null;
		// 3点を時計回りで通る平面が表のとき
		if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			vector_list = S3Vector.getNormalVector(
				vertex_list[index[0]].position, vertex_list[index[1]].position, vertex_list[index[2]].position,
				uv[0], uv[1], uv[2]
			);
		}
		else {
			vector_list = S3Vector.getNormalVector(
				vertex_list[index[2]].position, vertex_list[index[1]].position, vertex_list[index[0]].position,
				uv[2], uv[1], uv[0]
			);
		}
		for(var vector_name in normallist) {
			triangledata.face[vector_name] = vector_list[vector_name];
		}
	}
	
	// 素材ごとに、三角形の各頂点に、面の法線情報を追加する
	// 後に正規化する（平均値をとる）が、同じベクトルを加算しないようにキャッシュでチェックする
	var vertexdatalist_material = [];
	var vertexdatalist_material_cash = [];
	for(i = 0; i < triangleindex_list.length; i++) {
		var triangleindex = triangleindex_list[i];
		var material = triangleindex.materialIndex;
		var triangledata = tid_list[i];
		// 未登録なら新規作成する
		if(vertexdatalist_material[material] === undefined) {
			vertexdatalist_material[material] = [];
			vertexdatalist_material_cash[material] = [];
		}
		var vertexdata_list = vertexdatalist_material[material];
		var vertexdata_list_cash = vertexdatalist_material_cash[material];
		// 素材ごとの三角形の各頂点に対応する法線情報に加算していく
		for(j = 0; j < 3; j++) {
			// 未登録なら新規作成する
			var index = triangleindex.index[j];
			if(vertexdata_list[index] === undefined) {
				vertexdata_list[index] = {
					normal		: new S3Vector(0, 0, 0),
					tangent		: new S3Vector(0, 0, 0),
					binormal	: new S3Vector(0, 0, 0)
				};
				vertexdata_list_cash[index] = {
					normal		: [],
					tangent		: [],
					binormal	: []
				};
			}
			var vertexdata = vertexdata_list[index];
			var vertexdata_cash = vertexdata_list_cash[index];
			
			// 加算する
			for(var vector_name in normallist) {
				if(triangledata.face[vector_name] !== null) {
					// データが入っていたら加算する
					var id = triangledata.face[vector_name].toHash(3);
					if(vertexdata_cash[vector_name][id]) continue;
					vertexdata[vector_name] = vertexdata[vector_name].add(triangledata.face[vector_name]);
					vertexdata_cash[vector_name][id] = true;
				}
			}
		}
	}
	
	// マテリアルごとの頂点の法線を、正規化して1とする（平均値をとる）
	for(var material in vertexdatalist_material) {
		var vertexdata_list = vertexdatalist_material[material];
		for(var index in vertexdata_list) {
			var vertexdata = vertexdata_list[index];
			for(var vectorname in normallist) {
				// あまりに小さいと、0で割ることになるためチェックする
				if(vertexdata[vectorname].normFast() > 0.000001) {
					vertexdata[vectorname] = vertexdata[vectorname].normalize();
				}
			}
		}
	}
	
	// 面法線と、頂点（スムーズ）法線との角度の差が、下記より大きい場合は面法線を優先
	var SMOOTH = {};
	SMOOTH.normal	= Math.cos((50/360)*(2*Math.PI));
	SMOOTH.tangent	= Math.cos((50/360)*(2*Math.PI));
	SMOOTH.binormal	= Math.cos((50/360)*(2*Math.PI));
	
	// 最終的に三角形の各頂点の法線を求める
	for(i = 0; i < triangleindex_list.length; i++) {
		var triangleindex = triangleindex_list[i];
		var material = triangleindex.materialIndex;
		var triangledata = tid_list[i];
		var vertexdata_list = vertexdatalist_material[material];
		
		// 法線ががあまりに違うのであれば、面の法線を採用する
		for(j = 0; j < 3; j++) {
			var index = triangleindex.index[j];
			var vertexdata = vertexdata_list[index];
			for(var vectorname in normallist) {
				var targetdata;
				if(triangledata.face[vectorname]) {
					// 面で計算した値が入っているなら、
					// 面で計算した値と、頂点の値とを比較してどちらかを採用する
					var rate  = triangledata.face[vectorname].dot(vertexdata[vectorname]);
					// 指定した度以上傾いていたら、面の法線を採用する
					targetdata = (rate < SMOOTH[vectorname]) ? triangledata.face : vertexdata;
				}
				else {
					targetdata = vertexdata;
				}
				// コピー
				triangledata.vertex[vectorname][j]	= targetdata[vectorname];
			}
		}
	}
	
	return tid_list;
};

/**
 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
 * @returns {undefined}
 */
S3GLMesh.prototype._getGLArrayData = function() {
	
	var vertex_list			= this.getVertexArray();
	var triangleindex_list	= this.createTriangleIndexData();
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
				var mat = material_list[i];
				for(var key in mat) {
					var obj = mat[key];
					if(obj instanceof S3Texture) {
						obj.dispose();
					}
				}
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

