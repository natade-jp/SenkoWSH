/* global S3System, S3Mesh, S3Model, S3SystemMode */

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
 * 
 * @param {String} code
 * @param {Integer} sharder_type
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
S3GLProgram.prototype.useProgram = function() {
	if(!this.isLinked()) {
		return false;
	}
	var gl = this.s3systemgl.gl;
	gl.useProgram(this.program);
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
	this.program = program;
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
		this.program.run.useProgram();
		this.program.setting	= new S3GLProgram(this);
	}
	else if(this.program.setting.linkedSharder()){
		this.cash.program[hash]	= this.program.setting;
		this.program.run		= this.program.setting;
		this.program.run.useProgram();
		this.program.setting	= new S3GLProgram(this);
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

S3SystemGL.prototype.bindVBO = function(vbo, attribute_name, size) {
	if(!this.program.run.isLinked()) {
		return;
	}
	var prg = this.program.run.program;
	var location = this.gl.getAttribLocation(prg, attribute_name);
	if(location === -1) {
		console.log("bind error1 " + attribute_name);
		return;
	}
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
	this.gl.enableVertexAttribArray(location);
	this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
	return;
};

S3SystemGL.prototype.bindIBO = function(ibo) {
	if(!this.program.run.isLinked()) {
		return;
	}
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
	return;
};

S3SystemGL.prototype.bindUniformMatrix = function(mat, attribute_name) {
	if(!this.program.run.isLinked()) {
		return;
	}
	var prg = this.program.run.program;
	var location = this.gl.getUniformLocation(prg, attribute_name);
	if(location === -1) {
		console.log("bind error2 " + attribute_name);
		return;
	}
	this.gl.uniformMatrix4fv(location, false, mat);
	return;
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
	if(!this.program.run.isLinked()) {
		return;
	}
	var VPS = this.getVPSMatrix(scene.camera, this.canvas);
	
	for(var i = 0; i < scene.model.length; i++) {
		var model = scene.model[i];
		var M = this.getMatrixWorldTransform(model);
		var MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
		var gldata = model.getGLData(this);
		
		this.bindVBO(gldata.position, "position", 3);
		this.bindIBO(gldata.ibo);
		this.bindUniformMatrix(MVP.toFloat32Array(), "mvpMatrix");
		this.drawElements(gldata.ibosize);
	}
};

/**
 * /////////////////////////////////////////////////////////
 * 既存の部品に WebGL 用の情報を記録するための拡張
 * 主に、描写のための VBO と IBO を記録する
 * /////////////////////////////////////////////////////////
 */

S3Mesh.prototype.deleteGLData = function(s3system) {
	if(this.gldata === undefined) {
		return;
	}
	for(var key in this.gldata) {
		if(key !== "indexsize") {
			s3system.deleteBuffer(this.gldata[key]);
		}
	}
};

S3Mesh.prototype.initGLData = function(s3system) {
	if((!this.isFreezed) && (!this.gldata === undefined)) {
		return;
	}
	var freeze = this.getFreezedMesh();
	this.gldata = {};
	this.gldata.ibosize		= freeze.triangle.length;
	this.gldata.ibo			= s3system.createIBO(freeze.triangle);
	for(var key in freeze) {
		if(key !== "triangle") {
			this.gldata[key]	= s3system.createVBO(freeze[key]);
		}
	}
};

S3Mesh.prototype.getGLData = function(s3system) {
	this.initGLData(s3system);
	return this.gldata;
};

S3Model.prototype.getGLData = function(s3system) {
	return this.getMesh().getGLData(s3system);
};
