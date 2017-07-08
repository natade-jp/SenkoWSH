/* global S3System, S3Mesh, S3Model */

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

S3System.download = function(url, callback) {
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

S3System.prototype.setCanvasGL = function(canvas) {
	// 初期化色
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	this.canvas = canvas;
	this.gldata = new Object();
	this.gldata.gl = gl;
};

S3System.prototype.getShaderType = function(text) {
	var gl = this.gldata.gl;
	var dotlist = text.split(".");
	var ext = "";
	if(dotlist.length > 1) {
		ext = dotlist[dotlist.length - 1].toLocaleString();
	}
	if((ext==="vert") || (ext==="vs") || (text==="x-shader/x-vertex")) {
		return gl.VERTEX_SHADER;
	}
	else if((ext==="frag") || (ext==="fs") || (text==="x-shader/x-fragment")) {
		return gl.FRAGMENT_SHADER;
	}
	else {
		throw "IllegalArgumentException";
	}
};

S3System.prototype.compileShader = function(code, sharder_type) {
	var gl = this.gldata.gl;
	var shader = gl.createShader(sharder_type);
	gl.shaderSource(shader, code);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		return shader;
	}else{
		console.log("compile error " + gl.getShaderInfoLog(shader));
		return null;
	}
};

S3System.prototype.setShader = function(shader, sharder_type) {
	var gl = this.gldata.gl;
	if(sharder_type === gl.VERTEX_SHADER) {
		this.gldata.vertex_shader = shader;
	}
	else if(sharder_type === gl.FRAGMENT_SHADER) {
		this.gldata.fragment_shader = shader;
	}
	if(!this.gldata.vertex_shader || !this.gldata.fragment_shader) {
		// 両方とも読み込まれていなかったらここで終了
		return;
	}
	var program = gl.createProgram();
    gl.attachShader(program, this.gldata.vertex_shader);
    gl.attachShader(program, this.gldata.fragment_shader);
	gl.linkProgram(program);
	if(gl.getProgramParameter(program, gl.LINK_STATUS)){
		gl.useProgram(program);
		this.gldata.program = program;
	}
	else {
		console.log("link error " + gl.getProgramInfoLog(program));
	}
};

S3System.prototype.setShaderCode = function(code, sharder_type) {
	var shader = this.compileShader(code, sharder_type);
	if(shader !== null) {
		this.setShader(shader, sharder_type);
	}
};

S3System.prototype.setShaderURL = function(url) {
	var that = this;
	var sharder_type = this.getShaderType(url);
	var downloadCallback = function(code) {
		that.setShaderCode(code, sharder_type);
	};
	S3System.download(url, downloadCallback);
};

S3System.prototype.clearGL = function() {
	var gl = this.gldata.gl;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

S3System.prototype.createVBO = function(data) {
	var gl = this.gldata.gl;
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return vbo;
};

S3System.prototype.createIBO = function(data) {
	var gl = this.gldata.gl;
	var ibo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	return ibo;
};

S3System.prototype.bindVBO = function(vbo, attribute_name, size) {
	var gl = this.gldata.gl;
	var prg = this.gldata.program;
	if(prg === undefined) {
		return;
	}
	var location = gl.getAttribLocation(prg, attribute_name);
	if(location === -1) {
		console.log("bind error1 " + attribute_name);
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.enableVertexAttribArray(location);
	gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
	return;
};

S3System.prototype.bindIBO = function(ibo) {
	var gl = this.gldata.gl;
	var prg = this.gldata.program;
	if(prg === undefined) {
		return;
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	return;
};

S3System.prototype.bindUniformMatrix = function(mat, attribute_name) {
	var gl = this.gldata.gl;
	var prg = this.gldata.program;
	if(prg === undefined) {
		return;
	}
	var location = gl.getUniformLocation(prg, attribute_name);
	if(location === -1) {
		console.log("bind error2 " + attribute_name);
		return;
	}
	gl.uniformMatrix4fv(location, false, mat);
	return;
};

S3System.prototype.drawElements = function(indexsize) {
	var gl = this.gldata.gl;
	var prg = this.gldata.program;
	if(prg === undefined) {
		return;
	}
	gl.drawElements(gl.TRIANGLES, indexsize, gl.UNSIGNED_SHORT, 0);
	gl.flush();
};

S3System.prototype.deleteBuffer = function(data) {
	var gl = this.gldata.gl;
	gl.deleteBuffer(data);
};

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

S3System.prototype.drawSceneGL = function(scene) {
	var prg = this.gldata.program;
	if(prg === undefined) {
		return;
	}
	var VPS = this.getVPSMatrix(scene.camera, this.canvas);
	
	var i = 0;
	for(i = 0; i < scene.model.length; i++) {
		var model = scene.model[i];
		var M = this.getMatrixWorldTransform(model);
		var MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
		var gldata = model.getGLData(this);
		
		this.bindVBO(gldata.position, "position", 3);
		this.bindIBO(gldata.ibo);
		this.bindUniformMatrix(MVP.toFloat32Array(), "mvpMatrix");
		this.drawElements(gldata.ibosize);
		
	//	var vlist = this._calcVertexTransformation(model.mesh.vertex, MVP, VPS.Viewport);
	//	this._drawPolygon(vlist, model.mesh.triangleindex);
	}
};
