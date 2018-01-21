/* global S3System, S3Mesh, S3Model, S3SystemMode, Float32Array, S3CullMode, S3FrontFace, S3LightMode, Int32Array, S3Vector, S3Matrix, WebGLBuffer */

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
 *  S3D.js, S3DGLData.js
 */

/**
 * /////////////////////////////////////////////////////////
 * WebGLのシェーダー情報
 * /////////////////////////////////////////////////////////
 */

/**
 * 頂点シェーダー／フラグメントシェーダ―用クラス
 * ソースコード、コンパイル済みデータ、シェーダータイプを格納できる
 * @param {WebGL} gl
 * @param {String} code
 * @param {Integer} sharder_type
 * @returns {S3GLShader}
 */
var S3GLShader = function(gl, code, sharder_type) {
	this._init(gl, code, sharder_type);
};
S3GLShader.prototype._init = function(gl, code, sharder_type) {
	this.gl				= gl;
	this.code			= code;
	this.compileddata	= null;
	this.sharder_type	= sharder_type;
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
	var gl = this.gl;
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
 * またプログラムをセットしたり、セットした後は変数とのバインドができる。
 * @param {WebGL} gl
 * @returns {S3GLProgram}
 */
var S3GLProgram = function(gl) {
	this._init(gl);
};
S3GLProgram.prototype._init = function(gl) {
	this.gl				= gl;
	this.vertex			= null;
	this.fragment		= null;
	this.program		= null;
	
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
		int		: {glsltype : "int",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
		float	: {glsltype : "float",	instance : Float32Array,	size : 1, btype : "INT",	bind : g.uniform1fv},
		bool	: {glsltype : "bool",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
		mat2	: {glsltype : "mat2",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniformMatrix2fv},
		mat3	: {glsltype : "mat3",	instance : Float32Array,	size : 9, btype : "FLOAT",	bind : g.uniformMatrix3fv},
		mat4	: {glsltype : "mat4",	instance : Float32Array,	size : 16,btype : "FLOAT",	bind : g.uniformMatrix4fv},
		vec2	: {glsltype : "vec2",	instance : Float32Array,	size : 2, btype : "FLOAT",	bind : g.uniform2fv},
		vec3	: {glsltype : "vec3",	instance : Float32Array,	size : 3, btype : "FLOAT",	bind : g.uniform3fv},
		vec4	: {glsltype : "vec4",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniform4fv},
		ivec2	: {glsltype : "ivec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
		ivec3	: {glsltype : "ivec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
		ivec4	: {glsltype : "ivec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
		bvec2	: {glsltype : "bvec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
		bvec3	: {glsltype : "bvec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
		bvec4	: {glsltype : "bvec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
		sampler2D		: {glsltype : "sampler2D",	instance : Image, size : 1, btype : "TEXTURE",	bind : null},
		samplerCube	: {glsltype : "samplerCube",instance : Image, size : 1, btype : "TEXTURE",	bind : null}
	};
	
	this.analysisShader = function(code, variable) {
		var codelines = code.split("\n");
		for(var i = 0; i < codelines.length; i++) {
			// uniform vec4 lights[4]; とすると、 uniform,vec4,lights,[4]で区切られる
			var data = codelines[i].match( /(attribute|uniform)\s+(\w+)\s+(\w+)\s*(\[\s*\d+\s*\])?;/);
			if(data === null) {
				continue;
			}
			// 見つけたら変数名や、型を記録しておく
			var text_space			= data[1];
			var text_type			= data[2];
			var text_variable		= data[3];
			var text_array			= data[4];
			var array_length = 1;
			if(text_array !== undefined) {
				// 配列が存在する場合は、内部の数値部分を抜き出して配列数を調査
				array_length = Number(text_array.match(/\[\s*(\d)+\s*\]/)[1]);
			}
			// 型に応じたテンプレートを取得する
			// data[1] ... uniform, data[2] ... mat4, data[3] ... M
			var targetinfo = info[text_type];
			variable[text_variable]			= {};
			// 参照元データを書き換えないようにディープコピーする
			for(var key in targetinfo) {
				variable[text_variable][key]	= targetinfo[key];	// glsl, js, size, bind
			}
			// さらに情報を保存しておく
			variable[text_variable].name		= text_variable;		// M
			variable[text_variable].modifiers	= text_space;			// uniform
			variable[text_variable].is_array	= text_array !== undefined;
			variable[text_variable].array_length = array_length;
			variable[text_variable].location	= null;
			
		}
		return;
	};
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
	var gl = this.gl;
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
	var gl = this.gl;
	var program = gl.createProgram();
	gl.attachShader(program, this.vertex.compileddata   );
	gl.attachShader(program, this.fragment.compileddata );
	gl.linkProgram(program);
	if(gl.getProgramParameter(program, gl.LINK_STATUS)){
		// リンクが成功したらプログラムの解析しておく
		this.program = program;
		this.analysisShader(this.vertex.code, this.variable);
		this.analysisShader(this.fragment.code, this.variable);
		return true;
	}
	else {
		console.log("link error " + gl.getProgramInfoLog(program));
		return false;
	}
};

S3GLProgram.prototype.useProgram = function() {
	if(!this.isLinked()) {
		return false;
	}
	this.gl.useProgram(this.program);
};

/**
 * プログラムにデータを結びつける
 * @param {String} name
 * @param {Object} data
 * @returns {undefined}
 */
S3GLProgram.prototype.bindData = function(name, data) {
	if(!this.isLinked()) {
		return false;
	}
	var gl	= this.gl;
	var prg	= this.program;
	var variable	= this.variable[name];
	var i = 0;
	
	// 位置が不明なら調査しておく
	if(variable.location === null) {
		variable.location = [];
		if(variable.modifiers === "attribute") {
			variable.location[0] = gl.getAttribLocation(prg, name);
		}
		else {
			if(!variable.is_array) {
				variable.location[0] = gl.getUniformLocation(prg, name);
			}
			else {
				// 配列の場合は、配列の数だけlocationを調査する
				for(i = 0; i < variable.array_length; i++) {
					variable.location[i] = gl.getUniformLocation(prg, name + "[" + i + "]");
				}
			}
		}
	}
	if(variable.location[0] === -1) {
		// 変数は宣言されているが、関数の中で使用していないと -1 がかえる
		return;
	}
	
	// data が bind できる形になっているか調査する
	
	// glslの型をチェックして自動型変換する
	var toArraydata = function(data) {
		if(data instanceof WebGLBuffer) {
			// IBO型は、無視する
			return data;
		}
		if(data instanceof variable.instance) {
			// 型と同じインスタンスであるため問題なし
			return data;
		}
		// 入力型が行列型であり、GLSLも行列であれば
		if(data instanceof S3Matrix) {
			if(	(variable.glsltype === "mat2") ||
				(variable.glsltype === "mat3") ||
				(variable.glsltype === "mat4") ){
				return data.toInstanceArray(variable.instance, variable.size);
			}
		}
		// 入力型がベクトル型であり、GLSLも数値であれば
		if(data instanceof S3Vector) {
			if(	(variable.glsltype === "vec2") ||
				(variable.glsltype === "vec3") ||
				(variable.glsltype === "vec4") ||
				(variable.glsltype === "ivec2") ||
				(variable.glsltype === "ivec3") ||
				(variable.glsltype === "ivec4") ||
				(variable.glsltype === "bvec2") ||
				(variable.glsltype === "bvec3") ||
				(variable.glsltype === "bvec4") ) {
				return data.toInstanceArray(variable.instance, variable.size);
			}
		}
		// 入力型が数値型であり、GLSLも数値であれば
		if((typeof data === "number")||(data instanceof Number)) {
			if(	(variable.glsltype === "int") ||
				(variable.glsltype === "float") ||
				(variable.glsltype === "bool") ) {
				return new variable.instance([data]);
			}
		}
		throw "not toArraydata";
	};
	if(!variable.is_array) {
		data = toArraydata(data);
	}
	else {
		for(i = 0; i < variable.array_length; i++) {
			if(variable.location[i] !== -1) {
				data[i] = toArraydata(data[i]);
			}
		}
	}	
	
	// 装飾子によって bind する方法を変更する
	if(variable.modifiers === "attribute") {
		gl.bindBuffer(gl.ARRAY_BUFFER, data);
		gl.enableVertexAttribArray(variable.location[0]);
		// 型は適当
		gl.vertexAttribPointer(
			variable.location[0],
			variable.size,
			variable.btype === "FLOAT" ? gl.FLOAT : gl.SHORT,
			false, 0, 0);
	}
	else {
		if(!variable.is_array) {
			variable.bind(variable.location[0], data);
		}
		else {
			// 配列の場合は、配列の数だけbindする
			for(i = 0; i < variable.array_length; i++) {
				if(variable.location[i] !== -1) {
					variable.bind(variable.location[i], data[i]);
				}
			}
		}
	}
	
	return true;
};

/**
 * プログラムにデータを結びつける
 * @param {Object} freezedMesh
 * @returns {Integer} IBOのインデックス数
 */
S3GLProgram.prototype.bindFreezedMesh = function(freezedMesh) {
	if(!this.isLinked()) {
		return false;
	}
	var gldata = freezedMesh;
	var gl = this.gl;
	// インデックスをセット
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gldata.ibo.data );
	var index_length = gldata.ibo.array_length;
	// 頂点をセット(あらかじめコードから解析した attribute について埋める)
	for(var key in this.variable) {
		
		if(this.variable[key].modifiers === "uniform") {
			// uniform は共通設定なので省略
			continue;
		}
		// 例えば、vboのリストにあるが、gldata内に情報をもっていない場合がある
		// それは、カメラ用の行列などがあげられる。
		// 逆に、gldata内に情報をもっているが、vbo内に定義されていないのであれば、
		// 使用しない。
		if(gldata.vbo[key] === undefined) {
			continue;
		}
		this.bindData(key, gldata.vbo[key].data);
	}
	// 戻り値でインデックスの長さを返す
	// この長さは、drawElementsで必要のため
	return index_length;
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
	this.program	= program;
};
S3SystemGL.prototype = new S3System();

S3SystemGL.prototype.setCanvas = function(canvas) {
	// 初期化色
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	this.canvas = canvas;
	this.gl = gl;
	this.program.setting	= new S3GLProgram(this.gl);
	this.program.run		= new S3GLProgram(this.gl);
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
		this.program.setting	= new S3GLProgram(this.gl);
		this.program.run.useProgram();
	}
	else if(this.program.setting.linkedSharder()){
		this.cash.program[hash]	= this.program.setting;
		this.program.run		= this.program.setting;
		this.program.setting	= new S3GLProgram(this.gl);
		this.program.run.useProgram();
	}
};

S3SystemGL.prototype.isSetShader = function() {
	var prg = this.program.run;
	return ((prg !== null) && (prg.isLinked()));
};

S3SystemGL.prototype.setShaderCode = function(code, sharder_type) {
	// キャッシュがあれば、それを使う
	var shader = new S3GLShader(this.gl, code, sharder_type);
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
		shader = new S3GLShader(that.gl, code, sharder_type);
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

S3SystemGL.prototype._setDepthMode = function() {
	var gl = this.gl;
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
};

S3SystemGL.prototype._setCullMode = function() {
	var gl = this.gl;
	if(this.cullmode === S3CullMode.NONE) {
		gl.disable(gl.CULL_FACE);
		return;
	}
	else {
		gl.enable(gl.CULL_FACE);
	}
	if(this.frontface === S3FrontFace.CLOCKWISE) {
		gl.frontFace(gl.CW);
	}
	else {
		gl.frontFace(gl.CCW);
	}
	if(this.cullmode === S3CullMode.FRONT_AND_BACK) {
		gl.cullFace(gl.FRONT_AND_BACK);
	}
	else if(this.cullmode === S3CullMode.BACK) {
		gl.cullFace(gl.BACK);
	}
	else if(this.cullmode === S3CullMode.FRONT) {
		gl.cullFace(gl.FRONT);
	}
};

S3SystemGL.prototype.bind = function(p1, p2) {
	if(!this.isSetShader()) {
		return 0;
	}
	var prg = this.program.run;
	var index_lenght = 0;
	// p1が文字列、p2がデータの場合、データとして結びつける
	if((arguments.length === 2) && ((typeof p1 === "string")||(p1 instanceof String))) {
		prg.bindData(p1, p2);
	}
	// 引数がモデルであれば、モデルとして紐づける
	else if((arguments.length === 1) && (p1 instanceof S3Model)) {
		index_lenght = prg.bindFreezedMesh(p1.getFreezedMeshData(this));
	}
	return index_lenght;
};

S3SystemGL.prototype.drawScene = function(scene) {
	if(!this.isSetShader()) {
		return 0;
	}
	
	// 画面の初期化
	this._setDepthMode();
	this._setCullMode();
	
	// ライト設定
	
	// カメラの行列を取得する
	var VPS = this.getVPSMatrix(scene.camera, this.canvas);
	
	// モデル描写
	for(var i = 0; i < scene.model.length; i++) {
		var model = scene.model[i];
		
		// モデル用のBIND
		var M = this.getMatrixWorldTransform(model);
		var MV = this.mulMatrix(M, VPS.LookAt);
		var MVP = this.mulMatrix(MV, VPS.PerspectiveFov);
		this.bind("matrixLocalToWorld", M);
		this.bind("matrixLocalToPerspective", MVP);
		
		var indexsize = this.bind(model);
		this.drawElements(indexsize);
	}
};
