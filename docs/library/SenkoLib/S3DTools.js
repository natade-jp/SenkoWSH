/* global S3Mesh */

"use strict";

﻿/**
 * SenkoLib S3DTools.js
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 * 
 * DEPENDENT LIBRARIES:
 * 先に、S3D.js が必要です。
 * 部分的に、InputDevice.js が必要です。
 */

var CameraController = function() {
	this.mouse		= new IDMouse();
	this.data		= new IDMouse();
	this.moveDistance	= 4.0;
	this.moveRotate		= 0.5;
	this.moveTranslateRelative	= 0.1;
};
CameraController.prototype.setCanvas = function(element) {
	this.mouse.setListenerOnElement(element);
};
CameraController.prototype.setCamera = function(camera) {
	this.camera = camera.clone();
};
CameraController.prototype.getCamera = function() {
	this.mouse.pickInput(this.data);
	{
		this.camera.translateRelative(
			new S3Vector(
				- this.data.left.dragged.x * this.moveTranslateRelative,
				this.data.left.dragged.y * this.moveTranslateRelative,
				0
			)
		);
	}
	{
		this.camera.addRotateY(   this.data.right.dragged.x * this.moveRotate );
		this.camera.addRotateX( - this.data.right.dragged.y * this.moveRotate );
	}
	{
		var distance = this.camera.getDistance();
		var l = this.data.wheelrotation;
		distance -= l * this.moveDistance * Math.log(distance);
		this.camera.setDistance(distance);
	}
	return this.camera;
};

/**
 * メタセコイア形式で出力
 * ただしある程度手動で修正しないといけません。
 * @returns {String}
 */
S3Mesh.prototype.toMQO = function() {
	var i;
	var output = [];
	
	// 材質の出力
	output.push("Material " + this.material.length + " {");
	for(i = 0; i < this.material.length; i++) {
		var mv = this.material[i];
		output.push("\t\"" + mv.name + "\" col(1.000 1.000 1.000 1.000) dif(0.800) amb(0.600) emi(0.000) spc(0.000) power(5.00)");
	}
	output.push("}");
	
	// オブジェクトの出力
	output.push("Object \"obj1\" {");
	{
		// 頂点の出力
		output.push("\tvertex " + this.vertex.length + " {");
		for(i = 0; i < this.vertex.length; i++) {
			var vp = this.vertex[i].position;
			output.push("\t\t" + vp.x + " " + vp.y + " " + vp.z);
		}
		output.push("}");

		// 面の定義
		output.push("\tface " + this.index.length + " {");
		for(i = 0; i < this.index.length; i++) {
			var vi = this.index[i];
			var line = "\t\t3";
			if(vi.i1 !== undefined) {
				line += " V(" + vi.i1 + " " + vi.i2 + " " + vi.i3 + ")";
			}
			if(vi.materialIndex !== undefined) {
				line += " M(" + vi.materialIndex + ")";
			}
			if(vi.uv1 !== undefined) {
				line += " UV(" + vi.uv1 + " " + vi.uv2 + " " + vi.uv3 +")";
			}
			output.push(line);
		}
	}
	output.push("\t}");
	
	output.push("}");
	return output.join("\n");
};

/**
 * メタセコイア形式で入力
 * ただしある程度手動で修正しないといけません。
 * @param {String} text
 * @returns {S3Mesh}
 */
S3Mesh.fromMQO = function(text) {
	var lines = text.split("\n");
	var i;
	var block_stack = [];
	var block_type  = "none";
	var block_level = 0;
	var mesh = new S3Mesh();
	var vertex_offset	= 0;
	var vertex_point	= 0;
	var face_offset		= 0;
	var face_point		= 0;
	var toValueArray = function(text) {
		var x = text.split(" "), out = [],i = 0;
		for(i = 0; i < x.length; i++) {
			out[i] = parseFloat(x[i]);
		}
		return out;
	};
	var getValueFromPrm = function(text, parameter) {
		var x = text.split(" " + parameter + "(");
		if(x.length === 1) {
			return [];
		}
		return toValueArray(x[1].split(")")[0]);
	};
	for(i = 0;i < lines.length; i++) {
		var trim_line = lines[i].replace(/^\s+|\s+$/g, "");
		var first = trim_line.split(" ")[0];
		if ( trim_line.indexOf("{") !== -1) {
			if(first === "Object") {
				vertex_offset	+= vertex_point;
				face_offset		+= face_point;
				vertex_point	= 0;
				face_point		= 0;
			}
			// 階層に入る前の位置を保存
			block_stack.push(block_type);
			block_type = first;
			block_level++;
			continue;
		}
		else if( trim_line.indexOf("}") !== -1) {
			block_type = block_stack.pop();
			block_level--;
			continue;
		}
		if(	(block_type === "Thumbnail") || 
			(block_type === "none")) {
			continue;
		}
		if(block_type === "Material") {
			var material_name = first.replace("\"", "");
			var material = new S3Material(material_name);
			mesh.addMaterial(material);
		}
		else if(block_type === "vertex") {
			var words = toValueArray(trim_line);
			var vector = new S3Vector(words[0], words[1], words[2]);
			var vertex = new S3Vertex(vector);
			mesh.addVertex(vertex);
			vertex_point++;
		}
		else if(block_type === "face") {
			var facenum = parseInt(first);
			var v		= getValueFromPrm(trim_line, "V");
			var uv_a	= getValueFromPrm(trim_line, "UV");
			var uv		= [];
			var material= getValueFromPrm(trim_line, "M");
			material = (material.length === 0) ? 0 : material[0];
			material = (material === -1) ? 0 : material;
			var j = 0;
			if(uv_a.length !== 0) {
				for(j = 0; j < facenum; j++) {
					uv[j] = new S3Vector( uv_a[j * 2], uv_a[j * 2 + 1], 0);
				}
			}
			for(j = 0;j < facenum - 2; j++) {
				var ti;
				if(uv_a.length === 0) {
					ti = ((j % 2) === 0) ? 
							new S3TriangleIndex(v[j], v[j + 1], v[j + 2], material)
						:	new S3TriangleIndex(v[j - 1], v[j + 1], v[j + 2], material);
				}
				else {
					ti = ((j % 2) === 0) ? 
							new S3TriangleIndex(v[j], v[j + 1], v[j + 2], material, uv[j], uv[j + 1], uv[j + 2])
						:	new S3TriangleIndex(v[j - 1], v[j + 1], v[j + 2], material, uv[j - 1], uv[j + 1], uv[j + 2]);
				}
				mesh.addTriangleIndex(ti);
				face_point++;
			}
		}
	}
	return mesh;
};
