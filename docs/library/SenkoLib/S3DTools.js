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
 * @returns {S3Mesh}
 */
S3Mesh.fromMQO = function() {
	return null;
};
