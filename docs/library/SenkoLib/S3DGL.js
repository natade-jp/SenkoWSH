/* global S3System, S3Mesh, S3Model, S3SystemMode, Float32Array */

﻿"use strict";

﻿/**
 * SenkoLib S3DGL.js
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
 * WebGLのシェーダー情報
 * /////////////////////////////////////////////////////////
 */

/**
 * 頂点シェーダー／フラグメントシェーダ―用クラス
 * ソースコード、コンパイル済みデータ、シェーダータイプを格納できる
 * @param {S3SystemGL} s3systemgl
 * @param {Integer} code
 * @param {String} sharder_type
 * @returns {S3GLShader}
 */
var S3GLShader = function(s3systemgl, code, sharder_type) {
	this.s3systemgl		= s3systemgl;
	this.compileddata	= null;
	this.sharder_type	= sharder_type;
	this.code			= code;
};
S3GLShader.prototype.toHash = function() {
	var i = 0;
	var hash = 0;
	for(i = 0; i < this.code.length; i++) {
		hash = (hash * 48271 + this.code.charCodeAt(i)) & 0xFFFFFFFF;
	}
	return hash;
};
S3GLShader.prototype.isCompiled = function() {
	return (this.compileddata !== null);
};

/**
 * シェーダーをコンパイルする
 * @returns {Boolean} trueで成功
 */
S3GLShader.prototype.compileSharder = function() {
	if(this.isCompiled()) {
		return true;
	}
	var gl = this.s3systemgl.gl;
	var shader = gl.createShader(this.sharder_type);
	gl.shaderSource(shader, this.code);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		this.compileddata = shader;
		return true;
	}else{
		console.log("compile error " + gl.getShaderInfoLog(shader));
		return false;
	}
};

/**
 * 頂点シェーダー、フラグメントシェーダーの2つを組み合わせたプログラム用のクラス
 * 2種類のシェーダーと、リンクしたプログラムを格納できる
 * @param {S3SystemGL} s3systemgl
 * @returns {S3GLProgram}
 */
var S3GLProgram = function(s3systemgl) {
	this.s3systemgl		= s3systemgl;
	this.vertex			= null;
	this.fragment		= null;
	this.program		= null;
};
S3GLProgram.prototype.toHash = function() {
	var hash = (this.vertex.toHash() + this.fragment.toHash()) & 0xFFFFFFFF;
	return hash;
};
S3GLProgram.prototype.isSetShader = function() {
	if(this.vertex === null || this.fragment === null ) {
		return false;
	}
	return true;
};
S3GLProgram.prototype.isLinked = function() {
	return (this.program !== null);
};

/**
 * コンパイル済みの頂点シェーダー、フラグメントシェーダーをセットする
 * セットするシェーダーの順番は順不同である
 * @param {S3GLShader} shader
 * @returns {Boolean}
 */
S3GLProgram.prototype.setShader = function(shader) {
	if(this.isLinked()) {
		return true;
	}
	var gl = this.s3systemgl.gl;
	if(shader.sharder_type === gl.VERTEX_SHADER) {
		this.vertex = shader;
	}
	else if(shader.sharder_type === gl.FRAGMENT_SHADER) {
		this.fragment = shader;
	}
	if(this.isSetShader()) {
		return true;
	}
	else {
		return false;
	}
};

/**
 * セットした2種類（頂点とフラグメント）のシェーダーをリンクさせて利用可能状態にする
 * @returns {Boolean} trueで成功
 */
S3GLProgram.prototype.linkedSharder = function() {
	if(!this.isSetShader()) {
		return false;
	}
	if(this.isLinked()) {
		return true;
	}
	var gl = this.s3systemgl.gl;
	var program = gl.createProgram();
	gl.attachShader(program, this.vertex.compileddata   );
	gl.attachShader(program, this.fragment.compileddata );
	gl.linkProgram(program);
	if(gl.getProgramParameter(program, gl.LINK_STATUS)){
		this.program = program;
		return true;
	}
	else {
		console.log("link error " + gl.getProgramInfoLog(program));
		return false;
	}
};

/**
 * WebGL用のプログラムに、JavaScript用の変数を橋渡しするクラス
 * @param {S3SystemGL} s3systemgl
 * @returns {S3GLBind}
 */
var S3GLBind = function(s3systemgl) {
	this.s3systemgl	= s3systemgl;
	var gl			= this.s3systemgl.gl;
	
	var variable = {};
	variable.attribute	= {};
	variable.uniform	= {};
	variable.modifiers	= [];
	variable.datatype	= [];
	this.variable = variable;
	
	var g = {
		uniform1iv: function(location, value) { gl.uniform1iv(location, value); },
		uniform2iv: function(location, value) { gl.uniform2iv(location, value); },
		uniform3iv: function(location, value) { gl.uniform3iv(location, value); },
		uniform4iv: function(location, value) { gl.uniform4iv(location, value); },
		uniform1fv: function(location, value) { gl.uniform1fv(location, value); },
		uniform2fv: function(location, value) { gl.uniform2fv(location, value); },
		uniform3fv: function(location, value) { gl.uniform3fv(location, value); },
		uniform4fv: function(location, value) { gl.uniform4fv(location, value); },
		uniformMatrix2fv: function(location, value) { gl.uniformMatrix2fv(location, false, value); },
		uniformMatrix3fv: function(location, value) { gl.uniformMatrix3fv(location, false, value); },
		uniformMatrix4fv: function(location, value) { gl.uniformMatrix4fv(location, false, value); }
	};
	
	var info = {
		int		: {glsl : "int",	js : "Int32Array",	size : 1, btype : "INT",	bind : g.uniform1iv},
		float	: {glsl : "float",	js : "Float32Array",size : 1, btype : "INT",	bind : g.uniform1fv},
		bool	: {glsl : "bool",	js : "Int32Array",	size : 1, btype : "INT",	bind : g.uniform1iv},
		mat2	: {glsl : "mat2",	js : "Float32Array",size : 4, btype : "FLOAT",	bind : g.uniformMatrix2fv},
		mat3	: {glsl : "mat3",	js : "Float32Array",size : 9, btype : "FLOAT",	bind : g.uniformMatrix3fv},
		mat4	: {glsl : "mat4",	js : "Float32Array",size : 16,btype : "FLOAT",	bind : g.uniformMatrix4fv},
		vec2	: {glsl : "vec2",	js : "Float32Array",size : 2, btype : "FLOAT",	bind : g.uniform2fv},
		vec3	: {glsl : "vec3",	js : "Float32Array",size : 3, btype : "FLOAT",	bind : g.uniform3fv},
		vec4	: {glsl : "vec4",	js : "Float32Array",size : 4, btype : "FLOAT",	bind : g.uniform4fv},
		ivec2	: {glsl : "ivec2",	js : "Int32Array",	size : 2, btype : "INT",	bind : g.uniform2iv},
		ivec3	: {glsl : "ivec3",	js : "Int32Array",	size : 3, btype : "INT",	bind : g.uniform3iv},
		ivec4	: {glsl : "ivec4",	js : "Int32Array",	size : 4, btype : "INT",	bind : g.uniform4iv},
		bvec2	: {glsl : "bvec2",	js : "Int32Array",	size : 2, btype : "INT",	bind : g.uniform2iv},
		bvec3	: {glsl : "bvec3",	js : "Int32Array",	size : 3, btype : "INT",	bind : g.uniform3iv},
		bvec4	: {glsl : "bvec4",	js : "Int32Array",	size : 4, btype : "INT",	bind : g.uniform4iv},
		sampler2D		: {glsl : "sampler2D",	js : "Image", size : 1, btype : "TEXTURE",	bind : null},
		samplerCube	: {glsl : "samplerCube",js : "Image", size : 1, btype : "TEXTURE",	bind : null}
	};
	
	this.analysisShader = function(gl, prg, code, variable) {
		var codelines = code.split("\n");
		for(var i = 0; i < codelines.length; i++) {
			var data = codelines[i].match(/(attribute|uniform)\s+(\w+)\s+(\w+)\s*;/);
			if(data === null) {
				continue;
			}
			// 見つけたら変数名や、型を記録しておく
			// data[1] ... uniform, data[2] ... mat4, data[3] ... M
			variable[data[3]]			= info[data[2]];	// glsl, js, size, bind
			// さらに情報を保存しておく
			variable[data[3]].name		= data[3];			// M
			variable[data[3]].modifiers	= data[1];			// uniform
			// プログラム上のどの位置に配置すればいいかを調べておく
			variable[data[3]].location	= data[1] === "attribute" ?
				gl.getAttribLocation(prg, data[3]) :
				gl.getUniformLocation(prg, data[3]);
		}
		return;
	};
};

/**
 * リンク済みのプログラムをセットして、解析してから使用状態にする。
 * @param {S3GLProgram} glprogram リンク済みのプログラム
 * @returns {undefined}
 */
S3GLBind.prototype.setProgram = function(glprogram) {
	if(!glprogram.isLinked()) {
		return false;
	}
	var gl = this.s3systemgl.gl;
	var prg = glprogram.program;
	gl.useProgram(prg);
	// プログラムを解析して、attribute / uniform の変数について調べる
	this.analysisShader(gl, prg, glprogram.vertex.code, this.variable);
	this.analysisShader(gl, prg, glprogram.fragment.code, this.variable);
};

/**
 * プログラムにデータを結びつける
 * @param {S3Mesh} mesh
 * @returns {Integer}
 */
S3GLBind.prototype.bindMesh = function(mesh) {
	var gl = this.s3systemgl.gl;
	var gldata = mesh.getGLData(this.s3systemgl);
	// インデックスをセット
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gldata.ibo.data );
	var index_length = gldata.ibo.array_length;
	// 頂点をセット(あらかじめコードから解析した attribute について埋める)
	for(var key in this.variable) {
		if(this.variable[key].modifiers === "uniform") {
			// 現段階で未対応（おそらくカメラ用の行列などのため）
			continue;
		}
		if(gldata.vbo[key] === undefined) {
			// vboのリストにない場合は、カメラ用の行列など
			continue;
		}
		var variable	= this.variable[key];
		var vbodata		= gldata.vbo[key];
		gl.bindBuffer(gl.ARRAY_BUFFER, vbodata.data);
		gl.enableVertexAttribArray(variable.location);
		// 型は適当
		gl.vertexAttribPointer(
			variable.location,
			variable.size,
			variable.btype === "FLOAT" ? gl.FLOAT : gl.SHORT,
			false, 0, 0);
	}
	// 戻り値でインデックスの長さを返す
	// この長さは、drawElementsで必要のため
	return index_length;
};

/**
 * プログラムに行列データを結びつける
 * @param {type} data
 * @param {type} attribute_name
 * @returns {undefined}
 */
S3GLBind.prototype.bindUniform = function(data, attribute_name) {
	var variable	= this.variable[attribute_name];
	if(variable.modifiers !== "uniform") {
		throw "IllegalArgumentException";
	}
	variable.bind(variable.location, data);
	return;
};

/**
 * /////////////////////////////////////////////////////////
 * S3SystemGL
 * S3SystemのWebGL拡張
 * /////////////////////////////////////////////////////////
 */

var S3SystemGL = function() {
	this.super = S3System.prototype;
	this.super.setSystemMode.call(this, S3SystemMode.OPEN_GL);
	this.myfunc = {};
	this.myfunc.download = function(url, callback) {
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
			image.src = this.pathname;
		}
		var http = new XMLHttpRequest();
		var handleHttpResponse = function (){
			if(http.readyState === 4) { // DONE
				if(http.status !== 200) {
					console.log("error downloadText " + url);
					return(null);
				}
				callback(http.responseText, ext);
			}
		};
		http.onreadystatechange = handleHttpResponse;
		http.open("GET", url, true);
		http.send(null);
	};
	this.myfunc.toHashFromString = function(text) {
		var i = 0;
		var hash = 0;
		for(i = 0; i < text.length; i++) {
			hash = (hash * 48271 + text.charCodeAt(i)) & 0xFFFFFFFF;
		}
		return hash;
	};
	
	var cash = {};
	cash.url		= [];
	cash.complie	= [];
	cash.program	= [];
	this.cash = cash;
	var program = {};
	program.setting	= new S3GLProgram(this);
	program.run		= new S3GLProgram(this);
	this.program	= program;
	this.bind		= null;
};
S3SystemGL.prototype = new S3System();

S3SystemGL.prototype.setCanvas = function(canvas) {
	// 初期化色
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	this.canvas = canvas;
	this.gl = gl;
};

S3SystemGL.prototype.getShaderType = function(text) {
	var dotlist = text.split(".");
	var ext = "";
	if(dotlist.length > 1) {
		ext = dotlist[dotlist.length - 1].toLocaleString();
	}
	if((ext==="vert") || (ext==="vs") || (text==="x-shader/x-vertex")) {
		return this.gl.VERTEX_SHADER;
	}
	else if((ext==="frag") || (ext==="fs") || (text==="x-shader/x-fragment")) {
		return this.gl.FRAGMENT_SHADER;
	}
	else {
		throw "IllegalArgumentException";
	}
};

S3SystemGL.prototype.setShader = function(shader) {
	if(!this.program.setting.setShader(shader)) {
		return;
	}
	// キャッシュがあれば、それを使う
	var hash = this.program.setting.toHash();
	if(this.cash.program[hash] !== undefined) {
		this.program.run = this.cash.program[hash];
		this.program.setting	= new S3GLProgram(this);
		this.bind = new S3GLBind(this);
		this.bind.setProgram(this.program.run);
	}
	else if(this.program.setting.linkedSharder()){
		this.cash.program[hash]	= this.program.setting;
		this.program.run		= this.program.setting;
		this.program.setting	= new S3GLProgram(this);
		this.bind = new S3GLBind(this);
		this.bind.setProgram(this.program.run);
	}
};

S3SystemGL.prototype.setShaderCode = function(code, sharder_type) {
	// キャッシュがあれば、それを使う
	var shader = new S3GLShader(this, code, sharder_type);
	var hash = shader.toHash();
	if(this.cash.complie[hash] !== undefined) {
		this.setShader(this.cash.complie[hash]);
		return;
	}
	if(shader.compileSharder()) {
		this.cash.complie[hash] = shader;
		this.setShaderCode(code);
		return true;
	}
	return false;
};

S3SystemGL.prototype.setShaderURL = function(url) {
	// キャッシュがあれば、それを使う
	var shader = this.cash.url[url];
	if(shader !== undefined) {
		this.setShaderCode( shader.code, shader.sharder_type );
		return;
	}
	var that = this;
	var sharder_type = this.getShaderType(url);
	var downloadCallback = function(code) {
		shader = new S3GLShader(this, code, sharder_type);
		that.cash.url[url] = shader;
		that.setShaderURL(url);
	};
	this.myfunc.download(url, downloadCallback);
};

S3SystemGL.prototype.clear = function() {
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(1.0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

S3SystemGL.prototype.createVBO = function(data) {
	var vbo = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	return vbo;
};

S3SystemGL.prototype.createIBO = function(data) {
	var ibo = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	return ibo;
};

S3SystemGL.prototype.drawElements = function(indexsize) {
	if(!this.program.run.isLinked()) {
		return;
	}
	this.gl.drawElements(this.gl.TRIANGLES, indexsize, this.gl.UNSIGNED_SHORT, 0);
	this.gl.flush();
};

S3SystemGL.prototype.deleteBuffer = function(data) {
	this.gl.deleteBuffer(data);
};

S3SystemGL.prototype.drawScene = function(scene) {
	if(this.bind === null) {
		return;
	}
	var VPS = this.getVPSMatrix(scene.camera, this.canvas);
	
	for(var i = 0; i < scene.model.length; i++) {
		var model = scene.model[i];
		var M = this.getMatrixWorldTransform(model);
		var MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
		
		var indexsize = this.bind.bindMesh(model.getMesh());
		this.bind.bindUniform(MVP.toInstanceArray(Float32Array), "mvpMatrix");
		this.drawElements(indexsize);
	}
};

/**
 * /////////////////////////////////////////////////////////
 * 既存の部品に WebGL 用の情報を記録するための拡張
 * 主に、描写のための VBO と IBO を記録する
 * /////////////////////////////////////////////////////////
 */

S3Mesh.prototype.deleteGLData = function(s3system) {
	if(this.gl === undefined) {
		return;
	}
	s3system.deleteBuffer(this.gl.ibo.data);
	for(var key in this.gldata.vbo) {
		s3system.deleteBuffer(this.gl.vbo[key].data);
	}
	delete this.gl;
};

S3Mesh.prototype.initGLData = function(s3system) {
	if((!this.isFreezed) && (!this.gl === undefined)) {
		return;
	}
	// フリーズデータ（固定データ）を取得する
	this.gl = this.getFreezedMesh();
	// 取得したデータを、IBO / VBO 用のオブジェクトに変換して、data へ格納
	this.gl.ibo.data = s3system.createIBO(this.gl.ibo.array);
	for(var key in this.gl.vbo) {
		this.gl.vbo[key].data = s3system.createVBO(this.gl.vbo[key].array);
	}
};

S3Mesh.prototype.getGLData = function(s3system) {
	this.initGLData(s3system);
	return this.gl;
};

S3Model.prototype.getGLData = function(s3system) {
	return this.getMesh().getGLData(s3system);
};
