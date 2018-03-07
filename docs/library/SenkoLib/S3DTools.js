"use strict";

/* global S3Mesh */

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
 *  S3D.js
 *  部分的に、InputDevice.js が必要です。
 */

// 3DCGツールを作るうえであると便利なツール
// 必ずしもなくてもよい

var CameraController = function() {
	this.mouse		= new IDTouch();
	this.data		= new IDTouch();
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

S3Mesh.DATA_MQO = "MQO";

/**
 * メタセコイア形式で入力
 * ただしある程度手動で修正しないといけません。
 * @param {S3Mesh} mesh
 * @param {String} text
 * @returns {unresolved}
 */
S3Mesh.DATA_INPUT_FUNCTION[S3Mesh.DATA_MQO] = function(mesh, text) {
	var lines = text.split("\n");
	var i;
	var block_stack = [];
	var block_type  = "none";
	var block_level = 0;
	var vertex_offset	= 0;
	var vertex_point	= 0;
	var face_offset		= 0;
	var face_point		= 0;
	// 半角スペース区切りにの文字列数値を、数値型配列にする
	var toNumberArray = function(text) {
		var x = text.split(" "), out = [],i = 0;
		for(i = 0; i < x.length; i++) {
			out[i] = parseFloat(x[i]);
		}
		return out;
	};
	// func(XXX) のXXXの中身を抜き出す
	var getValueFromPrm = function(text, parameter) {
		var x = text.split(" " + parameter + "(");
		if(x.length === 1) {
			return [];
		}
		return x[1].split(")")[0];
	};
	// func(XXX) のXXXの中を抜き出して数値化
	var getNumberFromPrm = function(text, parameter) {
		var value = getValueFromPrm(text, parameter);
		if(value.length === 0) {
			return [];
		}
		return toNumberArray(value);
	};
	// func(XXX) のXXXの中を抜き出して文字列取得
	var getURLFromPrm = function(text, parameter) {
		var value = getValueFromPrm(text, parameter);
		if(value.length === 0) {
			return null;
		}
		var x = value.split("\"");
		if(x.length !== 3) {
			return null;
		}
		return x[1];
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
			var material_name = first.replace(/\"/g, "");
			var material_type = {};
			var val;
			val = getNumberFromPrm(trim_line, "col");
			if(val.length !== 0) {
				material_type.color = new S3Vector(val[0], val[1], val[2], val[3]);
			}
			val = getNumberFromPrm(trim_line, "dif");
			if(val.length !== 0) {
				material_type.diffuse = val[0];
			}
			val = getNumberFromPrm(trim_line, "amb");
			if(val.length !== 0) {
				material_type.ambient = new S3Vector(val[0], val[0], val[0]);
			}
			val = getNumberFromPrm(trim_line, "amb_col");
			if(val.length !== 0) {
				material_type.ambient = new S3Vector(val[0], val[1], val[2]);
			}
			val = getNumberFromPrm(trim_line, "emi");
			if(val.length !== 0) {
				material_type.emission = new S3Vector(val[0], val[0], val[0]);
			}
			val = getNumberFromPrm(trim_line, "emi_col");
			if(val.length !== 0) {
				material_type.emission = new S3Vector(val[0], val[1], val[2]);
			}
			val = getNumberFromPrm(trim_line, "spc");
			if(val.length !== 0) {
				material_type.specular = new S3Vector(val[0], val[0], val[0]);
			}
			val = getNumberFromPrm(trim_line, "spc_col");
			if(val.length !== 0) {
				material_type.specular = new S3Vector(val[0], val[1], val[2]);
			}
			val = getNumberFromPrm(trim_line, "power");
			if(val.length !== 0) {
				material_type.power = val[0];
			}
			val = getNumberFromPrm(trim_line, "reflect");
			if(val.length !== 0) {
				material_type.reflect = val[0];
			}
			val = getURLFromPrm(trim_line, "tex");
			if(val) {
			}
			var material = new S3Material(material_name, material_type);
			mesh.addMaterial(material);
		}
		else if(block_type === "vertex") {
			var words = toNumberArray(trim_line);
			var vector = new S3Vector(words[0], words[1], words[2]);
			var vertex = new S3Vertex(vector);
			mesh.addVertex(vertex);
			vertex_point++;
		}
		else if(block_type === "face") {
			var facenum = parseInt(first);
			var v		= getNumberFromPrm(trim_line, "V");
			var uv_a	= getNumberFromPrm(trim_line, "UV");
			var uv		= [];
			var material= getNumberFromPrm(trim_line, "M");
			material = (material.length === 0) ? 0 : material[0];
			var j = 0;
			if(uv_a.length !== 0) {
				for(j = 0; j < facenum; j++) {
					uv[j] = new S3Vector( uv_a[j * 2], uv_a[j * 2 + 1], 0);
				}
			}
			for(j = 0;j < facenum - 2; j++) {
				var ti = ((j % 2) === 0) ? 
						new S3TriangleIndex(j    , j + 1, j + 2, v, material, uv)
					:	new S3TriangleIndex(j - 1, j + 1, j + 2, v, material, uv);
				mesh.addTriangleIndex(ti);
				face_point++;
			}
		}
	}
	return mesh;
};

/**
 * メタセコイア形式で出力
 * ただしある程度手動で修正しないといけません。
 * @param {S3Mesh} mesh
 * @returns {String}
 */
S3Mesh.DATA_OUTPUT_FUNCTION[S3Mesh.DATA_MQO] = function(mesh) {
	var i;
	var output = [];
	var vertex			= mesh.getVertexArray(); 
	var triangleindex	= mesh.getTriangleIndexArray(); 
	var material		= mesh.getMaterialArray();
	
	// 材質の出力
	output.push("Material " + material.length + " {");
	for(i = 0; i < material.length; i++) {
		var mv = material[i];
		//  こんな感じにする必要がある・・・
		// "mat" shader(3) col(1.000 1.000 1.000 0.138) dif(0.213) amb(0.884) emi(0.301) spc(0.141) power(38.75) amb_col(1.000 0.996 0.000) emi_col(1.000 0.000 0.016) spc_col(0.090 0.000 1.000) reflect(0.338) refract(2.450)
		output.push("\t\"" + mv.name + "\" col(1.000 1.000 1.000 1.000) dif(0.800) amb(0.600) emi(0.000) spc(0.000) power(5.00)");
	}
	output.push("}");
	
	// オブジェクトの出力
	output.push("Object \"obj1\" {");
	{
		// 頂点の出力
		output.push("\tvertex " + vertex.length + " {");
		for(i = 0; i < vertex.length; i++) {
			var vp = vertex[i].position;
			output.push("\t\t" + vp.x + " " + vp.y + " " + vp.z);
		}
		output.push("}");

		// 面の定義
		output.push("\tface " + triangleindex.length + " {");
		for(i = 0; i < triangleindex.length; i++) {
			var ti = triangleindex[i];
			var line = "\t\t3";
			// 座標と材質は必ずある
			line += " V(" + ti.index[0] + " " + ti.index[1] + " " + ti.index[2] + ")";
			line += " M(" + ti.materialIndex + ")";
			// UVはないかもしれないので、条件を付ける
			if(ti.uv !== undefined) {
				line += " UV(" + ti.uv[0] + " " + ti.uv[1] + " " + ti.uv[2] +")";
			}
			output.push(line);
		}
	}
	output.push("\t}");
	
	output.push("}");
	return output.join("\n");
};
