/* global S3System, S3Mesh, S3Model, S3SystemMode, Float32Array, S3CullMode, S3FrontFace, S3LightMode, Int32Array, S3Vector, S3Matrix, WebGLBuffer, S3GLLight, S3GLMesh */

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
 * S3GLProgram 内部で利用するもので、一般的にこれ単体では使用しない
 * @param {S3GLSystem} sys
 * @param {String} code
 * @returns {S3GLShader}
 */
var S3GLShader = function(sys, code) {
	this._init(sys, code);
};
S3GLShader.prototype._init = function(sys, code) {
	this.sys			= sys;
	this.code			= null;
	this.shader			= null;
	this.sharder_type	= -1;
	this.is_error		= false;
	var that = this;
	var downloadCallback = function(code) {
		that.code = code;
	};
	if(code.indexOf("\n") === -1) {
		// 1行の場合はURLとみなす（雑）
		this.sys._download(code, downloadCallback);
	}
	else {
		this.code = code;
	}
};
S3GLShader.prototype.isError = function() {
	return this.is_error;
};
S3GLShader.prototype.getCode = function() {
	return this.code;
};
S3GLShader.prototype.getShader = function() {
	var gl = this.sys.getGL();
	if((gl === null) || this.is_error || (this.code === null)) {
		// まだ準備ができていないのでエラーを発生させない
		return null;
	}
	if(this.shader !== null) {
		// すでにコンパイル済みであれば返す
		return this.shader;
	}
	var code = this.code;
	// コメントを除去する
	code = code.replace(/\/\/.*/g,"");
	code = code.replace(/\/\*([^*]|\*[^\/])*\*\//g,"");
	// コード内を判定して種別を自動判断する（雑）
	var sharder_type = 0;
	if(code.indexOf("gl_FragColor") !== -1) {
	// フラグメントシェーダである
		sharder_type = gl.FRAGMENT_SHADER;
	}
	else {
		// バーテックスシェーダである
		sharder_type = gl.VERTEX_SHADER;
	}
	var shader = gl.createShader(sharder_type);
	gl.shaderSource(shader, code);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		this.shader			= shader;
		this.sharder_type	= sharder_type;
		return this.shader;
	}
	else {
		console.log("compile error " + gl.getShaderInfoLog(shader));
		this.is_error = true;
		return null;
	}
};
S3GLShader.prototype.getShaderType = function() {
	if(this.sharder_type !== -1) {
		return this.sharder_type;
	}
	if(this.getShader() !== null) {
		return this.sharder_type;
	}
	return null;
};
S3GLShader.prototype.dispose = function() {
	var gl = this.sys.getGL();
	if(gl === null) {
		return null;
	}
	if(this.shader === null) {
		return true;
	}
	if(!this.is_error) {
		var gl = this.gl;
		gl.deleteShader(shader);
	}
	this.shader	= null;
	this.sharder_type = -1;
	return true;
};

/**
 * /////////////////////////////////////////////////////////
 * WebGLのプログラム情報
 * /////////////////////////////////////////////////////////
 */

/**
 * 頂点シェーダー、フラグメントシェーダーの2つを組み合わせたプログラム用のクラス
 * 2種類のシェーダーと、リンクしたプログラムを格納できる
 * またプログラムをセットしたり、セットした後は変数とのバインドができる。
 * @param {S3GLSystem} sys
 * @param {Integer} id
 * @returns {S3GLProgram}
 */
var S3GLProgram = function(sys, id) {
	this._init(sys, id);
};
S3GLProgram.prototype._init = function(sys, id) {
	this.id				= id;
	this.sys			= sys;
	this.vertex			= null;
	this.fragment		= null;
	this.isDLVertex		= false;
	this.isDLFragment	= false;
	this.program		= null;
	this.is_linked		= false;
	this.is_error		= false;
	this.enable_vertex_number = {};
	
	var variable = {};
	variable.attribute	= {};
	variable.uniform	= {};
	variable.modifiers	= [];
	variable.datatype	= [];
	this.variable = variable;
	
	var g = {
		uniform1iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1iv(location, value); }},
		uniform2iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2iv(location, value); }},
		uniform3iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3iv(location, value); }},
		uniform4iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4iv(location, value); }},
		uniform1fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1fv(location, value); }},
		uniform2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2fv(location, value); }},
		uniform3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3fv(location, value); }},
		uniform4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4fv(location, value); }},
		uniformMatrix2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix2fv(location, false, value); }},
		uniformMatrix3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix3fv(location, false, value); }},
		uniformMatrix4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix4fv(location, false, value); }}
	};
	
	var info = {
		int		: {glsltype : "int",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
		float	: {glsltype : "float",	instance : Float32Array,	size : 1, btype : "FLOAT",	bind : g.uniform1fv},
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
		// コメントを除去する
		code = code.replace(/\/\/.*/g,"");
		code = code.replace(/\/\*([^*]|\*[^\/])*\*\//g,"");
		// 1行ずつ解析
		var codelines = code.split("\n");
		for(var i = 0; i < codelines.length; i++) {
			// uniform vec4 lights[4]; とすると、 uniform,vec4,lights,[4]で区切られる
			var data = codelines[i].match( /(attribute|uniform)\s+(\w+)\s+(\w+)\s*(\[\s*\w+\s*\])?;/);
			if(data === null) {
				continue;
			}
			// 見つけたら変数名や、型を記録しておく
			// 配列数の調査は、定数などを使用されると簡単に調べられないため取得できない
			// そのため自動でテストできないため、bindする際に、正しい配列数の配列をbindすること
			var text_space			= data[1];
			var text_type			= data[2];
			var text_variable		= data[3];
			var text_array			= data[4];
			var is_array			= text_array !== undefined;
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
			variable[text_variable].is_array	= is_array;
			variable[text_variable].location	= [];
			
		}
		return;
	};
};
S3GLProgram.prototype.isLinked = function() {
	return this.is_linked;
};
S3GLProgram.prototype.dispose = function() {
	var gl = this.sys.getGL();
	if(gl === null) {
		return false;
	}
	if(this.is_linked) {
		this.disuseProgram();
		gl.detachShader(this.program, this.vertex.getShader()   );
		gl.detachShader(this.program, this.fragment.getShader() );
		gl.deleteProgram(this.program);
		this.program		= null;
		this.is_linked		= false;
	}
	if(this.vertex !== null) {
		this.vertex.dispose();
		this.vertex = null;
	}
	if(this.fragment !== null) {
		this.fragment.dispose();
		this.fragment = null;
	}
	this._init(this.sys, this.id);
	return true;
};
S3GLProgram.prototype.setVertexShader = function(shader_code) {
	if(this.isLinked()) {
		return false;
	}
	if(this.vertex !== null) {
		this.vertex.dispose();
		this.vertex = null;
	}
	this.vertex = new S3GLShader(this.sys, shader_code);
	this.is_error = false;
	return true;
};
S3GLProgram.prototype.setFragmentShader = function(shader_code) {
	if(this.isLinked()) {
		return false;
	}
	if(this.fragment !== null) {
		this.fragment.dispose();
		this.fragment = null;
	}
	this.fragment = new S3GLShader(this.sys, shader_code);
	this.is_error = false;
	return true;
};

S3GLProgram.prototype.useProgram = function() {
	if(!this.isLinked()) {
		return false;
	}
	var program = this.getProgram();
	if(program && this.sys.getGL()) {
		this.sys.getGL().useProgram(program);
	}
	return true;
};
S3GLProgram.prototype.disuseProgram = function() {
	if(!this.isLinked()) {
		return false;
	}
	var gl = this.sys.getGL();
	if(gl) {
		// enable化したデータを解放する
		for(var key in this.enable_vertex_number) {
			gl.disableVertexAttribArray(key);
		}
		this.enable_vertex_number = {};
	}
	return true;
};
S3GLProgram.prototype.getProgram = function() {
	var gl = this.sys.getGL();
	// 1度でもエラーが発生したか、glキャンバスの設定をしていない場合
	if((gl === null) || this.is_error) {
		return null;
	}
	// ダウンロード中なら無視する
	if(this.isDLVertex || this.isDLFragment) {
		return null;
	}
	// すでにリンク済みのがあれば返す
	if(this.isLinked()) {
		return this.program;
	}
	// シェーダーを取得する
	if(this.vertex === null) {
		console.log("do not set VERTEX_SHADER");
		this.is_error = true;
		return null;
	}
	if(this.fragment === null) {
		console.log("do not set FRAGMENT_SHADER");
		this.is_error = true;
		return null;
	}
	var is_error_vertex		= this.vertex.isError();
	var is_error_fragment	= this.fragment.isError();
	if(is_error_vertex || is_error_fragment) {
		console.log("shader compile error");
		this.is_error = true;
		return null;
	}
	var shader_vertex	= this.vertex.getShader();
	var shader_fragment	= this.fragment.getShader();
	if((shader_vertex === null) || (shader_fragment === null)) {
		// まだロードが終わってない可能性あり
		return null;
	}
	if(this.vertex.getShaderType() !== gl.VERTEX_SHADER) {
		console.log("VERTEX_SHADER is not VERTEX_SHADER");
		this.is_error = true;
		return null;
	}
	if(this.fragment.getShaderType() !== gl.FRAGMENT_SHADER) {
		console.log("FRAGMENT_SHADER is not FRAGMENT_SHADER");
		this.is_error = true;
		return null;
	}
	// 取得したシェーダーを用いてプログラムをリンクする
	var program			= gl.createProgram();
	gl.attachShader(program, shader_vertex   );
	gl.attachShader(program, shader_fragment );
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		// リンクのエラー発生時
		console.log("link error " + gl.getProgramInfoLog(program));
		this.is_error = true;
		gl.detachShader(program, this.vertex.getShader()   );
		gl.detachShader(program, this.fragment.getShader() );
		gl.deleteProgram(program);
		return null;
	}
	// リンクが成功したらプログラムの解析しておく
	this.is_linked = true;
	this.program = program;
	this.analysisShader(this.vertex.getCode(), this.variable);
	this.analysisShader(this.fragment.getCode(), this.variable);
	return this.program;
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
	var gl	= this.sys.getGL();
	var prg	= this.getProgram();
	var variable	= this.variable[name];
	var i = 0;
	
	// 長さが0なら位置が未調査なので調査する
	if(variable.location.length === 0) {
		if(variable.modifiers === "attribute") {
			variable.location[0] = gl.getAttribLocation(prg, name);
		}
		else {
			if(!variable.is_array) {
				variable.location[0] = gl.getUniformLocation(prg, name);
			}
			else {
				// 配列の場合は、配列の数だけlocationを調査する
				// 予め、シェーダー内の配列数と一致させておくこと
				for(i = 0; i < data.length; i++) {
					variable.location[i] = gl.getUniformLocation(prg, name + "[" + i + "]");
				}
			}
		}
	}
	if(variable.location[0] === -1) {
		// 変数は宣言されているが、関数の中で使用していないと -1 がかえる
		return false;
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
	
	// 引数の値をArray型に統一化する
	if(!variable.is_array) {
		data = toArraydata(data);
	}
	else {
		for(i = 0; i < data.length; i++) {
			if(variable.location[i] !== -1) {
				data[i] = toArraydata(data[i]);
			}
		}
	}
	
	// 装飾子によって bind する方法を変更する
	if(variable.modifiers === "attribute") {
		// bindしたいデータ
		gl.bindBuffer(gl.ARRAY_BUFFER, data);
		// 有効化していない場合は有効化する
		if(!this.enable_vertex_number[variable.location[0]]) {
			gl.enableVertexAttribArray(variable.location[0]);
			this.enable_vertex_number[variable.location[0]] = true;
		}
		// bind。型は適当に設定
		gl.vertexAttribPointer(
			variable.location[0],
			variable.size,
			variable.btype === "FLOAT" ? gl.FLOAT : gl.SHORT,
			false, 0, 0);
	}
	else {
		// uniform の設定
		if(!variable.is_array) {
			variable.bind(variable.location[0], data);
		}
		else {
			// 配列の場合は、配列の数だけbindする
			for(i = 0; i < data.length; i++) {
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
 * @param {Object} s3mesh
 * @returns {Integer} IBOのインデックス数
 */
S3GLProgram.prototype.bindMesh = function(s3mesh) {
	if(!this.isLinked()) {
		// programが未作成
		return 0;
	}
	var gl = this.sys.getGL();
	if(gl === null) {
		// glが用意されていない
		return 0;
	}
	var gldata = s3mesh.getGLData();
	if(gldata === null) {
		// 入力値が用意されていない
		return 0;
	}
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
 * S3GLSystem
 * S3SystemのWebGL拡張
 * /////////////////////////////////////////////////////////
 */

var S3GLSystem = function() {
	this.super = S3System.prototype;
	this.super.setSystemMode.call(this, S3SystemMode.OPEN_GL);
	this.program		= null;
	this.gl				= null;
	this.is_set			= false;
	this.program_list	= [];
	this.program_listId	= 0;
};
S3GLSystem.prototype = new S3System();
S3GLSystem.prototype.createMesh = function() {
	return new S3GLMesh(this);
};
S3GLSystem.prototype._download = function(url, callback) {
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

S3GLSystem.prototype.getGL = function() {
	return this.gl;
};

S3GLSystem.prototype.setCanvas = function(canvas) {
	// 初期化色
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	this.canvas = canvas;
	this.gl = gl;
};

S3GLSystem.prototype.createProgram = function() {
	var program = new S3GLProgram(this, this.program_listId);
	this.program_list[this.program_listId] = program;
	this.program_listId++;
	return program;
};

S3GLSystem.prototype.disposeProgram = function() {
	for(var key in this.program_list) {
		this.program_list[key].dispose();
		delete this.program_list[key];
	}
};

S3GLSystem.prototype.setProgram = function(glprogram) {
	// nullの場合はエラーも無視
	if(glprogram === null) {
		return false;
	}
	// 明確な入力の誤り
	if(!(glprogram instanceof S3GLProgram)) {
		throw "not S3GLProgram";
	}
	// 新規のプログラムなら保持しておく
	if(this.program === null) {
		this.program = glprogram;
	}
	// プログラムが取得できない場合は、ダウンロード中の可能性あり無視する
	var new_program = glprogram.getProgram();
	if(null === new_program) {
		return false;
	}
	// すでに動作中で、設定されているものと同一なら無視する
	if((this.program === glprogram) && this.is_set) {
		return true;
	}
	// 新しいプログラムなのでセットする
	if(this.program !== null) {
		this.program.disuseProgram();
	}
	this.program = glprogram;
	this.gl.useProgram(new_program);
	this.is_set = true;
};

S3GLSystem.prototype.clear = function() {
	if(this.gl === null) {
		return false;
	}
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(1.0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	return true;
};

S3GLSystem.prototype.drawElements = function(indexsize) {
	if(!this.is_set) {
		return;
	}
	this.gl.drawElements(this.gl.TRIANGLES, indexsize, this.gl.UNSIGNED_SHORT, 0);
	this.gl.flush();
};

S3GLSystem.prototype.deleteBuffer = function(data) {
	if(this.gl === null) {
		return null;
	}
	this.gl.deleteBuffer(data);
};

S3GLSystem.prototype._setDepthMode = function() {
	if(this.gl === null) {
		return null;
	}
	var gl = this.gl;
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
};

S3GLSystem.prototype._setCullMode = function() {
	if(this.gl === null) {
		return null;
	}
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

S3GLSystem.prototype.bind = function(p1, p2) {
	if(!this.is_set) {
		return;
	}
	var prg = this.program;
	var index_lenght = 0;
	// p1が文字列、p2がデータの場合、データとして結びつける
	if((arguments.length === 2) && ((typeof p1 === "string")||(p1 instanceof String))) {
		prg.bindData(p1, p2);
	}
	// 引数がモデルであれば、モデルとして紐づける
	else if((arguments.length === 1) && (p1 instanceof S3Model)) {
		var mesh = p1.getMesh();
		if(mesh instanceof S3GLMesh) {
			index_lenght = prg.bindMesh(mesh);
		}
	}
	// 引数がライトであれば、ライトとして紐づける
	else if((arguments.length === 1) && (p1 instanceof S3GLLight)) {
		var lights = p1.getLights();
		for(var key in lights) {
			prg.bindData(key, lights[key]);
		}
	}
	return index_lenght;
};

S3GLSystem.prototype.drawScene = function(scene) {
	// プログラムを再設定
	
	this.setProgram(this.program);
	
	// まだ設定できていない場合は、この先へいかせない
	if(!this.is_set) {
		return;
	}
	
	// 画面の初期化
	this._setDepthMode();
	this._setCullMode();
	
	// ライト設定
	var lights = new S3GLLight(scene);
	this.bind(lights);
	
	// カメラの行列を取得する
	var VPS = this.getVPSMatrix(scene.camera, this.canvas);
	
	// モデル描写
	for(var i = 0; i < scene.model.length; i++) {
		var model	= scene.model[i];
		var mesh	= model.getMesh();
		if(mesh.isComplete() === false) {
			continue;
		}
		
		// モデル用のBIND
		var M = this.getMatrixWorldTransform(model);
		var MV = this.mulMatrix(M, VPS.LookAt);
		var MVP = this.mulMatrix(MV, VPS.PerspectiveFov);
		this.bind("matrixLocalToWorld", M);
		this.bind("matrixLocalToPerspective", MVP);
		
		var indexsize = this.bind(model);
		if(indexsize) {
			this.drawElements(indexsize);
		}
	}
};
