/* global S3Vector, S3Material, S3TriangleIndex, S3Vertex, S3Mesh, S3Model, S3SystemGL, S3Scene, S3LightMode, Float32Array */

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
 * @param {Object} data 数値／配列／S3Vector
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
	else if(data instanceof S3Vector) {
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
};
S3GLVertex.datatype = {
	"Float32Array"	: { instance	: Float32Array,	name	: "Float32Array"	},
	"Int32Array"	: { instance	: Int32Array,	name	: "Int32Array"		}
};

/**
 * WebGL用のライト (immutable)
 * @param {S3Scene} scene
 * @returns {S3GLLight}
 */
var S3GLLight = function(scene) {
	if(!(scene instanceof S3Scene)) {
		throw "not S3Scene";
	}
	var LIGHTS_MAX				= S3GLLight.LIGHTS_MAX;
	var light_array				= scene.light;
	var lightsLength			= Math.min([light_array.length, LIGHTS_MAX]);
	this.lights					= {};
	this.lights.lightsLength	= new Int32Array([lightsLength]);
	this.lights.lightsMode		= [];
	this.lights.lightsPower		= [];
	this.lights.lightsRange		= [];
	this.lights.lightsPosition	= [];
	this.lights.lightsDirection	= [];
	this.lights.lightsColor		= [];
	for(var i = 0; i < LIGHTS_MAX; i++) {
		var lightMode		= S3LightMode.NONE;
		var lightPower		= 0.0;
		var lightRange		= 0.0;
		var lightPosition	= new S3Vector(0.0, 0.0, 0.0);
		var lightDirection	= new S3Vector(1.0, 0.0, 0.0);
		var lightColor		= new S3Vector(0.0, 0.0, 0.0);
		if(i < lightsLength) {
			lightMode		= light_array[i].mode;
			lightPower		= light_array[i].power;
			lightRange		= light_array[i].range;
			lightPosition	= light_array[i].position;
			lightDirection	= light_array[i].direction;
			lightColor		= light_array[i].color;
		}
		this.lights.lightsMode.push(new Int32Array([lightMode]));
		this.lights.lightsPower.push(new Float32Array([lightPower]));
		this.lights.lightsRange.push(new Float32Array([lightRange]));
		this.lights.lightsPosition.push(lightPosition.toInstanceArray(Float32Array, 3));
		this.lights.lightsDirection.push(lightDirection.toInstanceArray(Float32Array, 3));
		this.lights.lightsColor.push(lightColor.toInstanceArray(Float32Array, 3));
	}
};
S3GLLight.prototype.getLights = function() {
	return this.lights;
};
S3GLLight.LIGHTS_MAX = 4;

/**
 * /////////////////////////////////////////////////////////
 * 素材にメソッドを拡張
 * /////////////////////////////////////////////////////////
 */

S3Material.prototype.getVertexHash = function() {
	// 名前は被らないので、ハッシュに使用する
	return this.name;
};

/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @returns {頂点データ（色情報）}
 */
S3Material.prototype.getVertexData = function() {
	return {
		materialColor		: new S3GLVertex(this.color		, 4, S3GLVertex.datatype.Float32Array),
		materialDiffuse		: new S3GLVertex(this.diffuse	, 1, S3GLVertex.datatype.Float32Array),
		materialEmission	: new S3GLVertex(this.emission	, 3, S3GLVertex.datatype.Float32Array),
		materialSpecular	: new S3GLVertex(this.specular	, 3, S3GLVertex.datatype.Float32Array),
		materialPower		: new S3GLVertex(this.power		, 1, S3GLVertex.datatype.Float32Array),
		materialAmbient		: new S3GLVertex(this.ambient	, 3, S3GLVertex.datatype.Float32Array)
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

S3TriangleIndex.prototype.getVertexHash = function(number, vertexList, materialList) {
	var uvdata = this.isEnabledTexture() ? this.uv[number].toString(2) : "";
	var vertex   = vertexList[this.index[number]].getVertexHash();
	var material = materialList[this.materialIndex].getVertexHash();
	return vertex + material + uvdata;
};

/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @param {Integer} number 三角形の何番目の頂点データを取得するか
 * @param {S3Vertex[]} vertexList 頂点の配列
 * @param {S3Material[]} materialList 材質の配列
 * @returns {頂点データ（座標、素材の色、UV値が入っている）}
 */
S3TriangleIndex.prototype.getVertexData = function(number, vertexList, materialList) {
	var vertex		= {};
	var vertexlist	= vertexList[this.index[number]].getVertexData();
	for(var key in vertexlist) {
		vertex[key]	= vertexlist[key];
	}
	var materiallist= materialList[this.materialIndex].getVertexData();
	for(var key in materiallist) {
		vertex[key]	= materiallist[key];
	}
	var uvdata = this.isEnabledTexture() ? this.uv[number] : new S3Vector(0.0, 0.0, 0.0);
	vertex.vertexUV		= new S3GLVertex(uvdata, 2, S3GLVertex.datatype.Float32Array);
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
S3Vertex.prototype.getVertexHash = function() {
	var ndata = this.isEnabledNormal() ? this.normal.toString(3) : "";
	return this.position.toString(3) + ndata;
};
/**
 * 頂点データを作成して取得する
 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
 * @returns {頂点データ（座標、法線情報）}
 */
S3Vertex.prototype.getVertexData = function() {
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

/**
 * 自分が持っている頂点情報に、メッシュの形から自動計算した法線情報を付け加える
 * @returns {undefined}
 */
S3Mesh.prototype._makeNormalMap = function() {
	var i, j;
	var vertex_list			= this.vertex;
	var triangleindex_list	= this.triangleindex;
	var normal_stacklist	= [];
	
	// 各面の法線を調べて、スタックへ配列へ保存していく
	for(i = 0; i < triangleindex_list.length; i++) {
		var triangleindex = triangleindex_list[i];
		var indexlist = triangleindex.index;
		// 3点を時計回りで通る平面が表のとき
		var normal = S3Vector.getNormalVector(
			vertex_list[indexlist[0]].position,
			vertex_list[indexlist[1]].position,
			vertex_list[indexlist[2]].position
		);
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
			normal = S3Vector.ZERO;
			for(j = 0; j < normal_stacklist[i].length; j++) {
				normal = normal.add(normal_stacklist[i][j]);
			}
			normal = normal.normalize();
		}
		vertex_list[i] = new S3Vertex(vertex_list[i].position, normal);
	}
};

/**
 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
 * 一度計算を終えた場合は使いまわします。
 * @returns {undefined}
 */
S3Mesh.prototype.freezeMesh = function() {
	if(this.isFrozen) {
		return;
	}
	this._makeNormalMap();
	
	var material_list		= this.material;
	var vertex_list			= this.vertex;
	var triangleindex_list	= this.triangleindex;
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
			hash = triangleindex.getVertexHash(j, vertex_list, material_list);
			// すでに以前と同一の頂点があるならば、その頂点アドレスを選択。ない場合は新しいアドレス
			var hit = hashlist[hash];
			indlist[j] = (hit !== undefined) ? hit : vertex_length;
			// 頂点がもしヒットしていなかったら
			if(hit === undefined) {
				// 頂点データを作成して
				var vertexdata = triangleindex.getVertexData(j, vertex_list, material_list);
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
	
	this.frozenMesh = {};
	this.frozenMesh.ibo = ibo;
	this.frozenMesh.vbo = vbo;
	this.isFrozen = true;
};

S3Mesh.prototype.deleteIBO = function(s3system) {
	if(!(s3system instanceof S3SystemGL)) {
		throw "not S3SystemGL";
	}
	if(this.frozenMesh === undefined) {
		return;
	}
	if(this.frozenMesh.ibo.data !== undefined) {
		s3system.deleteBuffer(this.frozenMesh.ibo.data);
		delete this.frozenMesh.ibo.data;
	}
};

S3Mesh.prototype.deleteVBO = function(s3system) {
	if(!(s3system instanceof S3SystemGL)) {
		throw "not S3SystemGL";
	}
	if(this.frozenMesh === undefined) {
		return;
	}
	for(var key in this.frozenMesh.vbo) {
		if(this.frozenMesh.vbo[key].data !== undefined) {
			s3system.deleteBuffer(this.frozenMesh.vbo[key].data);
			delete this.frozenMesh.vbo[key].data;
		}
	}
};

/**
 * VBO/IBOを作成したときに使用したWebGLで、作成したデータを解放する
 * @param {S3SystemGL} s3system
 * @returns {undefined}
 */
S3Mesh.prototype.deleteFrozenMeshData = function(s3system) {
	if(!(s3system instanceof S3SystemGL)) {
		throw "not S3SystemGL";
	}
	if(this.frozenMesh === undefined) {
		return;
	}
	this.deleteIBO(s3system);
	this.deleteVBO(s3system);
	delete this.frozenMesh;
	this.isFrozen = false;
};

/**
 * VBO/IBOを作成するため、使用中のWEBGL情報を設定し、データを作成する
 * @param {S3SystemGL} s3system
 * @returns {undefined}
 */
S3Mesh.prototype.initFrozenMeshData = function(s3system) {
	if(!(s3system instanceof S3SystemGL)) {
		throw "not S3SystemGL";
	}
	if((!this.isFrozen) && (!this.frozenMesh === undefined)) {
		return;
	}
	// フリーズデータ（固定データ）を取得する
	this.freezeMesh();
	// IBO / VBO 用のオブジェクトを作成しなおす
	this.deleteIBO(s3system);
	this.deleteVBO(s3system);
	this.frozenMesh.ibo.data = s3system.createIBO(this.frozenMesh.ibo.array);
	for(var key in this.frozenMesh.vbo) {
		this.frozenMesh.vbo[key].data = s3system.createVBO(this.frozenMesh.vbo[key].array);
	}
};

/**
 * WEBGL用のVBO/IBOデータを取得する
 * @param {S3SystemGL} s3system
 * @returns {S3Mesh.freeze}
 */
S3Mesh.prototype.getFrozenMeshData = function(s3system) {
	if(!(s3system instanceof S3SystemGL)) {
		throw "not S3SystemGL";
	}
	this.initFrozenMeshData(s3system);
	return this.frozenMesh;
};

/**
 * WEBGL用のVBO/IBOデータを取得する
 * @param {S3SystemGL} s3system
 * @returns {S3Model.prototype@call;getMesh@call;getGLData}
 */
S3Model.prototype.getFrozenMeshData = function(s3system) {
	if(!(s3system instanceof S3SystemGL)) {
		throw "not S3SystemGL";
	}
	return this.getMesh().getFrozenMeshData(s3system);
};
